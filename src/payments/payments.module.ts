import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { StripeModule } from '../stripe/stripe.module.js';


@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [StripeModule]
})
export class PaymentsModule {}
