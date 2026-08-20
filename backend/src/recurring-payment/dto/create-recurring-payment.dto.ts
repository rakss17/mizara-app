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
    @ApiProperty({ example: 'Netflix' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({
        example: RecurringPaymentType.Subscription,
        enum: RecurringPaymentType,
    })
    @IsNotEmpty()
    @IsEnum(RecurringPaymentType)
    type!: RecurringPaymentType;

    @ApiProperty({ example: 'Family plan subscription', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 15.99 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount!: number;

    @ApiProperty({ example: 'USD', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @ApiProperty({ example: 'monthly' })
    @IsNotEmpty()
    @IsString()
    billing_cycle!: string;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    is_auto_renew!: boolean;

    @ApiProperty({ example: false })
    @IsNotEmpty()
    @IsBoolean()
    is_archived!: boolean;

    @ApiProperty({ example: 'netflix-icon', required: false })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({ example: '2026-09-01T00:00:00.000Z' })
    @IsNotEmpty()
    @IsDateString()
    due_date!: Date;
}
