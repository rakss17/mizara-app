import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { SigninDto } from '@/auth/dto/signin.dto';
import { VerifyEmailDto } from '@/auth/dto/verify-email.dto';
import { ResendVerificationCodeDto } from '@/auth/dto/resend-verification.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';
import { VerifyPasswordResetCodeDto } from '@/auth/dto/verify-password-reset-code.dto';
import { ResetPasswordDto } from '@/auth/dto/reset-password.dto';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(
            signupDto.first_name,
            signupDto.last_name,
            signupDto.email,
            signupDto.password,
        );
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto.email, signinDto.password);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(
            verifyEmailDto.email,
            verifyEmailDto.code,
        );
    }

    @Post('resend-verification-code')
    @HttpCode(HttpStatus.OK)
    async resendVerificationCode(@Body() dto: ResendVerificationCodeDto) {
        return this.authService.resendVerificationCode(dto.email);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('verify-password-reset-code')
    @HttpCode(HttpStatus.OK)
    async verifyPasswordResetCode(@Body() dto: VerifyPasswordResetCodeDto) {
        return this.authService.verifyPasswordResetCode(dto.email, dto.code);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(
            dto.email,
            dto.code,
            dto.new_password,
        );
    }
}
