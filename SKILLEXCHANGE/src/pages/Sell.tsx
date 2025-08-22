import { useState } from 'react'
import { createSkill } from '../lib/skills'

export default function Sell() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState(2500)
	const [seller, setSeller] = useState('seller@example.com')
	const [status, setStatus] = useState<string | null>(null)

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		try {
			setStatus(null)
			await createSkill({ title, description, priceCents: Number(price), seller })
			setStatus('Created! Visit Browse to see your listing.')
			setTitle('')
			setDescription('')
			setPrice(2500)
		} catch (e: any) {
			setStatus(e.message || 'Failed')
		}
	}

	return (
		<div className="container">
			<h2>Sell Your Skill</h2>
			<form onSubmit={submit} style={{display:'grid', gap:12, maxWidth:520}}>
				<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{padding:8, borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'var(--text)'}} />
				<textarea required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" rows={4} style={{padding:8, borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'var(--text)'}} />
				<input required type="number" min={100} step={50} value={price} onChange={e=>setPrice(parseInt(e.target.value,10))} placeholder="Price (cents)" style={{padding:8, borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'var(--text)'}} />
				<input required value={seller} onChange={e=>setSeller(e.target.value)} placeholder="Seller identifier" style={{padding:8, borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'var(--text)'}} />
				<button type="submit" style={{padding:'8px 12px', background:'var(--accent)', color:'#04151f', border:'none', borderRadius:6}}>Create Listing</button>
				{status && <p style={{opacity:0.9}}>{status}</p>}
			</form>
		</div>
	)
}