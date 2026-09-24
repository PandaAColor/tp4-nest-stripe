import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service.js';

@Controller('stripe')
export class StripeController {

    constructor(
        private readonly stripeService: StripeService,
    ) {}

    @Post('checkout')
    async createCheckout(
        @Body()
        body: {
            orderId: string;
            items: {
                name: string;
                price: number;
                quantity: number;
            }[];
        },
    ) {
        const session = await this.stripeService.createCheckoutSession(
            body.orderId,
            body.items,
        );

        return {
            url: session.url,
        };
    }
}
