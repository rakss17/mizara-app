import { Test, TestingModule } from '@nestjs/testing';
import { RecurringPaymentController } from './recurring-payment.controller';
import { RecurringPaymentService } from './recurring-payment.service';

describe('RecurringPaymentController', () => {
  let controller: RecurringPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringPaymentController],
      providers: [RecurringPaymentService],
    }).compile();

    controller = module.get<RecurringPaymentController>(RecurringPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
