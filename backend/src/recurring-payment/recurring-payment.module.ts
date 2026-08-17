import { Module } from '@nestjs/common';
import { RecurringPaymentService } from './recurring-payment.service';
import { RecurringPaymentController } from './recurring-payment.controller';

@Module({
  controllers: [RecurringPaymentController],
  providers: [RecurringPaymentService],
})
export class RecurringPaymentModule {}
