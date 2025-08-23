import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Sell from './pages/Sell'
import Chat from './pages/Chat'
import Checkout from './pages/Checkout'

function Navbar() {
	return (
		<header style={{background: 'var(--card)'}}>
			<div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
				<Link to="/" style={{color:'var(--text)', fontWeight:700}}>SKILLEXCHANGE</Link>
				<nav className="nav">
					<NavLink to="/browse">Browse</NavLink>
					<NavLink to="/sell">Sell</NavLink>
					<NavLink to="/chat">Chat</NavLink>
					<NavLink to="/checkout">Checkout</NavLink>
				</nav>
			</div>
		</header>
	)
}

export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/browse" element={<Browse />} />
				<Route path="/sell" element={<Sell />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/checkout" element={<Checkout />} />
			</Routes>
		</>
	)
}