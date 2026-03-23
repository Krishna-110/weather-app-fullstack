import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, CloudRain, Sun, Cloud, Eye, Navigation, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setError("GPS Denied. Search manually.")
      );
    }
  }, []);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/weather/coords?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) { setError("Java Backend Offline"); }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/weather/city/${city}`);
      const data = await res.json();
      setWeather(data);
      setCity('');
    } catch (err) { setError("Location not found."); }
    setLoading(false);
  };

  const getVibe = () => {
    if (!weather) return { colors: "from-sky-400 to-blue-500", type: "clear" };
    const desc = weather.description.toLowerCase();
    if (desc.includes("rain")) return { colors: "from-blue-600 to-slate-800", type: "rain" };
    if (desc.includes("cloud")) return { colors: "from-sky-300 to-blue-500", type: "cloud" };
    return { colors: "from-sky-400 to-blue-600", type: "clear" };
  };

  const vibe = getVibe();

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${vibe.colors} transition-all duration-1000 text-white font-sans`}>

      {/* --- INSTANT CLOUDS (Already on screen) --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[10%] animate-drift" style={{ animationDuration: '80s' }}><Cloud size={150} fill="white" className="text-white/20" /></div>
        <div className="absolute top-[25%] left-[60%] animate-drift" style={{ animationDuration: '120s' }}><Cloud size={200} fill="white" className="text-white/10" /></div>
        <div className="absolute top-[60%] left-[30%] animate-drift" style={{ animationDuration: '100s' }}><Cloud size={280} fill="white" className="text-white/10" /></div>
        <div className="absolute top-[80%] left-[75%] animate-drift" style={{ animationDuration: '150s' }}><Cloud size={180} fill="white" className="text-white/20" /></div>
      </div>

      {vibe.type === "rain" && [...Array(20)].map((_, i) => (
        <div key={i} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }} />
      ))}

      {/* DASHBOARD HEADER - Smaller */}
      <div className="absolute top-6 w-full px-10 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 opacity-60">
          <Compass size={14} className="animate-spin" style={{ animationDuration: '15s' }} />
          <span className="text-[8px] tracking-[0.4em] font-black uppercase">Atmospheric Sync</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black tracking-tighter">{time}</p>
          <p className="text-[8px] tracking-[0.2em] font-bold opacity-40 uppercase">System Ready</p>
        </div>
      </div>

      {/* SEARCH BOX - Shrinked to 'max-w-xs' */}
      <motion.form
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onSubmit={handleSearch}
        className="z-50 mb-8 w-full max-w-xs"
      >
        <div className="relative group">
          <input
            type="text" value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl py-3 px-10 outline-none focus:bg-white/20 transition-all text-center tracking-widest text-[10px] font-bold uppercase"
          />
          <Search className="absolute left-4 top-3 opacity-30" size={14} />
        </div>
      </motion.form>

      {/* THE GLASS CARD - Shrinked to 'max-w-xl' */}
      <AnimatePresence mode="wait">
        {weather && !loading && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="z-40 w-full max-w-xl bg-white/10 backdrop-blur-[40px] border border-white/30 rounded-[3rem] p-10 shadow-2xl glass-grain relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center">

              {/* City Name */}
              <div className="flex items-center gap-2 mb-2 opacity-60">
                <Navigation size={12} className="fill-white" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">{weather.cityName}</span>
              </div>

              {/* Main Content: Temp & Icon */}
              <div className="flex items-center justify-between w-full px-4 mb-6">
                <h1 className="text-8xl font-black tracking-tighter leading-none drop-shadow-lg">
                  {Math.round(weather.temperature)}°
                </h1>
                <div className="animate-bob">
                  {weather.description.includes("rain") ?
                    <CloudRain size={120} strokeWidth={1} className="text-white drop-shadow-xl" /> :
                    <Sun size={120} strokeWidth={1} className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
                  }
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-bold tracking-[0.5em] uppercase opacity-80 mb-10 border-b border-white/10 pb-4 w-full text-center">
                {weather.description}
              </p>

              {/* Stats Grid - Tighter padding */}
              <div className="grid grid-cols-4 gap-4 w-full">
                <div className="text-center">
                  <Thermometer className="mx-auto mb-2 opacity-40" size={18} />
                  <p className="text-[8px] font-black uppercase opacity-40">Feels Like</p>
                  <p className="text-xl font-light">{Math.round(weather.feelsLike)}°</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <Droplets className="mx-auto mb-2 opacity-40" size={18} />
                  <p className="text-[8px] font-black uppercase opacity-40">Humidity</p>
                  <p className="text-xl font-light">68%</p>
                </div>
                <div className="text-center border-r border-white/10">
                  <Wind className="mx-auto mb-2 opacity-40" size={18} />
                  <p className="text-[8px] font-black uppercase opacity-40">Wind</p>
                  <p className="text-xl font-light">14<span className="text-[10px] ml-1">km/h</span></p>
                </div>
                <div className="text-center">
                  <Eye className="mx-auto mb-2 opacity-40" size={18} />
                  <p className="text-[8px] font-black uppercase opacity-40">Visibility</p>
                  <p className="text-xl font-light">12<span className="text-[10px] ml-1">km</span></p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER - Subtle */}
      <div className="absolute bottom-6 opacity-20 text-[8px] font-black tracking-[0.8em] uppercase">
        Live Node 8080 // Atmospheric Sync
      </div>

      {loading && (
        <div className="absolute inset-0 bg-sky-500/30 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {error && <div className="absolute bottom-16 bg-red-500/20 backdrop-blur-md px-6 py-2 rounded-full border border-red-500/40 text-[10px] font-bold tracking-widest uppercase">{error}</div>}
    </div>
  );
};

export default App;