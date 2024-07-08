import { db } from '@/utilz/db'
import { stripe } from '@/utilz/stripe'
import express from 'express'
import Stripe from 'stripe'

const webhookRoute = express.Router()

webhookRoute.post('/', async (req: express.Request, res: express.Response) => {
  const body = req.body

  const signature = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! || 'whsec_b7ca55dba161ebc942e5329653fa54340660088f12d066326aa0f0b8f762a99d'
    )
  } catch (error: any) {
    console.log(`⚠️  Webhook signature verification failed.`, error.message)
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }

  const session = event.data.object as Stripe.Checkout.Session
  if (!session) {
    console.error('No session found in event', event)
  }

  const userId = session?.metadata?.userId
  const courseId = session?.metadata?.courseId

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      return res.status(400).send('Webhook Error: Missing metadata')
    }
    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId
      }
    })
  } else {
    return res.status(200).send('Webhook Error: Invalid event type')
  }

  return res.status(200).send(null)
})

export default webhookRoute
