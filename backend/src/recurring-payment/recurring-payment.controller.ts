import { Controller } from '@nestjs/common';
import { RecurringPaymentService } from './recurring-payment.service';

@Controller('/api/recurring-payment')
export class RecurringPaymentController {
    constructor(
        private readonly recurringPaymentService: RecurringPaymentService,
    ) {}
}
