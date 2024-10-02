import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

//Google Strategy 사용
@Injectable()
export class googleStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor() {
    const callbackURL = googleStrategy.getCallbackURL();

    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT || '',
      clientSecret: process.env.GOOGLE_AUTH_SECRET || '',
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  // 환경에 따라 callback URL을 반환하는 static 메서드
  static getCallbackURL(): string {
    const env = process.env.NODE_ENV;
    const serverUrl = process.env.SERVER_URL;

    if (env === 'production') {
      return `${serverUrl}/api/v1/users/login/google`;
    } else if (env === 'development') {
      return `${serverUrl}/api/v1/users/login/google`;
    } else {
      // 로컬 환경
      return 'http://localhost:3000/api/v1/users/login/google';
    }
  }

  // access_type을 offline으로 설정하여 refresh_token을 요청
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  // 구글로부터 받은 code로 access_token과 refresh_token을 요청
  async requestTokens(code: string): Promise<any> {
    const url = 'https://oauth2.googleapis.com/token';

    const client_id = process.env.GOOGLE_AUTH_CLIENT;
    const client_secret = process.env.GOOGLE_AUTH_SECRET;

    if (!client_id || !client_secret) {
      throw new Error('Google OAuth credentials are missing');
    }

    const values: Record<string, string> = {
      code,
      client_id,
      client_secret,
      redirect_uri: googleStrategy.getCallbackURL(),
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(url, new URLSearchParams(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, id_token } = response.data;

      // access_token을 사용하여 사용자 정보를 가져오기
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userInfo = userInfoResponse.data;

      return { access_token, refresh_token, id_token, userInfo };
    } catch (error) {
      throw new Error('Failed to fetch tokens or user info');
    }
  }

  validate(accessToken: string, refreshToken: string, profile) {
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      accessToken,
      refreshToken, 
    };
  }
}