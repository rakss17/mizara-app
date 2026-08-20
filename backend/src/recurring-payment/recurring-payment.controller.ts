import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { RecurringPaymentService } from '@/recurring-payment/recurring-payment.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateRecurringPaymentDto } from './dto/create-recurring-payment.dto';
import { FindAllRecurringPaymentDto } from './dto/find-all-recurring-payment.dto';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@Controller('/api/recurring-payment')
export class RecurringPaymentController {
    constructor(
        private readonly recurringPaymentService: RecurringPaymentService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateRecurringPaymentDto,
    ) {
        return this.recurringPaymentService.create(dto, user.id, user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: FindAllRecurringPaymentDto,
    ) {
        return this.recurringPaymentService.findAll(
            user.id,
            user.email,
            query,
        );
    }
}
