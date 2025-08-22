import { Router } from 'express'
import { store } from '../data/store'
import Stripe from 'stripe'

export const ordersRouter = Router()

ordersRouter.get('/', (_req, res) => {
	res.json(store.listOrders())
})

ordersRouter.post('/', async (req, res) => {
	try {
		const { skillId, buyer, createCheckout } = req.body || {}
		const skill = store.getSkill(skillId)
		if (!skill) return res.status(404).json({ error: 'Skill not found' })
		const order = store.createOrder({ skillId, buyer: buyer || 'anonymous', amountCents: skill.priceCents })

		if (createCheckout) {
			const secret = process.env.STRIPE_SECRET_KEY
			if (!secret) return res.status(500).json({ error: 'Stripe not configured' })
			const stripe = new Stripe(secret, { apiVersion: '2024-06-20' })
			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				payment_method_types: ['card'],
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product_data: { name: skill.title, description: skill.description },
							unit_amount: skill.priceCents,
						},
						quantity: 1,
					},
				],
				success_url: req.headers.origin ? `${req.headers.origin}/checkout?success=true` : 'http://localhost:5173/checkout?success=true',
				cancel_url: req.headers.origin ? `${req.headers.origin}/checkout?canceled=true` : 'http://localhost:5173/checkout?canceled=true',
			})
			return res.status(201).json({ order, checkoutSessionId: session.id })
		}

		return res.status(201).json({ order })
	} catch (e: any) {
		return res.status(500).json({ error: e.message })
	}
})