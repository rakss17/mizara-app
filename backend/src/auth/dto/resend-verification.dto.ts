import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class ResendVerificationCodeDto {
    @ApiProperty({
        example: 'user@example.com',
    })
    @IsEmail()
    email!: string;
}
