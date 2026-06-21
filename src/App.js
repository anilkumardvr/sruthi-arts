import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';

/* ────────────────────────────────────────────────────────────
DATA
──────────────────────────────────────────────────────────── */
const PRODUCTS = [
{ id:1, title:'Radha Krishna - Divine Love', cat:'Religious', price:4500, orig:5500, medium:'Oil on Canvas', size:'24×30 in', stars:5, reviews:42, img:'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80', desc:'A breathtaking depiction of Radha and Krishna in divine love, painted in rich oils on stretched canvas. Each brushstroke captures the spiritual essence of their eternal bond. Ideal for living rooms and puja spaces.' },
{ id:2, title:'Sunset Over the Ganges', cat:'Landscape', price:3200, orig:4000, medium:'Acrylic on Canvas', size:'18×24 in', stars:4, reviews:28, img:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80', desc:'A serene evening scene along the holy Ganges, capturing the golden hues of dusk in vivid acrylics. The reflection of the setting sun on calm waters creates a meditative atmosphere.' },
{ id:3, title:'Madhubani Peacock', cat:'Traditional', price:2800, orig:3500, medium:'Natural Colours on Handmade Paper', size:'16×20 in', stars:5, reviews:61, img:'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', desc:'Authentic Madhubani folk art featuring peacocks in the traditional Bihar style. Every line is hand-drawn with natural pigments following centuries-old techniques passed down through generations.' },
{ id:4, title:'Abstract Bloom', cat:'Abstract', price:5800, orig:7000, medium:'Mixed Media on Canvas', size:'30×36 in', stars:4, reviews:19, img:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80', desc:'An explosion of floral forms in bold, expressive brushwork. Acrylic paint combined with texture paste creates depth and dimension, celebrating nature in abstract form. A true statement piece.' },
{ id:5, title:'Warli Village Life', cat:'Traditional', price:2200, orig:2800, medium:'Acrylic on Canvas', size:'12×16 in', stars:5, reviews:35, img:'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=600&q=80', desc:'Traditional Warli tribal art depicting village life - harvest, dance, community - in the distinctive geometric style of Maharashtra. White figures on earthy red-brown ground.' },
{ id:6, title:'Ocean Dreams', cat:'Abstract', price:6500, orig:8000, medium:'Oil on Canvas', size:'36×48 in', stars:4, reviews:14, img:'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', desc:'Deep blues and teals swirl in this large-format oil painting capturing the mystery and movement of the ocean. A commanding statement piece for any living or office space.' },
{ id:7, title:'Lord Ganesha - Blessings', cat:'Religious', price:3800, orig:4500, medium:'Acrylic on Canvas', size:'20×24 in', stars:5, reviews:77, img:'https://images.unsplash.com/photo-1604423043492-41ccdf9e1bb5?w=600&q=80', desc:'A vibrant portrait of Lord Ganesha radiating blessings and prosperity. Painted in rich jewel tones with intricate decorative detail, perfect for home or puja room. Brings positive energy.' },
{ id:8, title:'Himalayan Serenity', cat:'Landscape', price:4200, orig:5000, medium:'Watercolour on Archival Paper', size:'15×21 in', stars:4, reviews:22, img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', desc:'Misty mountain peaks in early morning light, rendered in delicate watercolour washes. Blues, purples and gold evoke the peaceful grandeur of the Himalayas.' },
{ id:9, title:'Pattachitra Story Panel', cat:'Traditional', price:3100, orig:3800, medium:'Natural Pigments on Cloth', size:'12×24 in', stars:5, reviews:44, img:'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80', desc:'Authentic Pattachitra art from Odisha depicting scenes from the Ramayana. Natural stone pigments on traditional cloth canvas. A collector piece preserving India living heritage.' },
{ id:10, title:'Monsoon Magic', cat:'Abstract', price:4800, orig:5800, medium:'Watercolour on Waterford Paper', size:'18×24 in', stars:4, reviews:26, img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', desc:'The intensity of the Indian monsoon expressed through loose watercolour washes. Blues, greens and greys blend as if the rain itself held a brush. Moody and evocative.' },
{ id:11, title:'Village Market Scene', cat:'Landscape', price:3500, orig:4200, medium:'Gouache on Paper', size:'14×18 in', stars:4, reviews:18, img:'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&q=80', desc:'A lively depiction of a traditional Indian village market, teeming with colour, activity and character. Rendered in opaque gouache with meticulous cultural detail.' },
{ id:12, title:'Professional Acrylic Set - 24col', cat:'Supplies', price:1200, orig:1600, medium:'Art Supply', size:'75ml tubes', stars:4, reviews:89, img:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80', desc:'Artist-grade acrylic paint set with 24 vibrant, lightfast colours in 75ml tubes. Suitable for canvas, paper, and wood. Suitable for both beginners and professionals.' },
{ id:13, title:'Stretched Canvas Bundle (5 Pack)', cat:'Supplies', price:850, orig:1100, medium:'Art Supply', size:'Assorted', stars:4, reviews:56, img:'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', desc:'Triple-primed cotton canvas on solid pine stretcher bars. Pack of 5 assorted sizes. Ready to paint straight out of the box.' },
{ id:14, title:'Kolinsky Sable Brush Set - 12pc', cat:'Supplies', price:2200, orig:2800, medium:'Art Supply', size:'Set of 12', stars:5, reviews:63, img:'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&q=80', desc:'Premium Kolinsky sable hair brushes - the gold standard for watercolour and detail work. 12 sizes from 000 to 12. Exceptional spring and water-holding capacity.' },
];

const CATS = ['All','Religious','Landscape','Traditional','Abstract','Supplies'];

/* ────────────────────────────────────────────────────────────
PAYMENT CONFIG
──────────────────────────────────────────────────────────── */
const UPI_ID = 'anilkumardvr@oksbi';
const UPI_NAME = 'Anil Kumar Dvr';
const UPI_QR_IMG = 'https://i.imgur.com/placeholder.png'; // will be replaced by generated QR

/* ────────────────────────────────────────────────────────────
CART CONTEXT
──────────────────────────────────────────────────────────── */
const CartCtx = createContext();
function CartProvider({ children }) {
const [cart, setCart] = useState([]);
const add = (p, qty = 1) => setCart(prev => {
const ex = prev.find(i => i.id === p.id);
return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i) : [...prev, { ...p, qty }];
});
const remove = id => setCart(prev => prev.filter(i => i.id !== id));
const update = (id, qty) => qty < 1 ? remove(id) : setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
const clearCart = () => setCart([]);
const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
const count = cart.reduce((s, i) => s + i.qty, 0);
return <CartCtx.Provider value={{ cart, add, remove, update, clearCart, total, count }}>{children}</CartCtx.Provider>;
}
const useCart = () => useContext(CartCtx);

/* ── tiny helpers ─────────────────────────────────────────── */
const Stars = ({ n }) => <span style={{ color: '#d4a853' }}>{Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('')}</span>;
const fmt = n => '₹' + n.toLocaleString('en-IN');
const disc = p => Math.round((1 - p.price / p.orig) * 100);

/* ── gold button ──────────────────────────────────────────── */
const GoldBtn = ({ children, onClick, outline = false, style = {} }) => (
<button onClick={onClick} style={{
background: outline ? 'transparent' : 'linear-gradient(135deg,#d4a853,#b8860b)',
border: outline ? '2px solid #d4a853' : 'none',
color: outline ? '#d4a853' : '#0a0502',
padding: '12px 32px', borderRadius: '30px', fontWeight: 700,
fontSize: '0.88rem', cursor: 'pointer', letterSpacing: '1.5px',
textTransform: 'uppercase', fontFamily: "'Lato',sans-serif",
transition: 'opacity 0.2s', ...style
}}
onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
onMouseLeave={e => e.currentTarget.style.opacity = '1'}
>{children}</button>
);

/* ────────────────────────────────────────────────────────────
UPI PAYMENT MODAL
──────────────────────────────────────────────────────────── */
function PaymentModal({ total, onSuccess, onClose }) {
const [copied, setCopied] = useState(false);
const [confirmed, setConfirmed] = useState(false);
const [loading, setLoading] = useState(false);
const grandTotal = Math.round(total * 1.18);
const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('Sruthi Arts Order')}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

const copyUPI = () => {
navigator.clipboard.writeText(UPI_ID).then(() => {
setCopied(true);
setTimeout(() => setCopied(false), 2500);
});
};

const handleConfirm = () => {
setLoading(true);
setTimeout(() => {
setLoading(false);
setConfirmed(true);
setTimeout(() => onSuccess(), 1500);
}, 1200);
};

return (
<div style={{
position: 'fixed', inset: 0, zIndex: 9999,
background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
display: 'flex', alignItems: 'center', justifyContent: 'center',
padding: '1rem'
}}>
<div style={{
background: '#160b03', border: '1px solid rgba(212,168,83,0.35)',
borderRadius: '20px', padding: '2.5rem 2rem', maxWidth: '420px', width: '100%',
position: 'relative', textAlign: 'center',
boxShadow: '0 32px 80px rgba(0,0,0,0.7)'
}}>
{/* Close */}
<button onClick={onClose} style={{
position: 'absolute', top: '1rem', right: '1rem',
background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)',
width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem'
}}>✕</button>

{confirmed ? (
<div style={{ padding: '1rem 0' }}>
<div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
<h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#d4a853', marginBottom: '0.5rem' }}>Payment Confirmed!</h3>
<p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>Processing your order...</p>
</div>
) : (
<>
{/* Header */}
<div style={{ marginBottom: '1.5rem' }}>
<div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', color: 'white', marginBottom: '0.3rem' }}>Complete Payment</h2>
<p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Scan QR or use UPI ID to pay</p>
</div>

{/* Amount */}
<div style={{
background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)',
borderRadius: '12px', padding: '0.9rem 1.2rem', marginBottom: '1.5rem',
display: 'flex', justifyContent: 'space-between', alignItems: 'center'
}}>
<span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>Amount to Pay</span>
<span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', color: '#d4a853', fontWeight: 700 }}>{fmt(grandTotal)}</span>
</div>

{/* QR Code */}
<div style={{
background: 'white', borderRadius: '16px', padding: '1rem',
display: 'inline-block', marginBottom: '1.2rem',
boxShadow: '0 8px 32px rgba(212,168,83,0.2)'
}}>
<img
src={qrUrl}
alt="UPI QR Code"
style={{ width: '200px', height: '200px', display: 'block' }}
/>
</div>

{/* UPI ID */}
<div style={{
background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,83,0.2)',
borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '0.8rem',
display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem'
}}>
<div style={{ textAlign: 'left' }}>
<div style={{ color: '#d4a853', fontSize: '0.7rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>UPI ID</div>
<div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'monospace' }}>{UPI_ID}</div>
</div>
<button onClick={copyUPI} style={{
background: copied ? '#2c7a4b' : 'rgba(212,168,83,0.15)',
border: '1px solid rgba(212,168,83,0.3)', color: copied ? 'white' : '#d4a853',
padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
}}>{copied ? '✓ Copied!' : 'Copy'}</button>
</div>

{/* Pay via app */}
<a href={upiLink} style={{
display: 'block', background: 'rgba(212,168,83,0.08)',
border: '1px solid rgba(212,168,83,0.2)', borderRadius: '10px',
padding: '0.75rem', marginBottom: '1.5rem',
color: '#d4a853', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
transition: 'background 0.2s'
}}>
📱 Open in Google Pay / PhonePe / Paytm
</a>

{/* Steps */}
<div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
<div style={{ color: '#d4a853', fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>How to Pay</div>
{[
'Scan the QR code with any UPI app',
`Or copy UPI ID: ${UPI_ID}`,
`Pay exactly ${fmt(grandTotal)} and add your name as note`,
"Click I've Completed Payment below"
].map((step, i) => (
<div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
<span style={{ color: '#d4a853', fontWeight: 700, minWidth: '16px' }}>{i + 1}.</span>
<span>{step}</span>
</div>
))}
</div>

{/* Confirm button */}
<GoldBtn onClick={handleConfirm} style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1 }}>
{loading ? '⏳ Verifying...' : "✅ I've Completed Payment"}
</GoldBtn>
<p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.8rem' }}>
Your order will be confirmed after payment verification
</p>
</>
)}
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
NAVBAR
──────────────────────────────────────────────────────────── */
function Navbar() {
const { count } = useCart();
const [menuOpen, setMenuOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);
const location = useLocation();

useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 60);
window.addEventListener('scroll', onScroll);
return () => window.removeEventListener('scroll', onScroll);
}, []);
useEffect(() => { setMenuOpen(false); }, [location]);

