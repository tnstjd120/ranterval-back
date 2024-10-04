import { Inject, Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomErrorCode } from 'src/common/exceptions/custom-error-code.enum';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { googleStrategy } from 'src/auth/jwt-oauth-strategy';
import { Response } from 'express';
import { createRandomNickname } from 'src/common/util/nickname-arrays';

@Injectable()
export class UsersService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly googleStrategy: googleStrategy 
  ) {}

  generateJwtToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }

  async googleLogin(code: string, res: Response) {
    try {
      if (!code) throw new CustomException(CustomErrorCode.INVALID_REQUEST_NULL, "Request is null.");

      const { id_token, refresh_token, userInfo } = await this.googleStrategy.requestTokens(code);
      let userId;

      const existUserQuery = `
                                SELECT id, oAuthId, name, nickName
                                  FROM users 
                                 WHERE oAuthId = ?
                              `;
      const userData = await this.entityManager.query(existUserQuery, [userInfo.email]);
      userId = userData[0].id;

      if (!userData || userData.length === 0) {
        const randomNickname = await createRandomNickname();

        const joinUserQuery = `
                                INSERT INTO users (oAuthId, email, name, nickName, profileImage)
                                     VALUES (?, ?, ?, ?, ?)
                              `;

        await this.entityManager.query(joinUserQuery, [userInfo.email, userInfo.email, userInfo.name, randomNickname, 'og-image.png']);

        const lastIdQuery = `SELECT LAST_INSERT_ID() AS id`;
        const lastIdResult = await this.entityManager.query(lastIdQuery);
        userId = lastIdResult[0].id;
      }

      const getUserInfoQuery = `
                                  SELECT id, oAuthId, email, name, nickName, phone, profileImage, aboutMe, accumulatedAt
                                    FROM users
                                   WHERE id = ?
                                `
      const getUserInfo = await this.entityManager.query(getUserInfoQuery, [userId]);

      //const payload = { id: userData[0].id ? userData[0].id : userId, userName: userInfo.name, userId: userInfo.email };
      //const accessToken = await this.generateJwtToken(payload);
      //const refreshToken = await this.jwtStrategy.generateRefreshToken();

      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
      });

      const expirationTimeInSeconds = 7 * 24 * 60 * 60;
      const expiresAt = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

      await this.redisClient.set(`user:${userId}`, JSON.stringify({ refreshToken: refresh_token, expiresAt: expiresAt }), 'EX', expirationTimeInSeconds);


      return {
        success: true,
        code: 0,
        message: null,
        accessToken: id_token,
        userInfo: getUserInfo
      }
    }catch (e) {
      if (e instanceof CustomException) {
        throw e;
      } 
      else {
        throw new CustomException(CustomErrorCode.INVALID_DATABASE_ERROR, e instanceof Error ? e.message : 'An unexpected error occurred');
      }
    }
  }

  async accessReIssue(accessReIssueDto: any) {
    const { refreshToken, userId }= accessReIssueDto;

    if (!refreshToken || !userId) throw new CustomException(CustomErrorCode.INVALID_REQUEST_NULL, "Request is null.");

    const currnetToken = await this.redisClient.get(`user:${userId}`);

    if (!currnetToken) {
      throw new CustomException(CustomErrorCode.NO_RESULT,'refresh토큰이 존재하지않습니다.');
    }

    if (JSON.parse(currnetToken).refreshToken != refreshToken) {
      throw new CustomException(CustomErrorCode.INVALID_REFRESH_TOKEN,'refresh토큰이 일치하지않습니다.');
    }

    const parsedToken = JSON.parse(currnetToken);
    const { expiresAt } = parsedToken;

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime >= expiresAt) {
        throw new CustomException(CustomErrorCode.TOKEN_EXPIRED, 'refresh 토큰이 만료되었습니다.');
    }

    const { id_token } = await this.googleStrategy.refreshReIssue(refreshToken);

    return {
      success: true,
      code: 0,
      message: null,
      accessToken: id_token
    }
  }

  async editUserInfo(editUserInfoDto: any, id: number) {
    const { email, nickName, phone, aboutMe }= editUserInfoDto;

    const userCheckQuery = `SELECT COUNT(*) as count FROM users WHERE id = ?`;
    const result = await this.entityManager.query(userCheckQuery, [id]);
    
    if (result[0].count === 0) throw new CustomException(CustomErrorCode.NO_RESULT, '유저를 찾을 수 없습니다.');

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) throw new CustomException(CustomErrorCode.EMAIL_INVALID, '이메일 형식이 맞지않습니다.');

    if (nickName.length < 2 || nickName.length > 30) throw new CustomException(CustomErrorCode.NICKNAME_TOO_LONG, '닉네임은 2자 이상 30자 이하여야합니다.');

    if (phone.length > 12) throw new CustomException(CustomErrorCode.PHONE_TOO_LONG, '핸드폰번호는 12자 이하여야합니다.');

    const editUserInfoQuery = `
                                UPDATE users
                                    SET email = ?
                                      , nickName = ?
                                      , phone = ?
                                      , aboutMe = ?
                                  WHERE id = ?
                              `
    await this.entityManager.query(editUserInfoQuery, [email, nickName, phone, aboutMe, id]);

    return {
      success: true,
      code: 0,
      message: null
    }
  }
}
