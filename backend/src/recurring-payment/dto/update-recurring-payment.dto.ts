import { PartialType } from '@nestjs/swagger';

import { CreateRecurringPaymentDto } from '@/recurring-payment/dto/create-recurring-payment.dto';

export class UpdateRecurringPaymentDto extends PartialType(
    CreateRecurringPaymentDto,
) {}
