import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class SignupDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    first_name!: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    last_name!: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'P@ssw0rd!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    @Matches(/\d/, {
        message: 'Password must contain at least 1 number',
    })
    @Matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/`~;'+=]/, {
        message: 'Password must contain at least 1 special character',
    })
    password!: string;
}