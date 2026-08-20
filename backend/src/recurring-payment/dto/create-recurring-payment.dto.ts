import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

import { RecurringPaymentType } from '@/common/enum';

export class CreateRecurringPaymentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(RecurringPaymentType)
    type!: RecurringPaymentType;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount!: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    billing_cycle!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    is_auto_renew!: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    is_archived!: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    due_date!: Date;
}
