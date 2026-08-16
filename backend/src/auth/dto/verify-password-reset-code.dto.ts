import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class VerifyPasswordResetCodeDto {
    @ApiProperty({
        example: 'user@example.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '482913',
    })
    @IsNotEmpty()
    @Matches(/^\d{6}$/, {
        message: 'Code must be exactly 6 digits',
    })
    code!: string;
}
