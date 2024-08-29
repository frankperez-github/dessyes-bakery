import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest, res: NextApiResponse) {
    const { items } = await req.json();
    try 
    {
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const origin = `${protocol}://${host}`;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: items.map((item: any) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100, // amount in cents
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${origin}/?paymentStatus=success`,
          cancel_url: `${origin}/?paymentStatus=error`,
        });

        return NextResponse.json({ id: session.id }, { status: 200 });
    }
    catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
