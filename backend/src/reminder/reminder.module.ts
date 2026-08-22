import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ReminderSettingsModel } from './models/reminder-settings.model';
import { ReminderSettingsService } from './reminder-settings.service';
import { ReminderSettingsController } from './reminder-settings.controller';
import { RecurringPaymentModule } from '@/recurring-payment/recurring-payment.module';

@Module({
    imports: [
        SequelizeModule.forFeature([ReminderSettingsModel]),
        RecurringPaymentModule,
    ],
    controllers: [ReminderSettingsController],
    providers: [ReminderSettingsService],
})
export class ReminderModule {}
