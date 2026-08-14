import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    
    constructor(
        private readonly userService: UserService
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
        await this.userService.create(first_name, last_name, email, password);

        return { message: `User ${email} signed up successfully` };
    } 
}
