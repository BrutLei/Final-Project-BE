import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY! ||
    'sk_test_51PZtYyKTVG0gMfB1WMqhEHawx4sKt5yuYXDNq4UiGNHTgzY6TG30lJGraMbSTUFuv5hjrJkUXHoWFb52QipG4pBK00wBarPxC5',
  {
    apiVersion: '2024-06-20',
    typescript: true
  }
)
