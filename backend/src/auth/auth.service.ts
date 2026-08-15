import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signup(
        first_name: string,
        last_name: string,
        email: string,
        password: string
    ) {
        this.logger.log(`Signing up user with email: ${email}`);

        const user = await this.userService.findByEmail(email);
        if (user) {
            this.logger.warn(`User already exists with email: ${email}`);
            throw new BadRequestException(`User with email ${email} already exists`);
        }

        const createdUser = await this.userService.create(first_name, last_name, email, password);
        const payload = { 
            sub: createdUser.data.id,
            email: createdUser.data.email 
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.log(`User signed up successfully with email: ${createdUser.data.email}`);

        return { message: `User ${createdUser.data.email} signed up successfully`, data: { accessToken } };
    }
    
    async signin(email: string, password: string) {
        this.logger.log(`Signing in user with email: ${email}`);

        const validatedUser = await this.userService.validateCredentials(email, password);

        if (!validatedUser) {
            this.logger.warn(`Invalid email or password for email: ${email}`);
            throw new BadRequestException('Invalid email or password');
        }

        const payload = { 
            sub: validatedUser.data.id,
            email: validatedUser.data.email 
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.log(`User signed in successfully with email: ${validatedUser.data.email}`);

        return { message: `User ${validatedUser.data.email} signed in successfully`, data: { accessToken } };
    }
}
