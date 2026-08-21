import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { CreateRecurringPaymentDto } from '@/recurring-payment/dto/create-recurring-payment.dto';
import { FindAllRecurringPaymentDto } from '@/recurring-payment/dto/find-all-recurring-payment.dto';
import { UpdateRecurringPaymentDto } from '@/recurring-payment/dto/update-recurring-payment.dto';

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
                    due_date: new Date(dto.due_date),
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

    async update(
        id: string,
        dto: UpdateRecurringPaymentDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Updating recurring payment ${id} for user: ${currentUserEmail}`,
            );

            const recurringPayment = await this.recurringPaymentModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!recurringPayment) {
                this.logger.warn(
                    `Recurring payment ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Recurring payment not found');
            }

            await recurringPayment.update(
                {
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.type !== undefined && { type: dto.type }),
                    ...(dto.description !== undefined && {
                        description: dto.description,
                    }),
                    ...(dto.amount !== undefined && { amount: dto.amount }),
                    ...(dto.currency !== undefined && {
                        currency: dto.currency,
                    }),
                    ...(dto.billing_cycle !== undefined && {
                        billing_cycle: dto.billing_cycle,
                    }),
                    ...(dto.due_date !== undefined && {
                        due_date: new Date(dto.due_date),
                    }),
                    ...(dto.is_auto_renew !== undefined && {
                        is_auto_renew: dto.is_auto_renew,
                    }),
                    ...(dto.is_archived !== undefined && {
                        is_archived: dto.is_archived,
                    }),
                    ...(dto.icon !== undefined && { icon: dto.icon }),
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully updated recurring payment ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully updated recurring payment' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error updating recurring payment ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async remove(id: string, currentUserId: string, currentUserEmail: string) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Deleting recurring payment ${id} for user: ${currentUserEmail}`,
            );

            const recurringPayment = await this.recurringPaymentModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!recurringPayment) {
                this.logger.warn(
                    `Recurring payment ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Recurring payment not found');
            }

            await recurringPayment.destroy({ transaction });

            await transaction.commit();

            this.logger.log(
                `Successfully deleted recurring payment ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully deleted recurring payment' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error deleting recurring payment ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }
}
