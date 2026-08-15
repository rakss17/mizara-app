import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { Sequelize, Transaction } from 'sequelize';

import { UserService } from '@/user/user.service';
import { UserStatus } from '@/common/enum';
import { EmailVerificationModel } from '@/auth/models/email-verification.model';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectModel(EmailVerificationModel)
        private readonly emailVerificationModel: typeof EmailVerificationModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async signup(
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Signing up user with email: ${email}`);

            const user = await this.userService.findByEmail(email);
            if (user) {
                this.logger.warn(`User already exists with email: ${email}`);
                throw new BadRequestException(
                    `User with email ${email} already exists`,
                );
            }

            const createdUser = await this.userService.create(
                first_name,
                last_name,
                email,
                password,
                transaction,
            );

            await this.createEmailVerificationCode(
                createdUser.data.id!,
                email,
                transaction,
            );

            await transaction.commit();

            this.logger.log(
                `User signed up successfully with email: ${createdUser.data.email}`,
            );

            return {
                message: `User ${createdUser.data.email} signed up successfully. Please check your email for the verification code.`,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error signing up user with email: ${email}`,
                error,
            );
            throw error;
        }
    }

    async signin(email: string, password: string) {
        this.logger.log(`Signing in user with email: ${email}`);

        const validatedUser = await this.userService.validateCredentials(
            email,
            password,
        );

        if (!validatedUser) {
            this.logger.warn(`Invalid email or password for email: ${email}`);
            throw new BadRequestException('Invalid email or password');
        }

        if (validatedUser.data.status === UserStatus.Unverified) {
            this.logger.warn(
                `User email is not yet verified for email: ${email}`,
            );
            throw new BadRequestException('Email is not yet verified');
        }

        const payload = {
            sub: validatedUser.data.id,
            email: validatedUser.data.email,
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.log(
            `User signed in successfully with email: ${validatedUser.data.email}`,
        );

        return {
            message: `User ${validatedUser.data.email} signed in successfully`,
            data: { accessToken },
        };
    }

    private async createEmailVerificationCode(
        userId: string,
        email: string,
        transaction: Transaction,
    ) {
        this.logger.log(`Creating email verification code for user: ${email}`);
        const code = randomInt(100000, 1000000).toString();

        const codeHash = await bcrypt.hash(code, 10);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.emailVerificationModel.create(
            {
                user_id: userId,
                code_hash: codeHash,
                expires_at: expiresAt,
                attempts: 0,
            },
            { transaction },
        );

        //TODO: Send email here
        console.log(`Verification code for ${email}: ${code}`);

        this.logger.log(`Email verification code created for user: ${email}`);
    }

    async verifyEmail(email: string, code: string) {
        this.logger.log(`Verifying email for user: ${email}`);

        const user = await this.userService.findByEmail(email);

        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            throw new NotFoundException('User not found.');
        }

        if (user.is_email_verified) {
            this.logger.warn(`Email already verified for user: ${email}`);
            throw new BadRequestException('Email is already verified.');
        }

        const verification = await this.emailVerificationModel.findOne({
            where: {
                user_id: user.id,
                verified_at: null,
            },
            order: [['created_at', 'DESC']],
        });

        if (!verification) {
            this.logger.warn(
                `No active verification code found for user: ${email}`,
            );
            throw new BadRequestException('No active verification code found.');
        }

        if (verification.expires_at.getTime() < Date.now()) {
            this.logger.warn(`Verification code expired for user: ${email}`);
            throw new BadRequestException('Verification code has expired.');
        }

        if (verification.attempts >= 5) {
            this.logger.warn(`Too many attempts for user: ${email}`);
            throw new BadRequestException(
                'Too many attempts. Please request a new verification code.',
            );
        }

        const isValid = await bcrypt.compare(code, verification.code_hash);

        if (!isValid) {
            this.logger.warn(`Invalid verification code for user: ${email}`);

            await verification.increment('attempts');

            throw new BadRequestException('Invalid verification code.');
        }

        const transaction = await this.sequelize.transaction();

        try {
            user.is_email_verified = true;

            await user.save({
                transaction,
            });

            verification.verified_at = new Date();

            await verification.save({
                transaction,
            });

            await transaction.commit();

            this.logger.log(`Email verified successfully for user: ${email}`);

            return {
                message: 'Email verified successfully.',
            };
        } catch (error) {
            await transaction.rollback();
            this.logger.error(
                `Error verifying email for user: ${email}`,
                error,
            );
            throw error;
        }
    }
}
