import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';

import { UserModel } from '@/user/models/user.model'
import { Sequelize } from 'sequelize';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel) 
        private userModel: typeof UserModel,
        @InjectConnection() 
        private readonly sequelize: Sequelize
    ) {}

    async create(
        first_name: string,
        last_name: string,
        email: string,
        password: string
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Creating user with email: ${email}`);

            const hashedPassword = await bcrypt.hash(password, 12);

            await this.userModel.create(
                {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword
                },
                { transaction }
            );

            await transaction.commit();
            this.logger.log(`User successfully created with email: ${email}`);
            return { message: 'Successfully created user' };
        } catch (error) {
            await transaction.rollback();
            this.logger.error(`Error creating user with email: ${email}`, error);
            throw error;
        }
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }
}