const links = [['Home', '/'], ['Shop', '/shop'], ['About', '/about'], ['Contact', '/contact']];

return (
<>
<nav style={{
position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
background: scrolled ? 'rgba(10,5,2,0.97)' : 'transparent',
backdropFilter: scrolled ? 'blur(12px)' : 'none',
borderBottom: scrolled ? '1px solid rgba(212,168,83,0.2)' : 'none',
transition: 'all 0.35s', padding: '0 2rem',
height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
}}>
<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
<span style={{ fontSize: '1.7rem' }}>🎨</span>
<span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#d4a853', letterSpacing: '2px' }}>SRUTHI ARTS</span>
</Link>
<div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
<div style={{ display: 'flex', gap: '2rem' }}>
{links.map(([label, path]) => (
<Link key={path} to={path} style={{
color: location.pathname === path ? '#d4a853' : 'rgba(255,255,255,0.82)',
textDecoration: 'none', fontFamily: "'Lato',sans-serif", fontSize: '0.85rem',
letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color 0.2s'
}}
onMouseEnter={e => e.target.style.color = '#d4a853'}
onMouseLeave={e => e.target.style.color = location.pathname === path ? '#d4a853' : 'rgba(255,255,255,0.82)'}
>{label}</Link>
))}
</div>
<Link to="/cart" style={{ position: 'relative', color: 'white', textDecoration: 'none', fontSize: '1.3rem', lineHeight: 1 }}>
🛒
{count > 0 && (
<span style={{
position: 'absolute', top: '-8px', right: '-10px', background: '#c0392b',
color: 'white', borderRadius: '50%', width: '18px', height: '18px',
fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
}}>{count}</span>
)}
</Link>
<button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer' }}>☰</button>
</div>
</nav>
{menuOpen && (
<div style={{ position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 999, background: 'rgba(10,5,2,0.98)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(212,168,83,0.2)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
{links.map(([label, path]) => (
<Link key={path} to={path} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontFamily: "'Lato',sans-serif", fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{label}</Link>
))}
</div>
)}
</>
);
}

/* ────────────────────────────────────────────────────────────
FOOTER
──────────────────────────────────────────────────────────── */
function Footer() {
return (
<footer style={{ background: '#060301', borderTop: '1px solid rgba(212,168,83,0.2)', padding: '4rem 2rem 2rem', marginTop: '5rem' }}>
<div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '2.5rem' }}>
<div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: '#d4a853', marginBottom: '1rem' }}>🎨 SRUTHI ARTS</div>
<p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.8 }}>Handcrafted original paintings &amp; premium art supplies. Every piece tells a story, every brushstroke carries a soul.</p>
</div>
<div>
<div style={{ color: '#d4a853', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Quick Links</div>
{[['Home', '/'], ['Shop All', '/shop'], ['About Us', '/about'], ['Contact', '/contact'], ['Cart', '/cart']].map(([l, p]) => (
<div key={p} style={{ marginBottom: '0.5rem' }}>
<Link to={p} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.88rem' }}>{l}</Link>
</div>
))}
</div>
<div>
<div style={{ color: '#d4a853', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Art Categories</div>
{['Religious', 'Landscape', 'Traditional', 'Abstract', 'Supplies'].map(c => (
<div key={c} style={{ marginBottom: '0.5rem' }}>
<Link to={'/shop?cat=' + c} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.88rem' }}>{c}</Link>
</div>
))}
</div>
<div>
<div style={{ color: '#d4a853', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Get In Touch</div>
<div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 2 }}>
📧 sruthiarts@gmail.com<br />
📞 +91 98765 43210<br />
📍 Hyderabad, Telangana, India<br />
🕐 Mon-Sat: 9am – 7pm IST
</div>
<div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
{['📘', '📸', '▶️', '🐦'].map((ic, i) => (
<span key={i} style={{ fontSize: '1.3rem', cursor: 'pointer', opacity: 0.65, transition: 'opacity 0.2s' }}
onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.65'}>{ic}</span>
))}
</div>
</div>
</div>
<div style={{ borderTop: '1px solid rgba(212,168,83,0.1)', marginTop: '2.5rem', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
© 2024 Sruthi Arts. All rights reserved. Handcrafted with ❤️ in India.
</div>
</footer>
);
}

/* ────────────────────────────────────────────────────────────
PRODUCT CARD
──────────────────────────────────────────────────────────── */
function ProductCard({ p }) {
const { add } = useCart();
const nav = useNavigate();
const [hover, setHover] = useState(false);
const [added, setAdded] = useState(false);

const handleAdd = (e) => {
e.stopPropagation();
add(p);
setAdded(true);
setTimeout(() => setAdded(false), 1500);
};

return (
<div
onMouseEnter={() => setHover(true)}
onMouseLeave={() => setHover(false)}
style={{
background: '#160b03', border: '1px solid rgba(212,168,83,0.15)', borderRadius: '14px',
overflow: 'hidden', transition: 'all 0.3s',
transform: hover ? 'translateY(-6px)' : 'none',
boxShadow: hover ? '0 24px 48px rgba(0,0,0,0.55)' : '0 4px 16px rgba(0,0,0,0.3)',
cursor: 'pointer', display: 'flex', flexDirection: 'column'
}}
>
<div style={{ position: 'relative', overflow: 'hidden', height: '230px' }} onClick={() => nav('/product/' + p.id)}>
<img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s', transform: hover ? 'scale(1.08)' : 'scale(1)' }} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,5,2,0.6) 0%,transparent 50%)', pointerEvents: 'none' }} />
<div style={{ position: 'absolute', top: '10px', left: '10px', background: '#c0392b', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '1px' }}>{disc(p)}% OFF</div>
{p.cat === 'Supplies' && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#1a6b3a', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '1px' }}>SUPPLY</div>}
</div>
<div style={{ padding: '1rem 1.1rem 1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
<div style={{ fontSize: '0.68rem', color: '#d4a853', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{p.cat} • {p.medium}</div>
<div onClick={() => nav('/product/' + p.id)} style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '0.4rem', lineHeight: 1.35 }}>{p.title}</div>
<div style={{ marginBottom: '0.5rem' }}><Stars n={p.stars} /><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem', marginLeft: '5px' }}>({p.reviews})</span></div>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
<div>
<span style={{ color: '#d4a853', fontWeight: 700, fontSize: '1.05rem' }}>{fmt(p.price)}</span>
<span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'line-through', marginLeft: '6px' }}>{fmt(p.orig)}</span>
</div>
<button onClick={handleAdd} style={{
background: added ? '#2c7a4b' : 'linear-gradient(135deg,#d4a853,#b8860b)',
border: 'none', color: added ? 'white' : '#0a0502',
padding: '6px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '0.73rem',
cursor: 'pointer', letterSpacing: '0.8px', textTransform: 'uppercase', transition: 'all 0.2s', whiteSpace: 'nowrap'
}}>{added ? '✓ Added!' : 'Add to Cart'}</button>
</div>
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
HOME PAGE
──────────────────────────────────────────────────────────── */
function Home() {
const nav = useNavigate();
const featured = PRODUCTS.slice(0, 8);
const catCards = [
{ name: 'Religious', emoji: '🙏', img: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&q=80' },
{ name: 'Landscape', emoji: '🌄', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&q=80' },
{ name: 'Traditional', emoji: '🎎', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80' },
{ name: 'Abstract', emoji: '🎨', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&q=80' },
];

return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white' }}>
<div style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
<div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.22)' }} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(10,5,2,0.2) 0%,rgba(10,5,2,0.85) 100%)' }} />
<div style={{ position: 'relative', textAlign: 'center', padding: '0 1.5rem', maxWidth: '820px' }}>
<div style={{ color: '#d4a853', letterSpacing: '5px', textTransform: 'uppercase', fontSize: '0.8rem', fontFamily: "'Lato',sans-serif", marginBottom: '1.5rem' }}>✦ Authentic Handcrafted Art ✦</div>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.8rem,6.5vw,5.2rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '1.5rem', color: 'white' }}>
Where Every Brushstroke<br /><em style={{ color: '#d4a853' }}>Tells a Story</em>
</h1>
<p style={{ fontFamily: "'Lato',sans-serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
Discover authentic Indian paintings, traditional folk art, and premium art supplies — all handcrafted with passion and love.
</p>
<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
<GoldBtn onClick={() => nav('/shop')}>Explore Shop</GoldBtn>
<GoldBtn onClick={() => nav('/about')} outline>Our Story</GoldBtn>
</div>
</div>
<div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center' }}>
Scroll to explore ↓
</div>
</div>

<div style={{ background: 'rgba(212,168,83,0.06)', borderTop: '1px solid rgba(212,168,83,0.15)', borderBottom: '1px solid rgba(212,168,83,0.15)', padding: '2.5rem 2rem' }}>
<div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
{[['500+', 'Artworks Sold'], ['50+', 'Artists Supported'], ['15+', 'Art Styles'], ['100%', 'Handcrafted']].map(([n, l]) => (
<div key={l} style={{ textAlign: 'center' }}>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', color: '#d4a853', fontWeight: 700 }}>{n}</div>
<div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', letterSpacing: '1px', marginTop: '4px' }}>{l}</div>
</div>
))}
</div>
</div>

<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 3rem' }}>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<div style={{ color: '#d4a853', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Browse by Style</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: 'white' }}>Art Categories</h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
{catCards.map(c => (
<div key={c.name} onClick={() => nav('/shop?cat=' + c.name)} style={{ position: 'relative', height: '290px', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(212,168,83,0.12)' }}>
<img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,5,2,0.9) 0%,rgba(10,5,2,0.1) 60%)' }} />
<div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
<div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{c.emoji}</div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>{c.name}</div>
<div style={{ color: '#d4a853', fontSize: '0.75rem', letterSpacing: '1.5px', marginTop: '5px', textTransform: 'uppercase' }}>Explore →</div>
</div>
</div>
))}
</div>
</div>

<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<div style={{ color: '#d4a853', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Curated for You</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: 'white' }}>Featured Artworks</h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '1.5rem' }}>
{featured.map(p => <ProductCard key={p.id} p={p} />)}
</div>
<div style={{ textAlign: 'center', marginTop: '3rem' }}>
<GoldBtn onClick={() => nav('/shop')} outline>View All Artworks</GoldBtn>
</div>
</div>

<div style={{ background: 'rgba(212,168,83,0.04)', padding: '5rem 2rem', borderTop: '1px solid rgba(212,168,83,0.1)' }}>
<div style={{ maxWidth: '1100px', margin: '0 auto' }}>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: 'white' }}>Why Choose <em style={{ color: '#d4a853' }}>Sruthi Arts?</em></h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '2rem' }}>
{[
['🎨', '100% Original', 'Every artwork is unique and comes with a signed certificate of authenticity.'],
['📦', 'Secure Delivery', 'Professionally packed and insured shipping across India and worldwide.'],
['↩️', '15-Day Returns', 'Not satisfied? Return within 15 days for a full, no-questions-asked refund.'],
['👩‍🎨', 'Artist Support', 'Every purchase directly supports the artist. Art that gives back.'],
].map(([ic, t, d]) => (
<div key={t} style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.14)', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
<div style={{ fontSize: '2.3rem', marginBottom: '0.9rem' }}>{ic}</div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.08rem', color: '#d4a853', fontWeight: 600, marginBottom: '0.6rem' }}>{t}</div>
<div style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.88rem', lineHeight: 1.7 }}>{d}</div>
</div>
))}
</div>
</div>
</div>

