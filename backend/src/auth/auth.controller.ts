import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { SigninDto } from '@/auth/dto/signin.dto';

@Controller('/api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(
            signupDto.first_name,
            signupDto.last_name,
            signupDto.email,
            signupDto.password
        );
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(
            signinDto.email,
            signinDto.password
        );
    }
}
