import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { UserModule } from '@/user/user.module';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { EmailVerificationModel } from '@/auth/models/email-verification.model';
import { EmailModule } from '@/email/email.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        SequelizeModule.forFeature([EmailVerificationModel]),
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
