import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class ResetPasswordDto {
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

    @ApiProperty({ example: 'NewP@ssw0rd!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'new_password must be at least 8 characters long',
    })
    @Matches(/\d/, {
        message: 'new_password must contain at least 1 number',
    })
    @Matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/, {
        message: 'new_password must contain at least 1 special character',
    })
    new_password!: string;
}
