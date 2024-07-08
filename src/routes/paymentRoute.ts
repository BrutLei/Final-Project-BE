import { db } from '@/utilz/db'
import { stripe } from '@/utilz/stripe'
import express from 'express'
import Stripe from 'stripe'

const paymentRoute = express.Router()

paymentRoute.post(`/:courseId/checkout`, async (req: express.Request, res: express.Response) => {
  const { courseId } = req.params
  const { userId, username, email } = req.body

  try {
    if (!userId || !username || !email) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    const course = await db.course.findUnique({ where: { id: courseId, isPublished: true } })

    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } }
    })

    if (purchase) {
      return res.status(400).send({ message: 'You have already purchased this course' })
    }

    if (!course) {
      return res.status(404).send({ message: 'Course not found' })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: course.title,
            description: course.description!
          },
          unit_amount: Math.round(course.price! * 100)
        }
      }
    ]

    let stripeCustomer = await db.stripeCustomer.findUnique({ where: { userId }, select: { stripeCustomerId: true } })

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        name: username,
        email,
        description: `Customer for ${username}`
      })
      stripeCustomer = await db.stripeCustomer.create({ data: { stripeCustomerId: customer.id, userId } })
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: `http://localhost:5173/course/${courseId}?success=true`,
      cancel_url: `http://localhost:5173/course/${courseId}?canceled=true`,
      metadata: { userId, courseId }
    })
    return res.status(201).json({ url: session.url })
  } catch (error) {
    console.log('[PaymentRoute][create-checkout-session][Error]', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default paymentRoute
