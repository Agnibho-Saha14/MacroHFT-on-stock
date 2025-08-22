import { useEffect, useState } from 'react'
import { createOrderForSkill, fetchSkills, type Skill } from '../lib/skills'

export default function Browse() {
	const [skills, setSkills] = useState<Skill[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchSkills()
			.then(setSkills)
			.catch(e => setError(e.message || 'Failed'))
			.finally(() => setLoading(false))
	}, [])

	async function buy(skill: Skill) {
		try {
			const { checkoutSessionId } = await createOrderForSkill(skill.id, 'buyer@example.com')
			window.location.href = `https://checkout.stripe.com/c/pay/${checkoutSessionId}`
		} catch (e: any) {
			alert(e.message || 'Failed to start checkout')
		}
	}

	return (
		<div className="container">
			<h2>Browse Skills</h2>
			{loading && <p>Loading…</p>}
			{error && <p style={{color:'#f59e0b'}}>{error}</p>}
			<div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16}}>
				{skills.map(s => (
					<div key={s.id} style={{background:'var(--card)', padding:16, borderRadius:8}}>
						<h3 style={{marginTop:0}}>{s.title}</h3>
						<p style={{opacity:0.9}}>{s.description}</p>
						<p><strong>${(s.priceCents/100).toFixed(2)}</strong> • <span style={{opacity:0.8}}>by {s.seller}</span></p>
						<button onClick={() => buy(s)} style={{padding:'8px 12px', background:'var(--accent)', color:'#04151f', border:'none', borderRadius:6}}>Buy</button>
					</div>
				))}
			</div>
		</div>
	)
}