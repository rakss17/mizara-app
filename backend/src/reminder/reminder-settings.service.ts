import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ReminderSettingsModel } from '@/reminder/models/reminder-settings.model';
import { UpsertReminderSettingsDto } from '@/reminder/dto/upsert-reminder-settings.dto';
import { RecurringPaymentService } from '@/recurring-payment/recurring-payment.service';

@Injectable()
export class ReminderSettingsService {
    private readonly logger = new Logger(ReminderSettingsService.name);

    constructor(
        private readonly recurringPaymentService: RecurringPaymentService,
        @InjectModel(ReminderSettingsModel)
        private reminderSettingsModel: typeof ReminderSettingsModel,
    ) {}

    async findOne(
        recurringPaymentId: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        this.logger.log(
            `Fetching reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        await this.recurringPaymentService.findByIdAndOwnerId(
            recurringPaymentId,
            currentUserId,
            currentUserEmail,
        );

        const reminderSettings = await this.reminderSettingsModel.findOne({
            where: { recurring_payment_id: recurringPaymentId },
        });

        if (!reminderSettings) {
            throw new NotFoundException('Reminder settings not found');
        }

        return {
            message: 'Fetched reminder settings successfully',
            data: reminderSettings,
        };
    }

    async upsert(
        recurringPaymentId: string,
        dto: UpsertReminderSettingsDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        this.logger.log(
            `Upserting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        await this.recurringPaymentService.findByIdAndOwnerId(
            recurringPaymentId,
            currentUserId,
            currentUserEmail,
        );

        const [reminderSettings] = await this.reminderSettingsModel.upsert({
            recurring_payment_id: recurringPaymentId,
            is_enabled: dto.is_enabled,
            remind_before_days: dto.remind_before_days,
            channels: dto.channels,
        });

        this.logger.log(
            `Successfully upserted reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        return {
            message: 'Successfully saved reminder settings',
            data: reminderSettings,
        };
    }

    async remove(
        recurringPaymentId: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        this.logger.log(
            `Deleting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        await this.recurringPaymentService.findByIdAndOwnerId(
            recurringPaymentId,
            currentUserId,
            currentUserEmail,
        );

        const reminderSettings = await this.reminderSettingsModel.findOne({
            where: { recurring_payment_id: recurringPaymentId },
        });

        if (!reminderSettings) {
            throw new NotFoundException('Reminder settings not found');
        }

        await reminderSettings.destroy();

        this.logger.log(
            `Successfully deleted reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        return { message: 'Successfully deleted reminder settings' };
    }
}
