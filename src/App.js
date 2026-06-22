import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

/* ============================================================
   FIREBASE CONFIGURATION
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCGt6wsK0zQrrq0XB9XkDdx0oCukhboj68",
  authDomain: "sruthi-arts.firebaseapp.com",
  projectId: "sruthi-arts",
  storageBucket: "sruthi-arts.firebasestorage.app",
  messagingSenderId: "297079335368",
  appId: "1:297079335368:web:76eda206e96367745778fd",
  measurementId: "G-2SG5608M8H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ============================================================
   ADMIN CONFIG
   ============================================================ */
const ADMIN_EMAIL = "admin@sruthiarts.com";
const WHATSAPP_NUMBER = "919959294424";
const UPI_ID = "anilkumardvr@oksbi";
const UPI_NAME = "Anil Kumar Dvr";

/* ============================================================
   INITIAL PRODUCTS DATA (seeded to Firestore on first run)
   ============================================================ */
const INITIAL_PRODUCTS = [
  { id:'seed1', title:'Radha Krishna - Divine Love', cat:'Religious', price:4500, orig:5500, medium:'Oil on Canvas', size:'24x30 in', stars:5, reviews:28, desc:'A breathtaking depiction of Radha and Krishna in divine union, rendered in rich, luminous colours.', img:'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80', inStock:true },
  { id:'seed2', title:'Sunset Over the Ganges', cat:'Landscape', price:3200, orig:4000, medium:'Acrylic on Canvas', size:'18x24 in', stars:4, reviews:15, desc:'A serene landscape capturing the golden sunset reflections on the sacred Ganges river.', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', inStock:true },
  { id:'seed3', title:'Madhubani Peacock', cat:'Traditional', price:2800, orig:3500, medium:'Natural Colours on Handmade Paper', size:'12x16 in', stars:5, reviews:42, desc:'An exquisite Madhubani art piece featuring peacocks in traditional Bihar folk style.', img:'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&q=80', inStock:true },
  { id:'seed4', title:'Abstract Bloom', cat:'Abstract', price:5800, orig:7000, medium:'Mixed Media on Canvas', size:'30x36 in', stars:4, reviews:9, desc:'Vibrant abstract expressionism with layered textures evoking the spirit of a blooming garden.', img:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80', inStock:true },
  { id:'seed5', title:'Warli Village Life', cat:'Traditional', price:2200, orig:2800, medium:'Acrylic on Canvas', size:'12x16 in', stars:5, reviews:33, desc:'Traditional Warli tribal art depicting village life scenes with intricate geometric patterns.', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', inStock:true },
  { id:'seed6', title:'Ocean Dreams', cat:'Abstract', price:6500, orig:8000, medium:'Oil on Canvas', size:'36x48 in', stars:5, reviews:11, desc:'A mesmerizing abstract seascape evoking the vastness and mystery of the ocean depths.', img:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80', inStock:true },
  { id:'seed7', title:'Lord Ganesha - Blessings', cat:'Religious', price:3800, orig:4500, medium:'Acrylic on Canvas', size:'20x24 in', stars:5, reviews:56, desc:'A beautifully crafted Ganesha painting symbolising wisdom, prosperity, and new beginnings.', img:'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=400&q=80', inStock:true },
  { id:'seed8', title:'Himalayan Serenity', cat:'Landscape', price:4200, orig:5000, medium:'Watercolour on Archival Paper', size:'18x24 in', stars:4, reviews:19, desc:'A delicate watercolour capturing the majestic tranquillity of snow-capped Himalayan peaks.', img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', inStock:true },
  { id:'seed9', title:'Pattachitra Story Panel', cat:'Traditional', price:3100, orig:3800, medium:'Natural Pigments on Cloth', size:'14x20 in', stars:5, reviews:24, desc:'A vibrant Pattachitra cloth painting narrating mythological stories in Odisha folk tradition.', img:'https://images.unsplash.com/photo-1577720643272-265f09367456?w=400&q=80', inStock:true },
  { id:'seed10', title:'Monsoon Magic', cat:'Abstract', price:4800, orig:5800, medium:'Watercolour on Waterford Paper', size:'18x24 in', stars:4, reviews:8, desc:'Abstract interpretation of the Indian monsoon capturing rain, rhythm, and renewal.', img:'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', inStock:true },
  { id:'seed11', title:'Village Market Scene', cat:'Landscape', price:3500, orig:4200, medium:'Gouache on Paper', size:'14x18 in', stars:4, reviews:17, desc:'A lively depiction of a traditional Indian village market brimming with colour and activity.', img:'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80', inStock:true },
  { id:'seed12', title:'Tanjore Lakshmi', cat:'Religious', price:7500, orig:9000, medium:'Gold Foil & Acrylic on Wood', size:'16x20 in', stars:5, reviews:38, desc:'A magnificent Tanjore-style painting of Goddess Lakshmi adorned with 24-karat gold foil work.', img:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80', inStock:true },
];

/* ============================================================
   CURRENCY CONFIGURATION
   ============================================================ */
const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 1 },
  USD: { symbol: '$', name: 'US Dollar', rate: 0.012 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.011 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.0095 },
  AED: { symbol: 'AED', name: 'UAE Dirham', rate: 0.044 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 0.018 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 0.016 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 0.016 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 1.78 },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', rate: 0.056 },
};

const COUNTRY_CURRENCY = {
  IN:'INR', US:'USD', GB:'GBP', AU:'AUD', AE:'AED', CA:'CAD', SG:'SGD', JP:'JPY', MY:'MYR',
  DE:'EUR', FR:'EUR', IT:'EUR', ES:'EUR', NL:'EUR', BE:'EUR', AT:'EUR', PT:'EUR', FI:'EUR',
};


/* ============================================================
   CONTEXT
   ============================================================ */
const AppContext = createContext(null);

function useApp() { return useContext(AppContext); }

/* ============================================================
   CSS STYLES
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    :root{
      --bg:#0a0a0f;--bg2:#12121a;--bg3:#1a1a26;--card:#16161f;--border:#2a2a3a;
      --gold:#d4af37;--gold2:#f0d060;--accent:#7c3aed;--accent2:#a855f7;
      --pink:#ec4899;--teal:#14b8a6;--red:#ef4444;--green:#10b981;
      --text:#f0f0f8;--text2:#a0a0b8;--text3:#606078;
    }
    body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;}
    a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:'Inter',sans-serif;}
    input,select,textarea{font-family:'Inter',sans-serif;}
    .serif{font-family:'Playfair Display',serif;}
    ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:var(--bg2);}
    ::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px;}
    .btn-primary{background:linear-gradient(135deg,var(--accent),var(--pink));color:#fff;border:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.5px;transition:all 0.3s;box-shadow:0 4px 15px rgba(124,58,237,0.4);}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(124,58,237,0.6);}
    .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0a0a0f;border:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:700;transition:all 0.3s;box-shadow:0 4px 15px rgba(212,175,55,0.4);}
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(212,175,55,0.6);}
    .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border);padding:10px 22px;border-radius:50px;font-size:14px;font-weight:500;transition:all 0.3s;}
    .btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
    .btn-danger{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;transition:all 0.3s;}
    .btn-danger:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(239,68,68,0.4);}
    .card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all 0.3s;}
    .card:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 12px 40px rgba(124,58,237,0.2);}
    .input-field{background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:12px 16px;border-radius:10px;font-size:14px;width:100%;transition:all 0.3s;outline:none;}
    .input-field:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,58,237,0.15);}
    .input-field::placeholder{color:var(--text3);}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px;}
    .badge-gold{background:rgba(212,175,55,0.2);color:var(--gold);border:1px solid rgba(212,175,55,0.3);}
    .badge-accent{background:rgba(124,58,237,0.2);color:var(--accent2);border:1px solid rgba(124,58,237,0.3);}
    .badge-green{background:rgba(16,185,129,0.2);color:var(--green);border:1px solid rgba(16,185,129,0.3);}
    .badge-red{background:rgba(239,68,68,0.2);color:var(--red);border:1px solid rgba(239,68,68,0.3);}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
    .modal{background:var(--bg2);border:1px solid var(--border);border-radius:20px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;}
    .toast{position:fixed;bottom:24px;right:24px;z-index:9999;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 20px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
    .gradient-text{background:linear-gradient(135deg,var(--gold),var(--accent2),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .section-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;margin-bottom:8px;}
    .divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:24px 0;}
    .spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    .star-filled{color:var(--gold);}.star-empty{color:var(--text3);}
    @media(max-width:768px){.section-title{font-size:1.6rem;}.btn-primary,.btn-gold{padding:10px 20px;font-size:13px;}}
  `}
  </style>
);

function Stars({ count }) {
  return (
    <span style={{fontSize:'14px'}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= count ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: 'var(--green)', error: 'var(--red)', info: 'var(--accent2)' };
  return (
    <div className="toast" style={{borderLeftColor: colors[type]||'var(--gold)', borderLeftWidth:'3px'}}>
      <span style={{color: colors[type]||'var(--gold)', marginRight:'8px'}}>
        {type==='success'?'✓':type==='error'?'✗':'ℹ'}
      </span>
      {msg}
    </div>
  );
}

function formatPrice(priceINR, currency) {
  const cur = CURRENCIES[currency] || CURRENCIES.INR;
  const val = priceINR * cur.rate;
  if (currency === 'JPY') return cur.symbol + Math.round(val).toLocaleString();
  return cur.symbol + val.toFixed(2).replace(/.00$/, '');
}

function Spinner() {
  return <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div className="spinner"/></div>;
}


/* ============================================================
   APP PROVIDER
   ============================================================ */
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_cart') || '[]'); } catch { return []; }
  });
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [seeded, setSeeded] = useState(false);

  const showToast = (msg, type='success') => setToast({ msg, type, id: Date.now() });

  // Detect currency from IP
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const cc = data.country_code;
        const cur = COUNTRY_CURRENCY[cc];
        if (cur) setCurrency(cur);
      })
      .catch(() => {});
  }, []);

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setIsAdmin(u.email === ADMIN_EMAIL);
        try {
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) setUserDoc(snap.data());
        } catch(e) {}
      } else {
        setIsAdmin(false);
        setUserDoc(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Load products from Firestore
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty && !seeded) {
        // Seed initial products
        const batch = INITIAL_PRODUCTS.map(p => {
          const { id, ...data } = p;
          return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
        });
        await Promise.all(batch);
        setSeeded(true);
        const snap2 = await getDocs(collection(db, 'products'));
        setProducts(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch(e) {
      // fallback to initial data
      setProducts(INITIAL_PRODUCTS);
    }
  }

  // Persist cart
  useEffect(() => {
    localStorage.setItem('sa_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty=1) {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast('Added to cart!', 'success');
  }

  function updateCartQty(id, qty) {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() { setCart([]); }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, userDoc, isAdmin, products, setProducts, loadProducts,
      cart, addToCart, updateCartQty, removeFromCart, clearCart,
      cartTotal, cartCount, currency, setCurrency,
      loading, showToast, toast
    }}>
      {children}
      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AppContext.Provider>
  );
}


/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const { user, isAdmin, cartCount, currency, setCurrency, showToast } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    showToast('Signed out successfully', 'info');
    navigate('/');
  }

  return (
    <nav style={{
      position:'sticky',top:0,zIndex:900,
      background:'rgba(10,10,15,0.95)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'70px'}}>
        {/* Logo */}
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'24px'}}>🎨</span>
          <span style={{fontFamily:'Playfair Display,serif',fontSize:'22px',fontWeight:'700',background:'linear-gradient(135deg,var(--gold),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            Sruthi Arts
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'14px',fontWeight:'500'}}>
          <Link to="/shop" style={{padding:'8px 16px',borderRadius:'8px',color:'var(--text2)',transition:'all 0.2s'}}
            onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>
            Shop
          </Link>
          <Link to="/about" style={{padding:'8px 16px',borderRadius:'8px',color:'var(--text2)',transition:'all 0.2s'}}
            onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>
            About
          </Link>

          {/* Currency Selector */}
          <select value={currency} onChange={e=>setCurrency(e.target.value)}
            style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',padding:'6px 10px',borderRadius:'8px',fontSize:'13px',cursor:'pointer',outline:'none',marginLeft:'4px'}}>
            {Object.entries(CURRENCIES).map(([k,v]) => (
              <option key={k} value={k}>{k} {v.symbol}</option>
            ))}
          </select>

          {/* Cart */}
          <Link to="/cart" style={{position:'relative',padding:'8px 12px',borderRadius:'8px',color:'var(--text2)',fontSize:'20px',transition:'all 0.2s'}}
            onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>
            🛒
            {cartCount > 0 && (
              <span style={{position:'absolute',top:'2px',right:'2px',background:'var(--pink)',color:'#fff',borderRadius:'50%',width:'18px',height:'18px',fontSize:'10px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              {isAdmin && (
                <Link to="/admin" style={{padding:'7px 14px',borderRadius:'8px',background:'rgba(212,175,55,0.15)',color:'var(--gold)',fontSize:'13px',fontWeight:'600',border:'1px solid rgba(212,175,55,0.3)',transition:'all 0.2s'}}>
                  Admin
                </Link>
              )}
              <Link to="/dashboard" style={{padding:'7px 14px',borderRadius:'8px',background:'rgba(124,58,237,0.15)',color:'var(--accent2)',fontSize:'13px',fontWeight:'600',border:'1px solid rgba(124,58,237,0.3)'}}>
                My Account
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{padding:'7px 14px',fontSize:'13px'}}>Sign Out</button>
            </div>
          ) : (
            <div style={{display:'flex',gap:'8px'}}>
              <Link to="/login"><button className="btn-ghost" style={{padding:'8px 16px',fontSize:'13px'}}>Sign In</button></Link>
              <Link to="/signup"><button className="btn-primary" style={{padding:'8px 16px',fontSize:'13px'}}>Sign Up</button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   AUTH PAGES
   ============================================================ */
function AuthCard({ children, title, subtitle }) {
  return (
    <div style={{minHeight:'calc(100vh - 70px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'24px',padding:'48px',maxWidth:'440px',width:'100%',boxShadow:'0 24px 80px rgba(0,0,0,0.5)'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>🎨</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'28px',fontWeight:'700',marginBottom:'8px'}}>{title}</h1>
          <p style={{color:'var(--text2)',fontSize:'14px'}}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoginPage() {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back!', 'success');
      navigate(email === ADMIN_EMAIL ? '/admin' : '/dashboard');
    } catch(err) {
      showToast(err.message.includes('user-not-found') ? 'No account found. Please sign up.' :
                err.message.includes('wrong-password') ? 'Incorrect password.' :
                'Sign in failed. Please try again.', 'error');
    }
    setLoading(false);
  }

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your Sruthi Arts account">
      <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Email</label>
          <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Password</label>
          <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'8px'}} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{textAlign:'center',fontSize:'13px',color:'var(--text2)'}}>
          New here? <Link to="/signup" style={{color:'var(--accent2)',fontWeight:'600'}}>Create account</Link>
        </p>
      </form>
    </AuthCard>
  );
}

