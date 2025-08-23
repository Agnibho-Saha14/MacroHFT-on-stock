import { useState } from 'react'
import { postJSON } from '../lib/api'

export default function Checkout() {
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<string | null>(null)

	async function startCheckout() {
		try {
			setLoading(true)
			setStatus(null)
			const { id } = await postJSON<{ id: string }>(
				'/api/checkout/create-session',
				{ name: 'Skill Coaching Session', amount: 2500, currency: 'usd' }
			)
			window.location.href = `https://checkout.stripe.com/c/pay/${id}`
		} catch (e: any) {
			setStatus(e.message || 'Failed to create session')
		} finally {
			setLoading(false)
		}
	}

	const url = new URL(window.location.href)
	const success = url.searchParams.get('success') === 'true'
	const canceled = url.searchParams.get('canceled') === 'true'

	return (
		<div className="container">
			<h2>Checkout</h2>
			<p>Secure payment for skills.</p>
			{success && <p style={{color:'#10b981'}}>Payment completed. Thank you!</p>}
			{canceled && <p style={{color:'#f43f5e'}}>Payment canceled.</p>}
			{status && <p style={{color:'#f59e0b'}}>{status}</p>}
			<button disabled={loading} onClick={startCheckout} style={{padding:'10px 14px', background:'var(--accent)', color:'#04151f', border:'none', borderRadius:6}}>
				{loading ? 'Redirecting…' : 'Pay $25.00'}
			</button>
		</div>
	)
}