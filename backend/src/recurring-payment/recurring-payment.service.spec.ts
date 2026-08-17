import { Test, TestingModule } from '@nestjs/testing';
import { RecurringPaymentService } from './recurring-payment.service';

describe('RecurringPaymentService', () => {
  let service: RecurringPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringPaymentService],
    }).compile();

    service = module.get<RecurringPaymentService>(RecurringPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
