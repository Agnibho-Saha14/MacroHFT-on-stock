import { useEffect, useMemo, useRef, useState } from 'react'
import { getSocket, disconnectSocket } from '../lib/socket'

export default function Chat() {
	const [messages, setMessages] = useState<{ user: string; text: string; ts: number; system?: boolean }[]>([])
	const [text, setText] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const params = useMemo(() => {
		const url = new URL(window.location.href)
		return {
			room: url.searchParams.get('room') || 'global',
			user: url.searchParams.get('user') || 'guest'
		}
	}, [])

	useEffect(() => {
		const socket = getSocket(params.room, params.user)
		socket.on('system', (t: string) => setMessages(m => [...m, { user: 'system', text: t, ts: Date.now(), system: true }]))
		socket.on('message', (msg: any) => setMessages(m => [...m, msg]))
		return () => {
			disconnectSocket()
		}
	}, [params.room, params.user])

	function send() {
		const trimmed = text.trim()
		if (!trimmed) return
		const socket = getSocket(params.room, params.user)
		socket.emit('message', { text: trimmed, user: params.user, room: params.room })
		setText('')
		inputRef.current?.focus()
	}

	return (
		<div className="container">
			<h2>Chat</h2>
			<div style={{background:'var(--card)', padding:16, borderRadius:8, minHeight:300}}>
				{messages.map((m, i) => (
					<div key={i} style={{opacity: m.system ? 0.75 : 1}}>
						<strong>{m.user}: </strong><span>{m.text}</span>
					</div>
				))}
			</div>
			<div style={{display:'flex', gap:8, marginTop:12}}>
				<input ref={inputRef} value={text} onChange={e => setText(e.target.value)} placeholder={`Message #${params.room}`} style={{flex:1, padding:8, borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'var(--text)'}} />
				<button onClick={send} style={{padding:'8px 12px', background:'var(--accent)', color:'#04151f', border:'none', borderRadius:6}}>Send</button>
			</div>
		</div>
	)
}