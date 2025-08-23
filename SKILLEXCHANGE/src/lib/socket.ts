import { io, Socket } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

let socket: Socket | null = null

export function getSocket(room: string, user: string) {
	if (!socket) {
		socket = io(API_URL, {
			transports: ['websocket'],
			query: { room, user }
		})
	}
	return socket
}

export function disconnectSocket() {
	if (socket) {
		socket.disconnect()
		socket = null
	}
}