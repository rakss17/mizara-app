import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import {
    RecurringPaymentSortBy,
    RecurringPaymentType,
    SortOrder,
} from '@/common/enum';

const toBoolean = ({ value }: { value: unknown }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
};

export class FindAllRecurringPaymentDto {
    @ApiPropertyOptional({ default: 1, example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10, example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({
        enum: RecurringPaymentSortBy,
        default: RecurringPaymentSortBy.DueDate,
        example: RecurringPaymentSortBy.DueDate,
    })
    @IsOptional()
    @IsEnum(RecurringPaymentSortBy)
    sort_by?: RecurringPaymentSortBy = RecurringPaymentSortBy.DueDate;

    @ApiPropertyOptional({
        enum: SortOrder,
        default: SortOrder.ASC,
        example: SortOrder.ASC,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sort_order?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional({
        enum: RecurringPaymentType,
        example: RecurringPaymentType.Subscription,
    })
    @IsOptional()
    @IsEnum(RecurringPaymentType)
    type?: RecurringPaymentType;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @Transform(toBoolean)
    @IsBoolean()
    is_archived?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Transform(toBoolean)
    @IsBoolean()
    is_auto_renew?: boolean;
}
