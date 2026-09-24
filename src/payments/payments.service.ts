import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { StripeService } from '../stripe/stripe.service.js';
import Stripe from 'stripe';



@Injectable()
export class PaymentsService {

  constructor(private readonly stripeService: StripeService) {}

  create(createPaymentDto: CreatePaymentDto) {
    return 'Este es viejo';
  }

  async createCheckoutSesion(createPaymentDto: CreatePaymentDto): Promise<Stripe.Checkout.Session> {
    if (!createPaymentDto.items || createPaymentDto.items.length < 1){
      throw new BadRequestException('No hay items en la compra')
    }
    const checkout = await this.stripeService.createCheckoutSession(createPaymentDto.orderId, createPaymentDto.items);
    console.log('id: ' + checkout.id)
    console.log(checkout.url)
    return checkout;
  }

  async handleWebhook(rawbody : Buffer, signature: string) {

    let event : Stripe.Event;

    try {
      event = this.stripeService.constructEvent(
        rawbody,
        signature,
        process.env.STRIPE_WEBHOOK_KEY || ''
      ) as Stripe.Event;

     
    
    
    }
      catch (err) {
        console.log(err)
        throw new BadRequestException('Error de webhook')
      }

   if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(session.id)
      console.log('se enviará su pedido')
      return 'pago realizado'

    } else if (event.type === 'checkout.session.async_payment_failed') {
      console.log('fallo')
      throw new BadRequestException('Fallo de pago')

    } else {
      console.log('no manejado')
      return 'log no manejado'
    }
    
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