function SignupPage() {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (email === ADMIN_EMAIL) { showToast('This email is reserved.', 'error'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name, email, phone, createdAt: serverTimestamp()
      });
      showToast('Account created! Welcome to Sruthi Arts!', 'success');
      navigate('/dashboard');
    } catch(err) {
      showToast(err.message.includes('email-already-in-use') ? 'Email already registered. Sign in instead.' :
                err.message.includes('weak-password') ? 'Password must be at least 6 characters.' :
                'Sign up failed. Please try again.', 'error');
    }
    setLoading(false);
  }

  return (
    <AuthCard title="Create Account" subtitle="Join Sruthi Arts to discover handcrafted masterpieces">
      <form onSubmit={handleSignup} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Full Name</label>
          <input className="input-field" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Email</label>
          <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Phone (optional)</label>
          <input className="input-field" type="tel" placeholder="+91 9999999999" value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div>
          <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'var(--text2)',marginBottom:'6px'}}>Password</label>
          <input className="input-field" type="password" placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'8px'}} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p style={{textAlign:'center',fontSize:'13px',color:'var(--text2)'}}>
          Already a member? <Link to="/login" style={{color:'var(--accent2)',fontWeight:'600'}}>Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}


/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage() {
  const { products, currency, addToCart, user } = useApp();
  const navigate = useNavigate();
  const featured = products.slice(0, 4);
  const cats = ['Religious','Landscape','Traditional','Abstract'];

  return (
    <div>
      {/* Hero */}
      <div style={{
        minHeight:'90vh',
        background:'linear-gradient(135deg,#0a0a0f 0%,#1a0a2e 40%,#0d1a2e 70%,#0a0a0f 100%)',
        display:'flex',alignItems:'center',justifyContent:'center',
        position:'relative',overflow:'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{position:'absolute',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)',top:'-100px',right:'-100px',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.1) 0%,transparent 70%)',bottom:'-50px',left:'-50px',pointerEvents:'none'}} />
        
        <div style={{textAlign:'center',padding:'40px 20px',maxWidth:'800px',position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:'50px',padding:'6px 18px',marginBottom:'24px'}}>
            <span style={{color:'var(--gold)',fontSize:'12px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase'}}>✦ Handcrafted Masterpieces</span>
          </div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2.5rem,6vw,5rem)',fontWeight:'700',lineHeight:'1.1',marginBottom:'24px'}}>
            Where Art Meets{' '}
            <span style={{background:'linear-gradient(135deg,var(--gold),var(--accent2),var(--pink))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
              Soul
            </span>
          </h1>
          <p style={{fontSize:'18px',color:'var(--text2)',lineHeight:'1.7',marginBottom:'40px',maxWidth:'600px',margin:'0 auto 40px'}}>
            Discover authentic Indian paintings — from divine religious art to vibrant abstract masterpieces, each handcrafted by skilled artisans.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={() => navigate('/shop')} className="btn-gold" style={{fontSize:'16px',padding:'14px 36px'}}>
              Explore Collection
            </button>
            {!user && (
              <button onClick={() => navigate('/signup')} className="btn-ghost" style={{fontSize:'16px',padding:'14px 36px'}}>
                Create Account
              </button>
            )}
          </div>
          <div style={{marginTop:'60px',display:'flex',gap:'40px',justifyContent:'center',flexWrap:'wrap'}}>
            {[['500+','Artworks'],['50+','Artists'],['10K+','Happy Collectors'],['15+','Years Experience']].map(([n,l]) => (
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700',color:'var(--gold)'}}>{n}</div>
                <div style={{fontSize:'12px',color:'var(--text3)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{padding:'80px 20px',maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <h2 className="section-title">Shop by Category</h2>
          <p style={{color:'var(--text2)'}}>Explore our curated collections</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'20px'}}>
          {cats.map((cat, i) => {
            const icons = ['🙏','🌄','🎨','💫'];
            const colors = [['#d4af37','#f0d060'],['#14b8a6','#34d399'],['#7c3aed','#a855f7'],['#ec4899','#f472b6']];
            const [c1, c2] = colors[i];
            return (
              <Link to={"/shop?cat=" + cat} key={cat}>
                <div className="card" style={{padding:'32px',textAlign:'center',cursor:'pointer',background:"linear-gradient(135deg," + c1 + "11," + c2 + "22)"}}>
                  <div style={{fontSize:'48px',marginBottom:'12px'}}>{icons[i]}</div>
                  <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>{cat}</h3>
                  <p style={{color:'var(--text2)',fontSize:'13px'}}>
                    {products.filter(p => p.cat === cat).length} artworks
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{padding:'40px 20px 80px',background:'var(--bg2)'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'48px'}}>
            <div className="badge badge-gold" style={{marginBottom:'12px'}}>Featured Collection</div>
            <h2 className="section-title">Bestselling Masterpieces</h2>
            <p style={{color:'var(--text2)'}}>Our most loved and celebrated artworks</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'24px'}}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <button onClick={() => navigate('/shop')} className="btn-primary" style={{fontSize:'15px',padding:'14px 40px'}}>
              View All Artworks →
            </button>
          </div>
        </div>
      </div>

      {/* Why Us */}
      <div style={{padding:'80px 20px',maxWidth:'1400px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <h2 className="section-title">Why Choose Sruthi Arts?</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'24px'}}>
          {[
            ['🎨','Authentic Art','Every piece is original, handcrafted by skilled artisans.'],
            ['🚚','Safe Delivery','Carefully packaged and shipped worldwide.'],
            ['💳','Secure Payment','UPI, cards, and digital wallets accepted.'],
            ['✅','Certificate','Each artwork comes with a certificate of authenticity.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="card" style={{padding:'28px',textAlign:'center'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>{icon}</div>
              <h3 style={{fontSize:'16px',fontWeight:'700',marginBottom:'8px'}}>{title}</h3>
              <p style={{fontSize:'13px',color:'var(--text2)',lineHeight:'1.6'}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'40px 20px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'20px'}}>
          <div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'20px',fontWeight:'700',color:'var(--gold)',marginBottom:'4px'}}>🎨 Sruthi Arts</div>
            <div style={{color:'var(--text3)',fontSize:'13px'}}>Handcrafted Paintings & Art</div>
          </div>
          <div style={{color:'var(--text3)',fontSize:'13px'}}>
            © 2024 Sruthi Arts. All rights reserved. | UPI: {UPI_ID}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   PRODUCT CARD (shared)
   ============================================================ */
function ProductCard({ product: p }) {
  const { currency, addToCart, user } = useApp();
  const navigate = useNavigate();

  function handleBuy() {
    if (!user) { navigate('/login'); return; }
    addToCart(p);
    navigate('/cart');
  }

  return (
    <div className="card">
      <div style={{position:'relative',overflow:'hidden',height:'220px'}}>
        <img src={p.img} alt={p.title}
          style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}}
          onMouseEnter={e=>e.target.style.transform='scale(1.08)'}
          onMouseLeave={e=>e.target.style.transform='scale(1)'}
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80';}}
        />
        <div style={{position:'absolute',top:'12px',left:'12px'}}>
          <span className="badge badge-accent">{p.cat}</span>
        </div>
        {p.orig > p.price && (
          <div style={{position:'absolute',top:'12px',right:'12px',background:'var(--red)',color:'#fff',borderRadius:'8px',padding:'3px 8px',fontSize:'11px',fontWeight:'700'}}>
            -{Math.round((1-p.price/p.orig)*100)}% OFF
          </div>
        )}
      </div>
      <div style={{padding:'20px'}}>
        <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:'700',marginBottom:'6px',lineHeight:'1.3'}}>{p.title}</h3>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
          <Stars count={p.stars || 4} />
          <span style={{fontSize:'12px',color:'var(--text3)'}}>({p.reviews || 0})</span>
        </div>
        <p style={{fontSize:'12px',color:'var(--text3)',marginBottom:'12px'}}>{p.medium} • {p.size}</p>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
          <span style={{fontFamily:'Playfair Display,serif',fontSize:'20px',fontWeight:'700',color:'var(--gold)'}}>
            {formatPrice(p.price, currency)}
          </span>
          {p.orig > p.price && (
            <span style={{fontSize:'13px',color:'var(--text3)',textDecoration:'line-through'}}>
              {formatPrice(p.orig, currency)}
            </span>
          )}
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <Link to={"/product/" + p.id} style={{flex:1}}>
            <button className="btn-ghost" style={{width:'100%',padding:'9px',fontSize:'13px'}}>View</button>
          </Link>
          <button onClick={handleBuy} className="btn-gold" style={{flex:1,padding:'9px',fontSize:'13px'}}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHOP PAGE
   ============================================================ */
function ShopPage() {
  const { products, currency } = useApp();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initCat = params.get('cat') || 'All';
  const [cat, setCat] = useState(initCat);
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const cats = ['All', 'Religious', 'Landscape', 'Traditional', 'Abstract'];

  let filtered = products.filter(p => {
    if (cat !== 'All' && p.cat !== cat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === 'price-asc') filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a,b) => (b.stars||0) - (a.stars||0));

  return (
    <div style={{minHeight:'calc(100vh - 70px)',padding:'40px 20px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:'32px'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2.5rem',fontWeight:'700',marginBottom:'8px'}}>
          Our <span className="gradient-text">Collection</span>
        </h1>
        <p style={{color:'var(--text2)'}}>Discover {products.length}+ authentic handcrafted artworks</p>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'12px',marginBottom:'32px',flexWrap:'wrap',alignItems:'center'}}>
        <input className="input-field" placeholder="🔍 Search artworks..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{maxWidth:'280px',flex:'0 0 auto'}} />
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                padding:'8px 18px',borderRadius:'50px',fontSize:'13px',fontWeight:'500',
                background:cat===c?'linear-gradient(135deg,var(--accent),var(--pink))':'transparent',
                color:cat===c?'#fff':'var(--text2)',
                border:cat===c?'none':'1px solid var(--border)',
                transition:'all 0.2s',cursor:'pointer',
              }}>
              {c}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',padding:'8px 14px',borderRadius:'8px',fontSize:'13px',outline:'none',marginLeft:'auto',cursor:'pointer'}}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      {/* Results */}
      <div style={{color:'var(--text3)',fontSize:'13px',marginBottom:'20px'}}>
        Showing {filtered.length} artwork{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'24px'}}>
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'80px 20px',color:'var(--text2)'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
          <h3 style={{fontSize:'20px',marginBottom:'8px'}}>No artworks found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}


/* ============================================================
   PRODUCT DETAIL PAGE
   ============================================================ */
function ProductPage() {
  const { products, currency, addToCart, user } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const p = products.find(x => x.id === id);

  if (!p) return <Spinner />;

  function handleBuy() {
    if (!user) { navigate('/login'); return; }
    addToCart(p, qty);
    navigate('/cart');
  }

  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'40px 20px',minHeight:'calc(100vh - 70px)'}}>
      <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'var(--text2)',cursor:'pointer',marginBottom:'24px',display:'flex',alignItems:'center',gap:'6px',fontSize:'14px'}}>
        ← Back
      </button>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'start'}}>
        {/* Image */}
        <div style={{borderRadius:'20px',overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.5)',aspectRatio:'4/5',background:'var(--card)'}}>
          <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}
            onError={e=>{e.target.src='https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80';}} />
        </div>
        {/* Info */}
        <div>
          <span className="badge badge-accent" style={{marginBottom:'16px'}}>{p.cat}</span>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2.2rem',fontWeight:'700',lineHeight:'1.2',marginBottom:'16px'}}>{p.title}</h1>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
            <Stars count={p.stars||4} />
            <span style={{color:'var(--text2)',fontSize:'14px'}}>({p.reviews||0} reviews)</span>
          </div>
          <div style={{display:'flex',alignItems:'baseline',gap:'12px',marginBottom:'24px'}}>
            <span style={{fontFamily:'Playfair Display,serif',fontSize:'2.5rem',fontWeight:'700',color:'var(--gold)'}}>
              {formatPrice(p.price, currency)}
            </span>
            {p.orig > p.price && (
              <span style={{fontSize:'18px',color:'var(--text3)',textDecoration:'line-through'}}>
                {formatPrice(p.orig, currency)}
              </span>
            )}
            {p.orig > p.price && (
              <span style={{background:'var(--red)',color:'#fff',padding:'3px 10px',borderRadius:'8px',fontSize:'13px',fontWeight:'700'}}>
                {Math.round((1-p.price/p.orig)*100)}% OFF
              </span>
            )}
          </div>
          <div className="divider" />
          <p style={{color:'var(--text2)',lineHeight:'1.8',marginBottom:'24px',fontSize:'15px'}}>{p.desc}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px'}}>
            {[['Medium',p.medium],['Size',p.size],['Category',p.cat],['Availability',p.inStock?'In Stock':'Out of Stock']].map(([k,v]) => (
              <div key={k} style={{background:'var(--bg3)',borderRadius:'10px',padding:'12px 16px'}}>
                <div style={{fontSize:'11px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{k}</div>
                <div style={{fontSize:'14px',fontWeight:'600',color:v==='In Stock'?'var(--green)':v==='Out of Stock'?'var(--red)':'var(--text)'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
            <span style={{fontSize:'14px',color:'var(--text2)'}}>Quantity:</span>
            <div style={{display:'flex',alignItems:'center',gap:'0',border:'1px solid var(--border)',borderRadius:'10px',overflow:'hidden'}}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{background:'var(--bg3)',border:'none',color:'var(--text)',width:'36px',height:'36px',fontSize:'18px',cursor:'pointer'}}>−</button>
              <span style={{width:'40px',textAlign:'center',fontSize:'15px',fontWeight:'600'}}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{background:'var(--bg3)',border:'none',color:'var(--text)',width:'36px',height:'36px',fontSize:'18px',cursor:'pointer'}}>+</button>
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            <button onClick={() => { if(!user){navigate('/login');return;} addToCart(p,qty); }}
              className="btn-ghost" style={{flex:1,padding:'14px'}}>
              Add to Cart 🛒
            </button>
            <button onClick={handleBuy} className="btn-gold" style={{flex:1,padding:'14px',fontSize:'15px'}}>
              Buy Now
            </button>
          </div>
          {!user && (
            <p style={{marginTop:'12px',fontSize:'13px',color:'var(--text3)',textAlign:'center'}}>
              <Link to="/login" style={{color:'var(--accent2)'}}>Sign in</Link> to purchase
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================/* ============================================================
   PAYMENT MODAL - v3: QR Code + Direct UPI App Launch
   ============================================================ */
function PaymentModal({ total, currency, items, userInfo, onClose, onSuccess }) {
const [paid, setPaid] = useState(false);
const [submitting, setSubmitting] = useState(false);
const { showToast } = useApp();

const totalINR = total;
const displayTotal = formatPrice(total, currency);
const upiLink = "upi://pay?pa=" + UPI_ID + "&pn=" + encodeURIComponent(UPI_NAME) + "&am=" + totalINR + "&cu=INR&tn=" + encodeURIComponent("Sruthi Arts Order");

function openUPI(appLink) {
window.location.href = appLink;
setTimeout(() => setPaid(true), 2500);
}

async function handleConfirm() {
setSubmitting(true);
try {
const autoRef = 'UPI-' + Date.now().toString(36).toUpperCase();
await onSuccess(autoRef);
const itemsList = items.map(i => '- ' + i.title + ' x' + i.qty + ' = Rs.' + (i.price*i.qty)).join('\n');
const adminMsgLines = [
'New Order - Sruthi Arts',
'',
'Customer: ' + (userInfo.name||'Customer'),
'Email: ' + (userInfo.email||''),
'Phone: ' + (userInfo.phone||'Not provided'),
'',
'Items:',
itemsList,
'',
'Total: Rs.' + totalINR + ' (' + displayTotal + ')',
(userInfo.phone ? 'Customer WA: wa.me/' + (userInfo.phone||'').replace(/[^0-9]/g,'') : '')
];
window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(adminMsgLines.join('\n')
), '_blank');
} catch(e) {
showToast('Order failed. Please try again.', 'error');
}
setSubmitting(false);
}

return (
<div className="modal-overlay" onClick={onClose}>
<div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:'480px'}}>
<div style={{background:'linear-gradient(135deg,var(--accent),var(--pink))',padding:'24px',borderRadius:'20px 20px 0 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div>
<h2 style={{fontSize:'20px',fontWeight:'700'}}>Complete Payment</h2>
<p style={{fontSize:'13px',opacity:'0.85',marginTop:'4px'}}>Scan QR or choose your UPI app</p>
</div>
<button onClick={onClose} style={{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',fontSize:'18px',cursor:'pointer'}}>x</button>
</div>
<div style={{padding:'24px'}}>
<div style={{background:'var(--bg3)',borderRadius:'14px',padding:'16px',textAlign:'center',marginBottom:'20px',border:'1px solid var(--border)'}}>
<div style={{fontSize:'12px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Amount to Pay</div>
<div style={{fontFamily:'Playfair Display,serif',fontSize:'2.4rem',fontWeight:'700',color:'var(--gold)'}}>
Rs.{totalINR.toLocaleString()}
</div>
{currency !== 'INR' && <div style={{color:'var(--text2)',fontSize:'13px',marginTop:'2px'}}>{displayTotal}</div>}
</div>

{!paid ? (
<div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px',alignItems:'start'}}>
<div style={{textAlign:'center'}}>
<div style={{fontSize:'12px',color:'var(--text3)',marginBottom:'8px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.5px'}}>Scan to Pay</div>
<div style={{background:'#fff',borderRadius:'12px',padding:'10px',display:'inline-block',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
<img src="/sruthi-arts/qr-payment.png" alt="UPI QR Code" style={{width:'150px',height:'150px',display:'block'}} />
</div>
<div style={{marginTop:'8px',fontSize:'12px',color:'var(--text2)'}}>{UPI_ID}</div>
</div>
<div>
<div style={{fontSize:'12px',color:'var(--text3)',marginBottom:'8px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.5px'}}>Open App</div>
<div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
{[
{name:'Google Pay', icon:'G', color:'#1a73e8', pkg:'com.google.android.apps.nbu.paisa.user'},
{name:'PhonePe', icon:'P', color:'#5f259f', pkg:'com.phonepe.app'},
{name:'Paytm', icon:'Pa', color:'#00baf2', pkg:'net.one97.paytm'},
].map(app => {
const deepLink = "intent://pay?pa=" + UPI_ID + "&pn=" + encodeURIComponent(UPI_NAME) + "&am=" + totalINR + "&cu=INR#Intent;scheme=upi;package=" + app.pkg + ";end";
return (
<button key={app.name} onClick={() => openUPI(deepLink)}
style={{display:'flex',alignItems:'center',gap:'10px',background:app.color+'18',border:'1px solid '+app.color+'44',borderRadius:'10px',padding:'10px 12px',cursor:'pointer',width:'100%',transition:'all 0.2s'}}>
<div style={{width:'28px',height:'28px',borderRadius:'6px',background:app.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'800',color:'#fff',flexShrink:0}}>{app.icon}</div>
<span style={{fontWeight:'600',fontSize:'13px',color:'var(--text)'}}>{app.name}</span>
<span style={{marginLeft:'auto',color:app.color,fontSize:'14px'}}>→</span>
</button>
);
})}
<button onClick={() => openUPI(upiLink)}
style={{display:'flex',alignItems:'center',gap:'10px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'10px',padding:'10px 12px',cursor:'pointer',width:'100%'}}>
<div style={{width:'28px',height:'28px',borderRadius:'6px',background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>+</div>
<span style={{fontWeight:'500',fontSize:'12px',color:'var(--text2)'}}>Other UPI</span>
<span style={{marginLeft:'auto',color:'var(--text3)',fontSize:'14px'}}>→</span>
</button>
</div>
</div>
</div>
<div style={{textAlign:'center',marginTop:'4px'}}>
<button onClick={() => setPaid(true)}
style={{background:'none',border:'none',color:'var(--text3)',fontSize:'12px',cursor:'pointer',textDecoration:'underline'}}>
Already paid? Click here
</button>
</div>
</div>
) : (
<div>
<div style={{textAlign:'center',marginBottom:'20px'}}>
<div style={{fontSize:'48px',marginBottom:'8px'}}>✅</div>
<h3 style={{fontSize:'18px',fontWeight:'700',color:'var(--green)',marginBottom:'4px'}}>Payment Done!</h3>
<p style={{fontSize:'13px',color:'var(--text2)'}}>Click below to confirm your order</p>
</div>
<button onClick={handleConfirm} className="btn-gold" style={{width:'100%',fontSize:'15px',padding:'14px'}} disabled={submitting}>
{submitting ? 'Placing Order...' : 'Confirm Order'}
</button>
<button onClick={() => setPaid(false)}
style={{background:'none',border:'none',color:'var(--text3)',fontSize:'12px',cursor:'pointer',width:'100%',marginTop:'10px',textDecoration:'underline'}}>
Go back to payment options
</button>
</div>
)}
</div>
</div>
</div>
);
}

=========================================
   CART PAGE
   ============================================================ */
function CartPage() {
  const { cart, cartTotal, updateCartQty, removeFromCart, clearCart, currency, user, userDoc } = useApp();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [address, setAddress] = useState('');
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { showToast } = useApp();

  if (orderDone) {
    return (
      <div style={{minHeight:'calc(100vh - 70px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{textAlign:'center',maxWidth:'480px'}}>
          <div style={{fontSize:'80px',marginBottom:'20px'}}>🎉</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700',marginBottom:'12px'}}>Order Placed!</h1>
          <p style={{color:'var(--text2)',marginBottom:'8px'}}>Your order <strong style={{color:'var(--gold)'}}>#{orderId.slice(-8).toUpperCase()}</strong> is confirmed.</p>
          <p style={{color:'var(--text2)',fontSize:'14px',marginBottom:'32px'}}>We have sent the details to your WhatsApp. The artist will contact you shortly.</p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">View My Orders</button>
            <button onClick={() => navigate('/shop')} className="btn-ghost">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{minHeight:'calc(100vh - 70px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'64px',marginBottom:'16px'}}>🔒</div>
          <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'24px',marginBottom:'12px'}}>Sign in to view cart</h2>
          <p style={{color:'var(--text2)',marginBottom:'24px'}}>Create an account or sign in to continue</p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
            <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn-ghost">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{minHeight:'calc(100vh - 70px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'64px',marginBottom:'16px'}}>🛒</div>
          <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'24px',marginBottom:'12px'}}>Your cart is empty</h2>
          <p style={{color:'var(--text2)',marginBottom:'24px'}}>Discover our beautiful collection of handcrafted artworks</p>
          <button onClick={() => navigate('/shop')} className="btn-gold">Browse Collection</button>
        </div>
      </div>
    );
  }

  async function handleOrderSuccess(transRef) {
    const orderData = {
      userId: user.uid,
      userEmail: user.email,
      userName: userDoc?.name || user.displayName || 'Customer',
      userPhone: userDoc?.phone || '',
      items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
      totalINR: cartTotal,
      currency,
      transactionRef: transRef,
      address,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'orders'), orderData);
    clearCart();
    setOrderId(ref.id);
    setShowPayment(false);
    setOrderDone(true);
    showToast('Order placed successfully!', 'success');
  }

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 20px',minHeight:'calc(100vh - 70px)'}}>
      <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700',marginBottom:'32px'}}>
        Shopping Cart <span style={{fontSize:'16px',color:'var(--text2)',fontWeight:'400'}}>({cart.length} items)</span>
      </h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'32px',alignItems:'start'}}>
        {/* Items */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {cart.map(item => (
            <div key={item.id} className="card" style={{display:'flex',gap:'16px',padding:'20px'}}>
              <img src={item.img} alt={item.title}
                style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'10px',flexShrink:0}}
                onError={e=>{e.target.src='https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80';}} />
              <div style={{flex:1}}>
                <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>{item.title}</h3>
                <p style={{fontSize:'12px',color:'var(--text3)',marginBottom:'10px'}}>{item.medium}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0',border:'1px solid var(--border)',borderRadius:'8px',overflow:'hidden'}}>
                    <button onClick={() => updateCartQty(item.id, item.qty-1)} style={{background:'var(--bg3)',border:'none',color:'var(--text)',width:'32px',height:'32px',cursor:'pointer',fontSize:'16px'}}>−</button>
                    <span style={{width:'36px',textAlign:'center',fontSize:'14px',fontWeight:'600'}}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty+1)} style={{background:'var(--bg3)',border:'none',color:'var(--text)',width:'32px',height:'32px',cursor:'pointer',fontSize:'16px'}}>+</button>
                  </div>
                  <span style={{fontFamily:'Playfair Display,serif',fontSize:'18px',fontWeight:'700',color:'var(--gold)'}}>
                    {formatPrice(item.price * item.qty, currency)}
                  </span>
                  <button onClick={() => removeFromCart(item.id)} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer',fontSize:'18px'}}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{padding:'28px',position:'sticky',top:'90px'}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'20px',fontWeight:'700',marginBottom:'20px'}}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'10px',fontSize:'13px',color:'var(--text2)'}}>
              <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'8px'}}>{item.title} ×{item.qty}</span>
              <span style={{flexShrink:0}}>{formatPrice(item.price*item.qty, currency)}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'14px',color:'var(--text2)'}}>
            <span>Subtotal</span><span>{formatPrice(cartTotal, currency)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'14px',color:'var(--green)'}}>
            <span>Shipping</span><span>Free</span>
          </div>
          <div className="divider" />
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
            <span style={{fontFamily:'Playfair Display,serif',fontSize:'18px',fontWeight:'700'}}>Total</span>
            <span style={{fontFamily:'Playfair Display,serif',fontSize:'22px',fontWeight:'700',color:'var(--gold)'}}>{formatPrice(cartTotal, currency)}</span>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',color:'var(--text2)',marginBottom:'6px',fontWeight:'500'}}>Delivery Address *</label>
            <textarea className="input-field" rows={3} placeholder="Enter your full delivery address..."
              value={address} onChange={e=>setAddress(e.target.value)}
              style={{resize:'vertical',lineHeight:'1.5'}} />
          </div>
          <button onClick={() => { if(!address.trim()){showToast('Please enter your delivery address.','error');return;} setShowPayment(true); }}
            className="btn-gold" style={{width:'100%',fontSize:'15px',padding:'14px'}}>
            Proceed to Payment
          </button>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={cartTotal} currency={currency} items={cart}
          userInfo={{ name: userDoc?.name || user.displayName, email: user.email, phone: userDoc?.phone }}
          onClose={() => setShowPayment(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

/* ============================================================
   CUSTOMER DASHBOARD
   ============================================================ */
function DashboardPage() {
  const { user, userDoc, showToast } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadOrders();
  }, [user]);

  async function loadOrders() {
    try {
      const q = query(collection(db, 'orders'), where('userId','==',user.uid), orderBy('createdAt','desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch(e) {
      showToast('Could not load orders.', 'error');
    }
    setLoading(false);
  }

  if (!user) return null;

  const statusColors = { pending:'var(--gold)', confirmed:'var(--teal)', shipped:'var(--accent2)', delivered:'var(--green)', cancelled:'var(--red)' };

  return (
    <div style={{maxWidth:'1000px',margin:'0 auto',padding:'40px 20px',minHeight:'calc(100vh - 70px)'}}>
      {/* Profile card */}
      <div style={{background:'linear-gradient(135deg,var(--accent)22,var(--pink)22)',border:'1px solid var(--border)',borderRadius:'20px',padding:'32px',marginBottom:'32px',display:'flex',alignItems:'center',gap:'24px',flexWrap:'wrap'}}>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--pink))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:'700',flexShrink:0}}>
          {(userDoc?.name || user.displayName || 'U').charAt(0).toUpperCase()}
        </div>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:'700',marginBottom:'4px'}}>
            {userDoc?.name || user.displayName || 'Welcome'}
          </h1>
          <p style={{color:'var(--text2)',fontSize:'14px'}}>{user.email}</p>
          {userDoc?.phone && <p style={{color:'var(--text3)',fontSize:'13px',marginTop:'4px'}}>{userDoc.phone}</p>}
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700',color:'var(--gold)'}}>{orders.length}</div>
          <div style={{fontSize:'12px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'1px'}}>Total Orders</div>
        </div>
      </div>

      <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',fontWeight:'700',marginBottom:'20px'}}>My Orders</h2>

      {loading ? <Spinner /> : orders.length === 0 ? (
        <div style={{textAlign:'center',padding:'60px',color:'var(--text2)'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>📦</div>
          <h3 style={{fontSize:'20px',marginBottom:'8px'}}>No orders yet</h3>
          <p style={{marginBottom:'24px'}}>Start exploring our beautiful art collection!</p>
          <button onClick={() => navigate('/shop')} className="btn-gold">Browse Shop</button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap',gap:'12px'}}>
                <div>
                  <div style={{fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Order ID</div>
                  <div style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:'700',color:'var(--gold)'}}>#{order.id.slice(-8).toUpperCase()}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className="badge" style={{background:statusColors[order.status]+'22',color:statusColors[order.status]||'var(--gold)',border:"1px solid " + (statusColors[order.status]||'var(--gold)') + "44",textTransform:'capitalize',fontSize:'12px'}}>
                    {order.status || 'pending'}
                  </span>
                  <div style={{fontSize:'12px',color:'var(--text3)',marginTop:'4px'}}>
                    {order.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Just now'}
                  </div>
                </div>
              </div>
              <div style={{marginBottom:'16px'}}>
                {(order.items||[]).map((item, i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'13px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{color:'var(--text2)'}}>{item.title} ×{item.qty}</span>
                    <span style={{color:'var(--gold)',fontWeight:'600'}}>₹{(item.price*item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                <div style={{fontSize:'13px',color:'var(--text2)'}}>
                  UPI Ref: <span style={{color:'var(--text)',fontWeight:'500'}}>{order.transactionRef}</span>
                </div>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'20px',fontWeight:'700',color:'var(--gold)'}}>
                  ₹{order.totalINR?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ABOUT PAGE
   ============================================================ */
function AboutPage() {
  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'60px 20px',minHeight:'calc(100vh - 70px)'}}>
      <div style={{textAlign:'center',marginBottom:'48px'}}>
        <span style={{fontSize:'48px'}}>🎨</span>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2.5rem',fontWeight:'700',margin:'16px 0 12px'}}>About Sruthi Arts</h1>
        <p style={{color:'var(--text2)',fontSize:'16px',lineHeight:'1.8'}}>
          Celebrating the timeless beauty of Indian handcrafted art
        </p>
      </div>
      <div className="card" style={{padding:'40px',marginBottom:'24px'}}>
        <p style={{color:'var(--text2)',fontSize:'15px',lineHeight:'1.9',marginBottom:'20px'}}>
          Sruthi Arts was founded with a deep passion for preserving and promoting the rich heritage of Indian painting traditions. From the divine strokes of Tanjore art to the geometric precision of Madhubani, we bring authentic masterpieces directly from skilled artisans to art lovers worldwide.
        </p>
        <p style={{color:'var(--text2)',fontSize:'15px',lineHeight:'1.9'}}>
          Every artwork in our collection is original, handcrafted with love and skill, and comes with a certificate of authenticity. We believe art has the power to transform spaces and touch souls.
        </p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {[
          ['📍','Location','Hyderabad, Telangana, India'],
          ['📱','WhatsApp','+91 9959294424'],
          ['💳','UPI',UPI_ID],
          ['🌐','Languages','English, Telugu, Hindi'],
        ].map(([icon, label, val]) => (
          <div key={label} className="card" style={{padding:'20px'}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{icon}</div>
            <div style={{fontSize:'12px',color:'var(--text3)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px'}}>{label}</div>
            <div style={{fontSize:'14px',fontWeight:'600'}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ============================================================
   ADMIN PANEL
   ============================================================ */
function AdminPage() {
  const { user, isAdmin, products, loadProducts, showToast, currency } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [newProduct, setNewProduct] = useState({ title:'', cat:'Religious', price:0, orig:0, medium:'', size:'', stars:5, reviews:0, desc:'', img:'', inStock:true });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); showToast('Admin access required.', 'error'); return; }
  }, [user, isAdmin]);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt','desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch(e) {}
    setLoadingOrders(false);
  }

  function sendConfirmationWA(order) {
    const rawPhone = (order.userPhone||'').replace(/[^0-9]/g,'');
    if (!rawPhone) { alert('No phone number on file for this customer.'); return; }
    const fullPhone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone;
    const itemsList = (order.items||[]).map(i => '- ' + i.title + ' x' + i.qty).join(', ');
    const msgLines = [
      'Payment Confirmed - Sruthi Arts',
      '',
      'Dear ' + (order.userName||'Customer') + ',',
      '',
      'Great news! Your order is confirmed.',
      '',
      'Order ID: #' + order.id.slice(-8).toUpperCase(),
      'Items: ' + itemsList,
      'Total Paid: Rs.' + (order.totalINR||0),
      '',
      'Your artwork will be dispatched soon.',
      'Thank you for choosing Sruthi Arts!',
      '',
      'Questions? Call/WhatsApp: +91 9959294424'
    ];
    window.open('https://wa.me/' + fullPhone + '?text=' + encodeURIComponent(msgLines.join('\n')
), '_blank');
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    try {
      if (editProduct?.id) {
        await updateDoc(doc(db, 'products', editProduct.id), {
          ...editProduct, price: Number(editProduct.price), orig: Number(editProduct.orig),
          stars: Number(editProduct.stars), reviews: Number(editProduct.reviews),
        });
        showToast('Product updated!', 'success');
      } else {
        await addDoc(collection(db, 'products'), {
          ...newProduct, price: Number(newProduct.price), orig: Number(newProduct.orig),
          stars: Number(newProduct.stars), reviews: Number(newProduct.reviews),
          createdAt: serverTimestamp(),
        });
        showToast('Product added!', 'success');
        setNewProduct({ title:'', cat:'Religious', price:0, orig:0, medium:'', size:'', stars:5, reviews:0, desc:'', img:'', inStock:true });
        setShowAddForm(false);
      }
      await loadProducts();
      setEditProduct(null);
    } catch(e) {
      showToast('Failed to save product.', 'error');
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      showToast('Product deleted.', 'info');
      await loadProducts();
    } catch(e) {
      showToast('Delete failed.', 'error');
    }
  }

  async function handleUpdateOrderStatus(orderId, status, order) {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      loadOrders();
      showToast('Order status updated to ' + status + '!', 'success');
      if (status === 'confirmed' && order?.userPhone) {
        setTimeout(() => sendConfirmationWA({...order, status:'confirmed'}), 500);
      }
    } catch(e) {
      showToast('Update failed.', 'error');
    }
  }

  function ProductForm({ data, setData, onSubmit, btnLabel }) {
    const [imgPreview, setImgPreview] = useState(data.img || '');
    const [uploading, setUploading] = useState(false);

    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be under 2MB. Please resize or compress it first.');
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result;
        setImgPreview(base64);
        setData({...data, img: base64});
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }

    return (
      <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Title *</label>
          <input className="input-field" value={data.title} onChange={e=>setData({...data,title:e.target.value})} required placeholder="Artwork title" />
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Category</label>
          <select className="input-field" value={data.cat} onChange={e=>setData({...data,cat:e.target.value})}>
            {['Religious','Landscape','Traditional','Abstract'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Price (INR) *</label>
          <input className="input-field" type="number" min="0" value={data.price} onChange={e=>setData({...data,price:e.target.value})} required />
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Original Price (INR)</label>
          <input className="input-field" type="number" min="0" value={data.orig} onChange={e=>setData({...data,orig:e.target.value})} />
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Stars (1-5)</label>
          <input className="input-field" type="number" min="1" max="5" value={data.stars} onChange={e=>setData({...data,stars:e.target.value})} />
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Medium</label>
          <input className="input-field" value={data.medium} onChange={e=>setData({...data,medium:e.target.value})} placeholder="e.g. Oil on Canvas" />
        </div>
        <div>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Size</label>
          <input className="input-field" value={data.size} onChange={e=>setData({...data,size:e.target.value})} placeholder="e.g. 24x30 in" />
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'8px',fontWeight:'600'}}>Artwork Image *</label>
          <div style={{display:'flex',gap:'16px',alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{width:'130px',height:'130px',borderRadius:'12px',overflow:'hidden',background:'var(--bg3)',border:'2px dashed '+(imgPreview?'var(--accent)':'var(--border)'),flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color 0.2s'}}>
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';}} />
              ) : (
                <div style={{textAlign:'center',color:'var(--text3)'}}>
                  <div style={{fontSize:'32px',marginBottom:'4px'}}>🖼</div>
                  <div style={{fontSize:'10px'}}>No image</div>
                </div>
              )}
            </div>
            <div style={{flex:1,minWidth:'180px'}}>
              <label style={{
                display:'inline-flex',alignItems:'center',gap:'8px',
                background:uploading?'var(--bg3)':'linear-gradient(135deg,var(--accent),var(--pink))',
                color:uploading?'var(--text3)':'#fff',
                padding:'10px 18px',borderRadius:'10px',
                cursor:uploading?'not-allowed':'pointer',
                fontSize:'13px',fontWeight:'600',
                marginBottom:'10px',transition:'all 0.2s',
              }}>
                {uploading ? '⏳ Processing...' : '📁 Upload from Device'}
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{display:'none'}} disabled={uploading} />
              </label>
              <div style={{fontSize:'11px',color:'var(--text3)',marginBottom:'10px'}}>JPG, PNG, WebP — max 2MB</div>
              <div style={{fontSize:'11px',color:'var(--text3)',marginBottom:'6px',fontWeight:'600'}}>OR paste image URL:</div>
              <input className="input-field"
                value={imgPreview && imgPreview.startsWith('data:') ? '' : (data.img||'')}
                onChange={e=>{setData({...data,img:e.target.value});setImgPreview(e.target.value);}}
                placeholder="https://example.com/image.jpg"
                style={{fontSize:'12px',padding:'8px 12px'}} />
            </div>
          </div>
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block',fontSize:'12px',color:'var(--text3)',marginBottom:'4px'}}>Description</label>
          <textarea className="input-field" rows={3} value={data.desc} onChange={e=>setData({...data,desc:e.target.value})} placeholder="Artwork description..." style={{resize:'vertical'}} />
        </div>
        <div style={{gridColumn:'1/-1',display:'flex',alignItems:'center',gap:'10px'}}>
          <input type="checkbox" id="inStockCb" checked={data.inStock} onChange={e=>setData({...data,inStock:e.target.checked})} style={{accentColor:'var(--accent)',width:'16px',height:'16px'}} />
          <label htmlFor="inStockCb" style={{fontSize:'14px',cursor:'pointer'}}>In Stock</label>
        </div>
        <div style={{gridColumn:'1/-1',display:'flex',gap:'10px'}}>
          <button type="submit" className="btn-primary" style={{flex:1}} disabled={uploading}>{btnLabel}</button>
          <button type="button" className="btn-ghost" onClick={() => { setEditProduct(null); setShowAddForm(false); }}>Cancel</button>
        </div>
      </form>
    );
  }
  const statusColors = { pending:'var(--gold)', confirmed:'var(--teal)', shipped:'var(--accent2)', delivered:'var(--green)', cancelled:'var(--red)' };

  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'40px 20px',minHeight:'calc(100vh - 70px)'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <div className="badge badge-gold" style={{marginBottom:'8px'}}>Admin Panel</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700'}}>Sruthi Arts Management</h1>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {['products','orders'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{padding:'9px 20px',borderRadius:'10px',fontSize:'13px',fontWeight:'600',
                background:tab===t?'linear-gradient(135deg,var(--accent),var(--pink))':'var(--bg3)',
                color:tab===t?'#fff':'var(--text2)',border:'1px solid var(--border)',cursor:'pointer',textTransform:'capitalize'}}>
              {t === 'products' ? '🖼 Products' : '📦 Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'16px',marginBottom:'32px'}}>
        {[['🖼',products.length,'Artworks'],['📦',orders.length,'Total Orders'],['⏳',orders.filter(o=>o.status==='pending').length,'Pending'],['✅',orders.filter(o=>o.status==='delivered').length,'Delivered']].map(([icon, val, label]) => (
          <div key={label} className="card" style={{padding:'20px',textAlign:'center'}}>
            <div style={{fontSize:'28px'}}>{icon}</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:'700',color:'var(--gold)'}}>{val}</div>
            <div style={{fontSize:'12px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'1px'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:'700'}}>Manage Products</h2>
            <button onClick={() => { setShowAddForm(true); setEditProduct(null); }} className="btn-gold" style={{fontSize:'13px',padding:'9px 20px'}}>
              + Add New Artwork
            </button>
          </div>

          {showAddForm && !editProduct && (
            <div className="card" style={{padding:'28px',marginBottom:'24px',border:'1px solid var(--accent)'}}>
              <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'18px',fontWeight:'700',marginBottom:'20px',color:'var(--accent2)'}}>Add New Artwork</h3>
              <ProductForm data={newProduct} setData={setNewProduct} onSubmit={handleSaveProduct} btnLabel="Add Artwork" />
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
            {products.map(p => (
              <div key={p.id}>
                {editProduct?.id === p.id ? (
                  <div className="card" style={{padding:'24px',border:'1px solid var(--accent)'}}>
                    <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:'700',marginBottom:'16px',color:'var(--accent2)'}}>Editing: {p.title}</h3>
                    <ProductForm data={editProduct} setData={setEditProduct} onSubmit={handleSaveProduct} btnLabel="Save Changes" />
                  </div>
                ) : (
                  <div className="card">
                    <div style={{height:'160px',overflow:'hidden'}}>
                      <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}
                        onError={e=>{e.target.src='https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80';}} />
                    </div>
                    <div style={{padding:'16px'}}>
                      <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'15px',fontWeight:'700',marginBottom:'4px',lineHeight:'1.3'}}>{p.title}</h3>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                        <span className="badge badge-accent">{p.cat}</span>
                        <span style={{fontFamily:'Playfair Display,serif',fontSize:'16px',fontWeight:'700',color:'var(--gold)'}}>₹{p.price?.toLocaleString()}</span>
                      </div>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={() => { setEditProduct({...p}); setShowAddForm(false); }} className="btn-ghost" style={{flex:1,padding:'8px',fontSize:'12px'}}>✏️ Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="btn-danger" style={{flex:1,padding:'8px',fontSize:'12px'}}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:'700',marginBottom:'20px'}}>All Orders</h2>
          {loadingOrders ? <Spinner /> : orders.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px',color:'var(--text2)'}}>
              <div style={{fontSize:'48px',marginBottom:'12px'}}>📦</div>
              <p>No orders yet</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {orders.map(order => (
                <div key={order.id} className="card" style={{padding:'24px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px',marginBottom:'16px'}}>
                    <div>
                      <div style={{fontSize:'11px',color:'var(--text3)',marginBottom:'2px'}}>ORDER #{order.id.slice(-8).toUpperCase()}</div>
                      <div style={{fontWeight:'700',color:'var(--text)'}}>{order.userName}</div>
                      <div style={{fontSize:'13px',color:'var(--text2)'}}>{order.userEmail}</div>
                      {order.userPhone && <div style={{fontSize:'12px',color:'var(--text3)'}}>{order.userPhone}</div>}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <select value={order.status||'pending'} onChange={e=>handleUpdateOrderStatus(order.id,e.target.value,order)}
                        style={{background:'var(--bg3)',border:'1px solid var(--border)',color:statusColors[order.status]||'var(--gold)',padding:'6px 12px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer',outline:'none'}}>
                        {['pending','confirmed','shipped','delivered','cancelled'].map(s => <option key={s} value={s} style={{color:'var(--text)'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                      <span style={{fontFamily:'Playfair Display,serif',fontSize:'18px',fontWeight:'700',color:'var(--gold)'}}>₹{order.totalINR?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{marginBottom:'12px'}}>
                    {(order.items||[]).map((item, i) => (
                      <div key={i} style={{fontSize:'13px',color:'var(--text2)',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                        {item.title} ×{item.qty} = <span style={{color:'var(--gold)',fontWeight:'600'}}>₹{(item.price*item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
                    <div style={{fontSize:'12px',color:'var(--text3)'}}>
                      <div>📍 {(order.address||'No address').slice(0,50)}</div>
                      <div style={{marginTop:'4px'}}>🕐 {order.createdAt?.toDate?.()?.toLocaleString?.() || 'Just now'}</div>
                    </div>
                    {order.userPhone && (
                      <button onClick={() => sendConfirmationWA(order)}
                        style={{display:'flex',alignItems:'center',gap:'6px',background:'#25d36618',border:'1px solid #25d36644',color:'#25d366',padding:'8px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>
                        📲 Send Confirmation to Customer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  return (
    <AppProvider>
      <GlobalStyle />
      <Router basename="/sruthi-arts">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
