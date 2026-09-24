
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {apiVersion: '2026-08-26.dahlia'});
    }

    async createCheckoutSession(
        orderId: string,
        items: {
            name: string;
            price: number;
            quantity: number;
        }[],
    ): Promise<Stripe.Checkout.Session> {

        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',

            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price,
                },
                quantity: item.quantity,
            })),

            success_url: process.env.SUCCES_URL,
            cancel_url: process.env.CANCEL_URL,

            metadata: {
                orderId: orderId.toString(),
            },
        });

        return session;
    }
    constructEvent(
        rawbody: Buffer,
        signature: string,
        key: string
    ) {
        return this.stripe.webhooks.constructEvent(rawbody, signature, key)
    }
}

