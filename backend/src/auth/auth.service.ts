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
        const user = await this.userService.findByEmail(email);
        if (user) {
            throw new BadRequestException(`User with email ${email} already exists`);
        }

        this.logger.log(`Signing up user with email: ${email}`);

        const createdUser = await this.userService.create(first_name, last_name, email, password);

        this.logger.log(`User signed up successfully with email: ${createdUser.data.email}`);

        const payload = { 
            sub: createdUser.data.id,
            email: createdUser.data.email 
        };

        const accessToken = this.jwtService.sign(payload);

        return { message: `User ${createdUser.data.email} signed up successfully`, data: { accessToken } };
    } 
}
