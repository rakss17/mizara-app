import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor() {
        const isProduction = process.env.NODE_ENV === 'production';

        this.transporter = nodemailer.createTransport({
            host: isProduction
                ? process.env.PROD_EMAIL_SMTP_HOST
                : process.env.DEV_EMAIL_SMTP_HOST,

            port: Number(
                isProduction
                    ? process.env.PROD_EMAIL_SMTP_PORT
                    : process.env.DEV_EMAIL_SMTP_PORT,
            ),

            secure: true,

            auth: {
                user: isProduction
                    ? process.env.PROD_EMAIL_SMTP_USER
                    : process.env.DEV_EMAIL_SMTP_USER,

                pass: isProduction
                    ? process.env.PROD_EMAIL_SMTP_PASSWORD
                    : process.env.DEV_EMAIL_SMTP_PASSWORD,
            },
        });

        this.from = isProduction
            ? process.env.PROD_EMAIL_SMTP_FROM!
            : process.env.DEV_EMAIL_SMTP_FROM!;
    }

    async sendEmailVerificationCode(
        email: string,
        code: string,
    ): Promise<void> {
        await this.transporter.sendMail({
            from: this.from,
            to: email,
            subject: 'Verify your Mizara account',
            html: `
                <h2>Verify your email</h2>
                <p>Your verification code is:</p>
                <h1>${code}</h1>
                <p>This code will expire soon.</p>
            `,
        });
    }

    async sendPasswordResetCode(email: string, code: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.from,
            to: email,
            subject: 'Reset your Mizara password',
            html: `
                <h2>Reset your password</h2>
                <p>Your password reset code is:</p>
                <h1>${code}</h1>
                <p>This code will expire soon.</p>
            `,
        });
    }
}
