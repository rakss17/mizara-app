import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { CreateRecurringPaymentDto } from '@/recurring-payment/dto/create-recurring-payment.dto';
import { FindAllRecurringPaymentDto } from '@/recurring-payment/dto/find-all-recurring-payment.dto';

@Injectable()
export class RecurringPaymentService {
    private readonly logger = new Logger(RecurringPaymentService.name);

    constructor(
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async create(
        dto: CreateRecurringPaymentDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Creating recurring payment for user: ${currentUserEmail}`,
            );

            await this.recurringPaymentModel.create(
                {
                    user_id: currentUserId,
                    name: dto.name,
                    type: dto.type,
                    description: dto.description,
                    amount: dto.amount,
                    currency: dto.currency,
                    billing_cycle: dto.billing_cycle,
                    due_date: dto.due_date,
                    is_auto_renew: dto.is_auto_renew,
                    is_archived: dto.is_archived,
                    icon: dto.icon,
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully created recurring payment for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully created recurring payment' };
        } catch (error) {
            await transaction.rollback();

            this.logger.error(
                `Error creating recurring payment for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async findAll(
        currentUserId: string,
        currentUserEmail: string,
        query: FindAllRecurringPaymentDto,
    ) {
        try {
            this.logger.log(
                `Fetching recurring payments for user: ${currentUserEmail}`,
            );

            const page = query.page ?? 1;
            const limit = query.limit ?? 10;

            const { rows, count } =
                await this.recurringPaymentModel.findAndCountAll({
                    where: { user_id: currentUserId },
                    limit,
                    offset: (page - 1) * limit,
                    order: [['created_at', 'DESC']],
                });

            this.logger.log(
                `Fetched recurring payments successfully for user: ${currentUserEmail}`,
            );

            return {
                message: 'Fetched recurring payments successfully',
                data: rows,
                metadata: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            this.logger.error(
                `Error fetching recurring payments for user: ${currentUserEmail}`,
            );

            throw error;
        }
    }
}
