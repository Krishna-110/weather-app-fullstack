import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, CloudRain, Sun, Cloud, Eye, Navigation, Compass } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- YOUR OFFICIAL LIVE BACKEND LINK ---
const RENDER_URL = "https://weather-app-fullstack-adpv.onrender.com"; 

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // --- 1. 3D TILT LOGIC (Premium Dashboard Feel) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // --- 2. LIVE CLOCK UPDATE ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 3. BACKEND FETCHING (GPS & MANUAL) ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setError("GPS Denied. Search manually below.")
      );
    }
  }, []);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${RENDER_URL}/api/weather/coords?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) { setError("Java Backend is waking up... Please wait 30s."); }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${RENDER_URL}/api/weather/city/${city}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWeather(data);
      setCity('');
    } catch (err) { setError("Location not found in database."); }
    setLoading(false);
  };

  // --- 4. SKY BLUE VIBE ENGINE ---
  const vibeColors = weather?.description?.toLowerCase().includes("rain") 
    ? "from-blue-600 via-blue-800 to-slate-900" 
    : "from-sky-400 via-sky-400 to-blue-500";

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${vibeColors} transition-all duration-1000 text-white font-sans`}>
      
      {/* 5. INSTANT CLOUDS (Already scattered on screen) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[12%] left-[15%] animate-drift" style={{ animationDuration: '80s' }}><Cloud size={140} fill="white" className="text-white/20" /></div>
        <div className="absolute top-[35%] left-[60%] animate-drift" style={{ animationDuration: '115s' }}><Cloud size={200} fill="white" className="text-white/10" /></div>
        <div className="absolute top-[68%] left-[28%] animate-drift" style={{ animationDuration: '98s' }}><Cloud size={250} fill="white" className="text-white/15" /></div>
        <div className="absolute top-[82%] left-[78%] animate-drift" style={{ animationDuration: '145s' }}><Cloud size={160} fill="white" className="text-white/20" /></div>
      </div>

      {/* RAIN PARTICLES (Only if raining) */}
      {weather?.description?.toLowerCase().includes("rain") && [...Array(30)].map((_, i) => (
        <div key={i} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.4 + 0.4}s` }} />
      ))}

      {/* DASHBOARD HEADER */}
      <div className="absolute top-8 w-full px-12 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 opacity-70">
          <Compass size={16} className="animate-spin text-white" style={{ animationDuration: '12s' }} />
          <span className="text-[10px] tracking-[0.5em] font-black uppercase text-white shadow-sm">Atmospheric Sync 1.0</span>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black tracking-tighter text-white drop-shadow-md">{time}</p>
          <p className="text-[9px] tracking-[0.3em] font-bold opacity-40 uppercase">Satellite Connected</p>
        </div>
      </div>

      {/* SEARCH PILL */}
      <motion.form 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onSubmit={handleSearch}
        className="z-50 mb-10 w-full max-w-xs"
      >
        <div className="relative group">
          <input 
            type="text" value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-white/20 backdrop-blur-3xl border border-white/30 rounded-2xl py-3 px-10 outline-none focus:bg-white/30 transition-all text-center tracking-widest text-[10px] font-bold uppercase placeholder:text-white/60 shadow-xl"
          />
          <Search className="absolute left-4 top-3 opacity-30" size={14} />
        </div>
      </motion.form>

      {/* THE GLASS CARD (Sleeker and Centered) */}
      <AnimatePresence mode="wait">
        {weather && !loading && (
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="z-40 w-full max-w-xl bg-white/10 backdrop-blur-[50px] border border-white/40 rounded-[3.5rem] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.2)] glass-grain relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="relative z-10 flex flex-col items-center">
              
              <div className="flex items-center gap-2 mb-4 opacity-70">
                <Navigation size={12} className="fill-white" />
                <span className="text-[11px] font-black tracking-[0.6em] uppercase">{weather.cityName}</span>
              </div>

              <div className="flex items-center justify-between w-full px-6 mb-10">
                <h1 className="text-8xl font-black tracking-tighter leading-none drop-shadow-2xl">
                  {Math.round(weather.temperature)}°
                </h1>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                  {weather.description.includes("rain") ? 
                    <CloudRain size={120} strokeWidth={1} className="text-white drop-shadow-xl" /> : 
                    <Sun size={120} strokeWidth={1} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]" />
                  }
                </motion.div>
              </div>

              <p className="text-sm font-bold tracking-[0.6em] uppercase opacity-90 mb-12 border-b border-white/10 pb-6 w-full text-center">
                {weather.description}
              </p>

              <div className="grid grid-cols-4 gap-4 w-full px-2">
                <div className="text-center">
                  <Thermometer className="mx-auto mb-3 opacity-40" size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Feels Like</p>
                  <p className="text-2xl font-light">{Math.round(weather.feelsLike)}°</p>
                </div>
                <div className="text-center border-x border-white/10 px-2">
                  <Droplets className="mx-auto mb-3 opacity-40" size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Humid</p>
                  <p className="text-2xl font-light">64%</p>
                </div>
                <div className="text-center border-r border-white/10 px-2">
                  <Wind className="mx-auto mb-3 opacity-40" size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Wind</p>
                  <p className="text-2xl font-light">12<span className="text-[10px] ml-1 opacity-40">km</span></p>
                </div>
                <div className="text-center">
                  <Eye className="mx-auto mb-3 opacity-40" size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Vis</p>
                  <p className="text-2xl font-light">10<span className="text-[10px] ml-1 opacity-40">km</span></p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 opacity-20 text-[9px] font-black tracking-[0.8em] uppercase flex items-center gap-4">
        <span>Node: 8080</span>
        <div className="w-1 h-1 bg-white rounded-full" />
        <span>Vercel Deployment Live</span>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-sky-400/30 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6" />
          <p className="tracking-[1em] font-black text-[10px] animate-pulse">Syncing Atmosphere...</p>
        </div>
      )}

      {error && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="absolute bottom-20 bg-red-500/20 backdrop-blur-xl px-10 py-3 rounded-2xl border border-red-500/40 text-[10px] font-bold tracking-widest uppercase text-white">
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default App;
