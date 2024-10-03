import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  })],
  providers: [JwtStrategy],
  exports: [JwtModule,JwtStrategy],
})
export class AuthModule {}
