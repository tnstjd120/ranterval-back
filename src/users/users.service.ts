import { Inject, Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomErrorCode } from 'src/common/exceptions/custom-error-code.enum';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { googleStrategy } from 'src/auth/jwt-oauth-strategy';
import { Response } from 'express';

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

      const { access_token, refresh_token,userInfo } = await this.googleStrategy.requestTokens(code);

      let userId;

      const existUserQuery = `
                                SELECT id, oAuthId, name, nickName
                                  FROM users 
                                 WHERE oAuthId = ?
                              `;
      const userData = await this.entityManager.query(existUserQuery, [userInfo.email]);

      if (!userData || userData.length === 0) {
        const joinUserQuery = `
                                INSERT INTO users (oAuthId, email, name)
                                     VALUES (?, ?, ?)
                                
                              `;

        await this.entityManager.query(joinUserQuery, [userInfo.email, userInfo.email, userInfo.name]);

        const lastIdQuery = `SELECT LAST_INSERT_ID() AS id`;
        const lastIdResult = await this.entityManager.query(lastIdQuery);
        userId = lastIdResult[0].id;
      }

      //const payload = { id: userData[0].id ? userData[0].id : userId, userName: userInfo.name, userId: userInfo.email };
      //const accessToken = await this.generateJwtToken(payload);
      //const refreshToken = await this.jwtStrategy.generateRefreshToken();

      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      const expirationTime = 24 * 60 * 60;
      await this.redisClient.set(`user:${userId}`, JSON.stringify({ refresh_token }), 'EX', expirationTime);

      return {
        success: true,
        code: 0,
        message: null,
        accessToken: access_token
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
}
