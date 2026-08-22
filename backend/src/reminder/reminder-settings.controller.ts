import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ReminderSettingsService } from '@/reminder/reminder-settings.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpsertReminderSettingsDto } from './dto/upsert-reminder-settings.dto';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@ApiTags('Reminder Settings')
@ApiBearerAuth()
@Controller('/api/recurring-payment/:recurringPaymentId/reminder-settings')
export class ReminderSettingsController {
    constructor(
        private readonly reminderSettingsService: ReminderSettingsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('recurringPaymentId', ParseUUIDPipe) recurringPaymentId: string,
    ) {
        return this.reminderSettingsService.findOne(
            recurringPaymentId,
            user.id,
            user.email,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put('')
    @HttpCode(HttpStatus.OK)
    async upsert(
        @CurrentUser() user: AuthenticatedUser,
        @Param('recurringPaymentId', ParseUUIDPipe) recurringPaymentId: string,
        @Body() dto: UpsertReminderSettingsDto,
    ) {
        return this.reminderSettingsService.upsert(
            recurringPaymentId,
            dto,
            user.id,
            user.email,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param('recurringPaymentId', ParseUUIDPipe) recurringPaymentId: string,
    ) {
        return this.reminderSettingsService.remove(
            recurringPaymentId,
            user.id,
            user.email,
        );
    }
}
