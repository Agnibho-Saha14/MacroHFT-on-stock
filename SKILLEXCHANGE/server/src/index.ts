import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import Stripe from 'stripe'
import { skillsRouter } from './routes/skills'
import { ordersRouter } from './routes/orders'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
	cors: {
		origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
		methods: ['GET','POST','PUT','DELETE']
	}
})

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'] }))
app.use(express.json())

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})

app.use('/api/skills', skillsRouter)
app.use('/api/orders', ordersRouter)

io.on('connection', (socket) => {
	const { room = 'global', user = 'guest' } = socket.handshake.query as Record<string, string>
	socket.join(room)
	io.to(room).emit('system', `${user} joined ${room}`)

	socket.on('message', (msg: { text: string; user?: string; room?: string }) => {
		const payload = { text: msg.text, user: msg.user || user, ts: Date.now() }
		io.to((msg.room || room) as string).emit('message', payload)
	})

	socket.on('disconnect', () => {
		io.to(room).emit('system', `${user} left ${room}`)
	})
})

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null

app.post('/api/checkout/create-session', async (req, res) => {
	try {
		if (!stripe) return res.status(500).json({ error: 'Stripe not configured' })
		const { name = 'Skill Session', amount = 1000, currency = 'usd' } = req.body || {}
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency,
						product_data: { name },
						unit_amount: amount,
					},
					quantity: 1,
				},
			],
			success_url: req.headers.origin ? `${req.headers.origin}/checkout?success=true` : 'http://localhost:5173/checkout?success=true',
			cancel_url: req.headers.origin ? `${req.headers.origin}/checkout?canceled=true` : 'http://localhost:5173/checkout?canceled=true',
		})
		return res.json({ id: session.id })
	} catch (err: any) {
		return res.status(500).json({ error: err.message })
	}
})

const PORT = Number(process.env.PORT || 4000)
server.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`)
})