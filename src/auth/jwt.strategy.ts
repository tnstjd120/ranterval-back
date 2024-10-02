import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, userId: payload.email, username: payload.name };
  }

  async generateRefreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buffer) => {
        if (err) {
          reject('refresh 토큰 생성 중 오류 발생');
        } else {
          const refreshToken = buffer.toString('base64');
          resolve(refreshToken);
        }
      });
    });
  }
}