<div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<div style={{ color: '#d4a853', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Happy Collectors</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: 'white' }}>What Our Collectors Say</h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
{[
['Priya Sharma', 'Mumbai', 'The Madhubani peacock I ordered is absolutely stunning. The colours are so vibrant and the craftsmanship is impeccable. Sruthi Arts is my go-to for authentic Indian art!', 5],
['Rahul Verma', 'Delhi', 'Ordered the Ganesha painting for my home — the detail and quality is outstanding. Arrived perfectly packed and on time. Highly recommend!', 5],
['Ananya Iyer', 'Bangalore', 'The Kolinsky brush set is professional quality at a very fair price. Absolutely worth every rupee. Will definitely order more art supplies here.', 4],
].map(([name, city, text, s]) => (
<div key={name} style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.14)', borderRadius: '14px', padding: '1.8rem' }}>
<Stars n={s} />
<p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', lineHeight: 1.75, margin: '1rem 0', fontStyle: 'italic' }}>"{text}"</p>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
<div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4a853,#b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0502', fontWeight: 700, fontSize: '1rem' }}>{name[0]}</div>
<div>
<div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{name}</div>
<div style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.78rem' }}>{city}</div>
</div>
</div>
</div>
))}
</div>
</div>

<div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg,rgba(212,168,83,0.12),rgba(180,120,20,0.08))', borderTop: '1px solid rgba(212,168,83,0.18)', borderBottom: '1px solid rgba(212,168,83,0.18)' }}>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: 'white', marginBottom: '1rem' }}>Commission a <em style={{ color: '#d4a853' }}>Custom Artwork</em></h2>
<p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.75 }}>Have a vision in mind? Our artists will bring it to life — perfectly tailored to your space, style, and budget.</p>
<GoldBtn onClick={() => nav('/contact')}>Get a Custom Quote</GoldBtn>
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
SHOP PAGE
──────────────────────────────────────────────────────────── */
function Shop() {
const location = useLocation();
const params = new URLSearchParams(location.search);
const defaultCat = params.get('cat') || 'All';
const [activeCat, setActiveCat] = useState(defaultCat);
const [sort, setSort] = useState('default');
const [search, setSearch] = useState('');

useEffect(() => {
const cat = new URLSearchParams(location.search).get('cat') || 'All';
setActiveCat(cat);
}, [location.search]);

let filtered = PRODUCTS.filter(p => {
const matchCat = activeCat === 'All' || p.cat === activeCat;
const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase());
return matchCat && matchSearch;
});

