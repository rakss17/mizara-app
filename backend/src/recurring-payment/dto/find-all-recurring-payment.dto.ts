import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { RecurringPaymentSortBy, SortOrder } from '@/common/enum';

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
}
