import { Controller, Get, Post, Body, Patch, Param, Delete, Req, type RawBodyRequest, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('create-payment-session')
  createCheckoutSesion(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Stripe.Checkout.Session> {
    return this.paymentsService.createCheckoutSesion(createPaymentDto);
  }

  @Post('webhook')
  async confirmPayment(@Req() req : RawBodyRequest<Request>, @Headers('stripe-signature') signature: string){
    if(!signature) {
      throw new BadRequestException('no se admiten pagos sin firma')
    }
    if (!req || !req.rawBody) {
      throw new BadRequestException('body vacío')
    }
    return this.paymentsService.handleWebhook(req.rawBody, signature)
  }

  @Get('success')
  paymentSuccess() {
    return { ok: true, message: 'Payment successful' };
  }

  @Get('cancel')
  paymentCancel() {
    return { ok: false, message: 'Payment cancelled' };
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