if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
if (sort === 'popular') filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white', paddingTop: '70px' }}>
<div style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.1),rgba(10,5,2,0))', padding: '4rem 2rem 3rem', textAlign: 'center', borderBottom: '1px solid rgba(212,168,83,0.15)' }}>
<div style={{ color: '#d4a853', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Our Collection</div>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.8rem', color: 'white', marginBottom: '1rem' }}>Art Shop</h1>
<p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>Original paintings, traditional folk art, and premium supplies — all handcrafted with love.</p>
</div>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
<div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
{CATS.map(c => (
<button key={c} onClick={() => setActiveCat(c)} style={{
background: activeCat === c ? 'linear-gradient(135deg,#d4a853,#b8860b)' : 'rgba(212,168,83,0.08)',
border: activeCat === c ? 'none' : '1px solid rgba(212,168,83,0.25)',
color: activeCat === c ? '#0a0502' : 'rgba(255,255,255,0.75)',
padding: '7px 18px', borderRadius: '20px', fontWeight: activeCat === c ? 700 : 500,
fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.8px', transition: 'all 0.2s'
}}>{c}</button>
))}
</div>
<div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artworks..."
style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.25)', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem', outline: 'none', minWidth: '180px' }} />
<select value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#1a0e05', border: '1px solid rgba(212,168,83,0.25)', color: 'rgba(255,255,255,0.75)', padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}>
<option value="default">Sort: Default</option>
<option value="price-asc">Price: Low → High</option>
<option value="price-desc">Price: High → Low</option>
<option value="popular">Most Popular</option>
</select>
</div>
</div>
<div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{filtered.length} artwork{filtered.length !== 1 ? 's' : ''} found</div>
{filtered.length === 0 ? (
<div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.45)' }}>
<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', marginBottom: '0.5rem' }}>No artworks found</div>
<div>Try a different category or search term.</div>
</div>
) : (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '1.5rem' }}>
{filtered.map(p => <ProductCard key={p.id} p={p} />)}
</div>
)}
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
PRODUCT DETAIL PAGE
──────────────────────────────────────────────────────────── */
function ProductDetail() {
const { id } = useParams();
const nav = useNavigate();
const { add } = useCart();
const [qty, setQty] = useState(1);
const [added, setAdded] = useState(false);

const p = PRODUCTS.find(x => x.id === Number(id));
if (!p) return <div style={{ paddingTop: '120px', textAlign: 'center', color: 'white', background: '#0a0502', minHeight: '100vh' }}>Product not found.</div>;

const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

const handleAdd = () => {
add(p, qty);
setAdded(true);
setTimeout(() => setAdded(false), 2000);
};

return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white', paddingTop: '90px' }}>
<div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
<div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginBottom: '2rem' }}>
<span onClick={() => nav('/')} style={{ cursor: 'pointer', color: '#d4a853' }}>Home</span>
<span style={{ margin: '0 8px' }}>›</span>
<span onClick={() => nav('/shop?cat=' + p.cat)} style={{ cursor: 'pointer', color: '#d4a853' }}>{p.cat}</span>
<span style={{ margin: '0 8px' }}>›</span>
<span>{p.title}</span>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '3rem', alignItems: 'start' }}>
<div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212,168,83,0.15)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
<img src={p.img} alt={p.title} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '480px' }} />
</div>
<div>
<div style={{ fontSize: '0.72rem', color: '#d4a853', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.cat}</div>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'white', marginBottom: '0.8rem', lineHeight: 1.2 }}>{p.title}</h1>
<div style={{ marginBottom: '1rem' }}><Stars n={p.stars} /><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginLeft: '8px' }}>({p.reviews} reviews)</span></div>
<div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
<span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#d4a853', fontWeight: 700 }}>{fmt(p.price)}</span>
<span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem', textDecoration: 'line-through' }}>{fmt(p.orig)}</span>
<span style={{ background: '#c0392b', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>{disc(p)}% OFF</span>
</div>
<p style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{p.desc}</p>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.8rem', padding: '1.2rem', background: 'rgba(212,168,83,0.06)', borderRadius: '10px', border: '1px solid rgba(212,168,83,0.12)' }}>
{[['Medium', p.medium], ['Size', p.size], ['Category', p.cat], ['Availability', 'In Stock ✓']].map(([k, v]) => (
<div key={k}>
<div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{k}</div>
<div style={{ color: 'white', fontSize: '0.88rem', fontWeight: 500 }}>{v}</div>
</div>
))}
</div>
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
<div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(212,168,83,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
<button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'rgba(212,168,83,0.1)', border: 'none', color: 'white', width: '38px', height: '38px', fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
<span style={{ padding: '0 16px', color: 'white', fontWeight: 600 }}>{qty}</span>
<button onClick={() => setQty(q => q + 1)} style={{ background: 'rgba(212,168,83,0.1)', border: 'none', color: 'white', width: '38px', height: '38px', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
</div>
<GoldBtn onClick={handleAdd} style={{ flexGrow: 1, textAlign: 'center' }}>{added ? '✓ Added to Cart!' : 'Add to Cart'}</GoldBtn>
</div>
<button onClick={() => { add(p, qty); nav('/cart'); }} style={{ width: '100%', background: 'transparent', border: '2px solid rgba(212,168,83,0.4)', color: '#d4a853', padding: '12px', borderRadius: '30px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>Buy Now</button>
<div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
<span>🔒 Secure checkout</span><span>📦 Free packaging</span><span>✅ Authenticity guaranteed</span>
</div>
</div>
</div>
{related.length > 0 && (
<div style={{ marginTop: '5rem' }}>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'white', marginBottom: '2rem' }}>You May Also Like</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1.5rem' }}>
{related.map(p => <ProductCard key={p.id} p={p} />)}
</div>
</div>
)}
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
CART PAGE  (with UPI Payment Modal)
──────────────────────────────────────────────────────────── */
function Cart() {
const { cart, remove, update, total, clearCart } = useCart();
const nav = useNavigate();
const [showPayment, setShowPayment] = useState(false);
const [ordered, setOrdered] = useState(false);

const handlePaymentSuccess = () => {
clearCart();
setShowPayment(false);
setOrdered(true);
};

if (ordered) return (
<div style={{ background: '#0a0502', minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '2rem' }}>
<div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', color: '#d4a853', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
<p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: '450px', lineHeight: 1.75, marginBottom: '0.8rem' }}>Thank you for your purchase! We will verify your payment and contact you shortly with order details and tracking information.</p>
<p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', marginBottom: '2rem' }}>Payment to: <span style={{ color: '#d4a853', fontFamily: 'monospace' }}>{UPI_ID}</span></p>
<GoldBtn onClick={() => nav('/shop')}>Continue Shopping</GoldBtn>
</div>
);

if (cart.length === 0) return (
<div style={{ background: '#0a0502', minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '2rem' }}>
<div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
<p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem' }}>Discover our beautiful artworks and add your favourites.</p>
<GoldBtn onClick={() => nav('/shop')}>Browse Shop</GoldBtn>
</div>
);

const grandTotal = Math.round(total * 1.18);

return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white', paddingTop: '90px' }}>
{showPayment && (
<PaymentModal
total={total}
onSuccess={handlePaymentSuccess}
onClose={() => setShowPayment(false)}
/>
)}
<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>Your Cart</h1>
<p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>{cart.reduce((s,i)=>s+i.qty,0)} item{cart.reduce((s,i)=>s+i.qty,0)!==1?'s':''} in your cart</p>
<div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
{cart.map(item => (
<div key={item.id} style={{ background: '#160b03', border: '1px solid rgba(212,168,83,0.14)', borderRadius: '12px', padding: '1.2rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
<img src={item.img} alt={item.title} onClick={() => nav('/product/' + item.id)} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }} />
<div style={{ flexGrow: 1, minWidth: 0 }}>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: 'white', fontWeight: 600, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
<div style={{ color: '#d4a853', fontSize: '0.78rem', marginBottom: '6px' }}>{item.cat} • {item.medium}</div>
<div style={{ color: '#d4a853', fontWeight: 700, fontSize: '1rem' }}>{fmt(item.price)}</div>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
<button onClick={() => update(item.id, item.qty - 1)} style={{ background: 'rgba(212,168,83,0.12)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>−</button>
<span style={{ width: '28px', textAlign: 'center', color: 'white', fontWeight: 600 }}>{item.qty}</span>
<button onClick={() => update(item.id, item.qty + 1)} style={{ background: 'rgba(212,168,83,0.12)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>+</button>
</div>
<div style={{ fontWeight: 700, color: '#d4a853', minWidth: '80px', textAlign: 'right', flexShrink: 0 }}>{fmt(item.price * item.qty)}</div>
<button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px', flexShrink: 0 }}>✕</button>
</div>
))}
</div>
<div style={{ background: '#160b03', border: '1px solid rgba(212,168,83,0.2)', borderRadius: '14px', padding: '1.8rem', minWidth: '260px', position: 'sticky', top: '90px' }}>
<h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'white', marginBottom: '1.2rem' }}>Order Summary</h3>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
<span>Subtotal</span><span style={{ color: 'white' }}>{fmt(total)}</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
<span>Shipping</span><span style={{ color: '#2c7a4b' }}>FREE</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
<span>GST (18%)</span><span style={{ color: 'white' }}>{fmt(Math.round(total * 0.18))}</span>
</div>
<div style={{ borderTop: '1px solid rgba(212,168,83,0.2)', paddingTop: '0.8rem', marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#d4a853', fontWeight: 700 }}>
<span>Total</span><span>{fmt(grandTotal)}</span>
</div>
{/* UPI Payment Banner */}
<div style={{ marginTop: '1.2rem', padding: '0.8rem', background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
<span style={{ fontSize: '1.4rem' }}>📱</span>
<div>
<div style={{ color: '#d4a853', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>Pay via Google Pay / UPI</div>
<div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginTop: '1px' }}>Scan QR or use UPI ID</div>
</div>
</div>
<GoldBtn onClick={() => setShowPayment(true)} style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}>Proceed to Pay 💳</GoldBtn>
<button onClick={() => nav('/shop')} style={{ width: '100%', marginTop: '0.8rem', background: 'transparent', border: '1px solid rgba(212,168,83,0.25)', color: 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Continue Shopping</button>
</div>
</div>
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
ABOUT PAGE
──────────────────────────────────────────────────────────── */
function About() {
const nav = useNavigate();
return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white', paddingTop: '70px' }}>
<div style={{ position: 'relative', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
<div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2)' }} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 30%,#0a0502 100%)' }} />
<div style={{ position: 'relative', textAlign: 'center', padding: '0 1.5rem' }}>
<div style={{ color: '#d4a853', letterSpacing: '5px', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Story</div>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: 'white', fontWeight: 700 }}>About <em style={{ color: '#d4a853' }}>Sruthi Arts</em></h1>
</div>
</div>
<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
<div>
<div style={{ color: '#d4a853', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Our Mission</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'white', marginBottom: '1.2rem' }}>Preserving Art, Empowering Artists</h2>
<p style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.95rem' }}>Sruthi Arts was founded with a single, passionate mission — to celebrate the richness of Indian art and bring it to homes around the world. We work directly with skilled artists across India, from Madhubani painters in Bihar to Pattachitra masters in Odisha.</p>
<p style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, fontSize: '0.95rem' }}>Every artwork you purchase directly supports the artist who created it, ensuring that these ancient traditions continue to thrive for generations to come.</p>
</div>
<div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212,168,83,0.15)' }}>
<img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" alt="Artist at work" style={{ width: '100%', display: 'block', height: '350px', objectFit: 'cover' }} />
</div>
</div>
<div style={{ marginBottom: '5rem' }}>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', color: 'white' }}>Our Values</h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
{[
['🎨', 'Authenticity', 'Every artwork is original, hand-made, and comes with a signed certificate.'],
['🤝', 'Fair Trade', 'Artists receive fair compensation and recognition for their work.'],
['🌿', 'Sustainability', 'We use natural pigments and eco-friendly packaging wherever possible.'],
['🏛️', 'Heritage', 'We celebrate and preserve India rich artistic traditions and folk styles.'],
].map(([ic, t, d]) => (
<div key={t} style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.14)', borderRadius: '14px', padding: '1.8rem', textAlign: 'center' }}>
<div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{ic}</div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: '#d4a853', fontWeight: 600, marginBottom: '0.5rem' }}>{t}</div>
<div style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.87rem', lineHeight: 1.7 }}>{d}</div>
</div>
))}
</div>
</div>
<div>
<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
<div style={{ color: '#d4a853', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>The People Behind the Art</div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', color: 'white' }}>Meet Our Team</h2>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem' }}>
{[
['Sruthi Devi', 'Founder & Head Artist', '🎨'],
['Ravi Kumar', 'Art Curator', '🖼️'],
['Meena Reddy', 'Customer Relations', '💛'],
].map(([name, role, ic]) => (
<div key={name} style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.12)', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
<div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4a853,#b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>{ic}</div>
<div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>{name}</div>
<div style={{ color: '#d4a853', fontSize: '0.82rem', marginTop: '4px' }}>{role}</div>
</div>
))}
</div>
</div>
<div style={{ textAlign: 'center', marginTop: '4rem' }}>
<GoldBtn onClick={() => nav('/shop')}>Explore Our Artworks</GoldBtn>
</div>
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
CONTACT PAGE
──────────────────────────────────────────────────────────── */
function Contact() {
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
const [sent, setSent] = useState(false);
const [loading, setLoading] = useState(false);

const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
const handleSubmit = e => {
e.preventDefault();
setLoading(true);
setTimeout(() => { setLoading(false); setSent(true); }, 1500);
};

const inputStyle = {
width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,83,0.25)',
color: 'white', padding: '12px 16px', borderRadius: '8px', fontSize: '0.95rem',
outline: 'none', boxSizing: 'border-box', fontFamily: "'Lato',sans-serif", transition: 'border-color 0.2s'
};

return (
<div style={{ background: '#0a0502', minHeight: '100vh', color: 'white', paddingTop: '70px' }}>
<div style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.1),rgba(10,5,2,0))', padding: '4rem 2rem 3rem', textAlign: 'center', borderBottom: '1px solid rgba(212,168,83,0.15)' }}>
<div style={{ color: '#d4a853', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>We would Love to Hear From You</div>
<h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.8rem', color: 'white', marginBottom: '1rem' }}>Contact Us</h1>
<p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>Questions, custom orders, or just want to say hello — we are here for you.</p>
</div>
<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem' }}>
<div>
<h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem' }}>Get in Touch</h2>
{[
['📧', 'Email', 'sruthiarts@gmail.com', 'We reply within 24 hours'],
['📞', 'Phone', '+91 98765 43210', 'Mon–Sat, 9am–7pm IST'],
['📍', 'Address', 'Hyderabad, Telangana', 'India — 500032'],
['🕐', 'Working Hours', 'Monday – Saturday', '9:00 AM – 7:00 PM IST'],
].map(([ic, label, val, sub]) => (
<div key={label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.8rem', padding: '1.2rem', background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.12)', borderRadius: '12px' }}>
<div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{ic}</div>
<div>
<div style={{ color: '#d4a853', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
<div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500 }}>{val}</div>
<div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '2px' }}>{sub}</div>
</div>
</div>
))}
<div style={{ marginTop: '1.5rem' }}>
<div style={{ color: '#d4a853', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Follow Us</div>
<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
{[['📘', 'Facebook'], ['📸', 'Instagram'], ['▶️', 'YouTube'], ['🐦', 'Twitter']].map(([ic, label]) => (
<button key={label} style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', color: 'rgba(255,255,255,0.75)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
<span>{ic}</span><span>{label}</span>
</button>
))}
</div>
</div>
</div>
<div style={{ background: '#160b03', border: '1px solid rgba(212,168,83,0.18)', borderRadius: '16px', padding: '2.5rem' }}>
{sent ? (
<div style={{ textAlign: 'center', padding: '2rem 0' }}>
<div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>✅</div>
<h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#d4a853', marginBottom: '0.8rem' }}>Message Sent!</h3>
<p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>Thank you for reaching out! We will get back to you within 24 hours.</p>
</div>
) : (
<form onSubmit={handleSubmit}>
<h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}>Send a Message</h3>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
<div>
<label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '6px', letterSpacing: '0.5px' }}>Your Name *</label>
<input name="name" value={form.name} onChange={handleChange} required placeholder="Priya Sharma" style={inputStyle} onFocus={e => e.target.style.borderColor = '#d4a853'} onBlur={e => e.target.style.borderColor = 'rgba(212,168,83,0.25)'} />
</div>
<div>
<label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '6px', letterSpacing: '0.5px' }}>Email Address *</label>
<input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="priya@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = '#d4a853'} onBlur={e => e.target.style.borderColor = 'rgba(212,168,83,0.25)'} />
</div>
</div>
<div style={{ marginBottom: '1rem' }}>
<label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '6px', letterSpacing: '0.5px' }}>Subject</label>
<select name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle }}>
<option value="">Select a topic...</option>
<option value="order">Order Enquiry</option>
<option value="custom">Custom Artwork Commission</option>
<option value="wholesale">Wholesale / Bulk Order</option>
<option value="return">Return / Refund</option>
<option value="other">Other</option>
</select>
</div>
<div style={{ marginBottom: '1.5rem' }}>
<label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '6px', letterSpacing: '0.5px' }}>Message *</label>
<textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us about your enquiry, custom requirements, or just say hello..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} onFocus={e => e.target.style.borderColor = '#d4a853'} onBlur={e => e.target.style.borderColor = 'rgba(212,168,83,0.25)'} />
</div>
<GoldBtn style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1 }}>
{loading ? 'Sending...' : 'Send Message →'}
</GoldBtn>
</form>
)}
</div>
</div>
</div>
</div>
);
}

/* ────────────────────────────────────────────────────────────
APP ROOT
──────────────────────────────────────────────────────────── */
function App() {
return (
<CartProvider>
<Router basename="/sruthi-arts">
<div style={{ minHeight: '100vh', background: '#0a0502' }}>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/shop" element={<Shop />} />
<Route path="/product/:id" element={<ProductDetail />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/cart" element={<Cart />} />
</Routes>
<Footer />
</div>
</Router>
</CartProvider>
);
}

export default App;
