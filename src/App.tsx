/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  Palette,
  Check
} from 'lucide-react';
import { cn } from './lib/utils';
import myLogo from './lib/src/my-image.png/Screenshot 2026-05-02 190103.png';

// --- Types ---

type Page = 'home' | 'shop' | 'create' | 'contact' | 'checkout';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

interface Bundle {
  id: string;
  name: string;
  price: number;
  pillCount: number;
}

// --- Constants ---

const CATEGORIES = [
  { id: 'hair', name: 'Top', brand: 'HairPop', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800' },
  { id: 'brows', name: 'Eyebrows', brand: 'BrowPop', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800' },
  { id: 'facial', name: 'Facial Hair', brand: 'StachePop', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800' },
  { id: 'party', name: 'Body Hair', brand: 'PartyPop', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
];

const BUNDLES: Bundle[] = [
  { id: 'single', name: 'The Solo Pop', price: 7, pillCount: 1 },
  { id: 'triple', name: 'The Trio Pack', price: 20, pillCount: 3 },
  { id: 'penta', name: 'The Party Pack', price: 30, pillCount: 5 },
];

const COLORS = [
  { name: 'Neon Pink', hex: '#ff007f' },
  { name: 'Electric Blue', hex: '#00ffff' },
  { name: 'Emerald Green', hex: '#50c878' },
  { name: 'Royal Purple', hex: '#7851a9' },
  { name: 'Sunset Orange', hex: '#ff4500' },
  { name: 'Silver Mist', hex: '#c0c0c0' },
];

const STYLES = ['Solid', 'Ombre', 'Glow-in-the-dark'];

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <img src={myLogo} alt="HairPop Logo" className="h-10 w-10 object-contain" />
    <span className="font-sans text-4xl font-black tracking-tighter uppercase">Hair<span className="font-light text-brand-muted">Pop</span></span>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [customization, setCustomization] = useState({
    color: COLORS[0],
    hue: 330,
    saturation: 100,
    style: STYLES[0],
    category: CATEGORIES[0],
    pattern: 'None',
    patternHue: 180,
    patternSaturation: 100
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleBuyClick = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setCurrentPage('create');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'shop':
        return <Shop onBuy={handleBuyClick} />;
      case 'create':
        return (
          <Create 
            selectedBundle={selectedBundle} 
            customization={customization}
            setCustomization={setCustomization}
            onCheckout={() => setCurrentPage('checkout')}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            selectedBundle={selectedBundle}
            customization={customization}
            onSuccess={() => setCurrentPage('home')}
          />
        );
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-paper border-b border-brand-line px-10 py-10">
        <div className="max-w-7xl mx-auto flex items-baseline justify-between">
          <button onClick={() => setCurrentPage('home')} className="hover:opacity-80 transition-opacity">
            <Logo />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {(['home', 'shop', 'contact'] as Page[]).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "uppercase text-[12px] tracking-[2px] font-semibold nav-link-hover",
                  currentPage === page ? "after:w-full" : ""
                )}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-brand-cream border-b border-brand-ink/10 p-8 flex flex-col gap-6 md:hidden"
            >
              {(['home', 'shop', 'contact'] as Page[]).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMenuOpen(false);
                  }}
                  className="uppercase text-lg tracking-widest font-serif text-left"
                >
                  {page}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-ink text-brand-paper py-6 px-10 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-widest gap-4">
        <div>Support: hello@hairpop.tech</div>
        <div>&copy; 2024 HairPop Nanotechnologies Inc.</div>
        <div>Inquiry: +1 (800) POP-HAIR</div>
      </footer>
    </div>
  );
}

// --- Page Sections ---

function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden border-b border-brand-line">
        <div className="max-w-7xl mx-auto px-10 w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-8 normal-case font-normal">
              Biodegradable<br />
              Organic<br />
              24 Hours.
            </h1>
            <p className="text-lg text-brand-muted mb-10 font-serif leading-relaxed">
              Select your bundle below. Each pill contains trillions of nano-drones that coat the hair shaft without damaging the cuticle. Dissolves naturally after one day.
            </p>
            <button 
              onClick={() => onNavigate('shop')}
              className="bg-brand-ink text-brand-paper px-10 py-5 text-xs uppercase tracking-[2px] font-black hover:bg-brand-ink/90 transition-all"
            >
              Shop the Collection
            </button>
          </motion.div>
          <div className="hidden md:block aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=2000" 
              alt="Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-10 bg-brand-paper border-b border-brand-line">
        <div className="max-w-7xl mx-auto">
          <h2 className="editorial-header">Sectors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer p-6 border border-brand-line rounded-sm hover:bg-brand-ink hover:text-brand-paper transition-colors"
                onClick={() => onNavigate('shop')}
              >
                <h3 className="text-lg font-bold mb-1">{cat.brand}</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-60">{cat.name} Application</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-brand-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl flex items-center justify-center bg-brand-cream">
              <img
                src={myLogo}
                alt="HairPop Logo"
                className="w-2/3 h-2/3 object-contain"
              />
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-serif mb-12 leading-tight">The Science of <br /><span className="italic">Temporary Beauty</span></h2>
            
            <div className="space-y-10">
              {[
                { icon: <Zap size={24} />, title: "Instant Activation", desc: "Color manifests within 15 minutes of ingestion." },
                { icon: <ShieldCheck size={24} />, title: "100% Biodegradable", desc: "Naturally breaks down and flushes from your system after 24 hours." },
                { icon: <Clock size={24} />, title: "Precision Timing", desc: "Engineered to fade exactly at the 24-hour mark." },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-brand-ink">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 uppercase tracking-widest text-sm">{item.title}</h4>
                    <p className="text-brand-ink/60 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Shop({ onBuy }: { onBuy: (bundle: Bundle) => void }) {
  return (
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h1 className="text-5xl font-serif italic mb-6 normal-case font-normal">Pricing Bundles</h1>
          <p className="editorial-header">Select Your Dose</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.map((bundle) => (
            <motion.div 
              key={bundle.id}
              className="bg-white p-8 flex justify-between items-center border border-brand-line rounded-xl hover:border-brand-ink transition-all cursor-pointer group"
              onClick={() => onBuy(bundle)}
            >
              <div className="flex flex-col">
                <span className="text-3xl font-black">{bundle.pillCount < 10 ? `0${bundle.pillCount}` : bundle.pillCount}</span>
                <span className="text-[12px] uppercase tracking-widest text-brand-muted font-bold">{bundle.name}</span>
              </div>
              <div className="text-3xl font-serif font-bold">${bundle.price}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 bg-[#4E342E] text-brand-cream rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[#D1C4E9] uppercase text-lg tracking-widest font-bold mb-3">No Damage</h4>
                <p className="text-sm text-gray-300 font-light">Unlike traditional dyes, our nanotech doesn't penetrate the hair shaft or use harsh chemicals.</p>
              </div>
              <div>
                <h4 className="text-[#D1C4E9] uppercase text-lg tracking-widest font-bold mb-3">Eco-Friendly</h4>
                <p className="text-sm text-gray-300 font-light">Derived from plant-based polymers that dissolve completely in water after use.</p>
              </div>
              <div>
                <h4 className="text-[#D1C4E9] uppercase text-lg tracking-widest font-bold mb-3">Any Hair Type</h4>
                <p className="text-sm text-gray-300 font-light">Works on the darkest raven hair and the lightest platinum with equal vibrancy.</p>
              </div>
              <div>
                <h4 className="text-[#D1C4E9] uppercase text-lg tracking-widest font-bold mb-3">Global Shipping</h4>
                <p className="text-sm text-gray-300 font-light">We deliver the future of beauty to your doorstep, anywhere in the world.</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 hidden lg:block">
             <img 
              src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800" 
              alt="Texture" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Create({ 
  selectedBundle, 
  customization, 
  setCustomization,
  onCheckout
}: { 
  selectedBundle: Bundle | null,
  customization: any,
  setCustomization: (c: any) => void,
  onCheckout: () => void
}) {
  return (
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-0 border border-brand-line rounded-3xl overflow-hidden bg-white">
          {/* Preview */}
          <div className="flex-1 p-10 column-border flex flex-col justify-center">
            <h2 className="editorial-header">Visualizer</h2>
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden relative shadow-lg border border-brand-line">
              <div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: customization.color.hex }}
              />
              {customization.pattern !== 'None' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    backgroundImage: customization.pattern === 'Highlights' 
                      ? 'linear-gradient(90deg, transparent 35%, currentColor 50%, transparent 65%)'
                      : 'repeating-linear-gradient(45deg, currentColor, currentColor 15px, transparent 15px, transparent 30px)',
                    backgroundSize: customization.pattern === 'Highlights' ? '40px 100%' : '60px 60px',
                    color: `hsl(${customization.patternHue}, ${customization.patternSaturation ?? 100}%, 50%)`
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-brand-muted mt-6 text-center font-bold">
              {customization.pattern !== 'None' ? `${customization.pattern} Active` : 'Solid Pigment'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex-1 p-10 bg-[#EFEFEF]">
            <h2 className="editorial-header">Create Studio</h2>
            
            <div className="mb-12 flex flex-col items-center">
              <div 
                className="w-32 h-16 rounded-full border-2 border-white shadow-lg transition-colors duration-300 mb-6"
                style={{ backgroundColor: customization.color.hex }}
              />
              <span className="text-[12px] font-black uppercase tracking-widest">Molecular Pigment Selector</span>
            </div>

            <div className="space-y-12">
              {/* Color Selection Slider */}
              <div>
                <h2 className="editorial-header mb-6">02. Hue Spectrum</h2>
                <div className="relative h-12 w-full rounded-full overflow-hidden border border-white shadow-inner mb-4" 
                     style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={customization.hue || 0}
                    onChange={(e) => {
                      const hue = parseInt(e.target.value);
                      const saturation = customization.saturation || 100;
                      setCustomization({ 
                        ...customization, 
                        hue,
                        color: { name: `Custom Hue ${hue}`, hex: `hsl(${hue}, ${saturation}%, 50%)` } 
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <motion.div 
                    className="absolute top-0 bottom-0 w-1 bg-brand-ink shadow-lg pointer-events-none"
                    style={{ left: `${(customization.hue || 0) / 360 * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-muted font-bold">
                  <span>Warm</span>
                  <span>Cool</span>
                  <span>Warm</span>
                </div>
              </div>

              {/* Saturation Selection Slider */}
              <div>
                <h2 className="editorial-header mb-6">03. Pigment Intensity</h2>
                <div className="relative h-12 w-full rounded-full overflow-hidden border border-white shadow-inner mb-4" 
                     style={{ background: `linear-gradient(to right, hsl(${customization.hue || 0}, 0%, 50%), hsl(${customization.hue || 0}, 100%, 50%))` }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={customization.saturation ?? 100}
                    onChange={(e) => {
                      const saturation = parseInt(e.target.value);
                      const hue = customization.hue || 0;
                      setCustomization({ 
                        ...customization, 
                        saturation,
                        color: { name: `Custom Hue ${hue}`, hex: `hsl(${hue}, ${saturation}%, 50%)` } 
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <motion.div 
                    className="absolute top-0 bottom-0 w-1 bg-brand-ink shadow-lg pointer-events-none"
                    style={{ left: `${customization.saturation ?? 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-muted font-bold">
                  <span>Neutral</span>
                  <span>Vibrant</span>
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <h2 className="editorial-header mb-4">04. Finishing</h2>
                <div className="space-y-3">
                  {STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setCustomization({ ...customization, style })}
                      className={cn(
                        "w-full flex justify-between bg-white p-4 rounded-lg text-[13px] font-bold uppercase tracking-widest transition-all",
                        customization.style === style 
                          ? "ring-1 ring-brand-ink" 
                          : "opacity-50 hover:opacity-80"
                      )}
                    >
                      <span>{style}</span>
                      <span>{customization.style === style ? 'ON' : 'OFF'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Selection */}
              <div>
                <h2 className="editorial-header mb-4">05. Pattern Overlay</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['None', 'Highlights', 'Zigzags'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setCustomization({ ...customization, pattern: p })}
                      className={cn(
                        "py-3 rounded-lg text-[10px] uppercase tracking-widest font-black transition-all border",
                        customization.pattern === p 
                          ? "bg-brand-ink text-brand-paper border-brand-ink" 
                          : "bg-white text-brand-ink border-brand-line opacity-60 hover:opacity-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {customization.pattern !== 'None' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-4">Pattern Color</h3>
                      <div className="relative h-8 w-full rounded-full overflow-hidden border border-white shadow-inner mb-6" 
                           style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}>
                        <input 
                          type="range" 
                          min="0" 
                          max="360" 
                          value={customization.patternHue || 0}
                          onChange={(e) => {
                            setCustomization({ 
                              ...customization, 
                              patternHue: parseInt(e.target.value)
                            });
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div 
                          className="absolute top-0 bottom-0 w-1 bg-brand-ink shadow-lg pointer-events-none"
                          style={{ left: `${(customization.patternHue || 0) / 360 * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-4">Pattern Intensity</h3>
                      <div className="relative h-8 w-full rounded-full overflow-hidden border border-white shadow-inner" 
                           style={{ background: `linear-gradient(to right, hsl(${customization.patternHue || 0}, 0%, 50%), hsl(${customization.patternHue || 0}, 100%, 50%))` }}>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={customization.patternSaturation ?? 100}
                          onChange={(e) => {
                            setCustomization({ 
                              ...customization, 
                              patternSaturation: parseInt(e.target.value)
                            });
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div 
                          className="absolute top-0 bottom-0 w-1 bg-brand-ink shadow-lg pointer-events-none"
                          style={{ left: `${customization.patternSaturation ?? 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-brand-ink text-brand-paper py-6 text-xs uppercase tracking-[2px] font-black hover:bg-brand-ink/90 transition-all mt-10"
              >
                Review & Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Checkout({ 
  selectedBundle, 
  customization,
  onSuccess
}: { 
  selectedBundle: Bundle | null,
  customization: any,
  onSuccess: () => void
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <section className="py-40 px-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-brand-ink text-brand-paper rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} />
          </div>
          <h1 className="text-5xl font-serif italic mb-6 normal-case font-normal">Order Confirmed</h1>
          <p className="text-brand-muted mb-10">Your nanotech pigments are being synthesized. You will receive a tracking number shortly.</p>
          <p className="editorial-header">Redirecting to Home...</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h1 className="text-5xl font-serif italic mb-6 normal-case font-normal">Checkout</h1>
          <p className="editorial-header">Finalize Your Order</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Forms */}
          <div className="flex-[2] space-y-16">
            {/* Shipping Section */}
            <div>
              <h2 className="editorial-header mb-8">01. Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Full Name</label>
                  <input required type="text" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Email Address</label>
                  <input required type="email" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Street Address</label>
                  <input required type="text" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40">City</label>
                  <input required type="text" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">State</label>
                    <input required type="text" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">ZIP Code</label>
                    <input required type="text" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h2 className="editorial-header mb-8">02. Payment Method</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <button type="button" className="flex-1 py-4 border border-brand-ink rounded-lg text-[10px] uppercase tracking-widest font-black">Credit Card</button>
                  <button type="button" className="flex-1 py-4 border border-brand-line rounded-lg text-[10px] uppercase tracking-widest font-black opacity-40 grayscale hover:grayscale-0 transition-all">PayPal</button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">CVC</label>
                      <input required type="text" placeholder="000" className="w-full bg-transparent border-b border-brand-line py-3 focus:outline-none focus:border-brand-ink transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="flex-1">
            <div className="sticky top-32 bg-white border border-brand-line p-10 rounded-3xl">
              <h2 className="editorial-header mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-brand-line">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm uppercase tracking-tight">{selectedBundle?.name || 'The Solo Pop'}</p>
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-1">
                      {customization.category.brand} / {customization.color.name} / {customization.style}
                    </p>
                  </div>
                  <p className="font-serif font-bold">${selectedBundle?.price || 7}.00</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted uppercase tracking-widest text-[10px] font-bold">Tax</span>
                  <span className="font-serif font-bold">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-[10px] uppercase tracking-[2px] font-black">Total</span>
                <span className="text-4xl font-serif font-bold">${selectedBundle?.price || 7}.00</span>
              </div>

              <button 
                disabled={isProcessing}
                type="submit"
                className="w-full bg-brand-ink text-brand-paper py-6 text-xs uppercase tracking-[2px] font-black hover:bg-brand-ink/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>Processing <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-brand-paper border-t-transparent rounded-full" /></>
                ) : (
                  <>Complete Purchase <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-[9px] text-brand-muted uppercase tracking-widest text-center mt-6 leading-relaxed">
                By clicking "Complete Purchase", you agree to our Terms of Service and Privacy Policy. All sales are final due to the nature of molecular pigments.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h1 className="text-6xl font-serif mb-8">Get in Touch</h1>
            <p className="text-lg text-brand-ink/60 mb-12 font-light leading-relaxed">
              Have questions about our nanotechnology? Our team of bio-engineers and style consultants are here to help you pop.
            </p>
            
            <div className="space-y-8">
              <div>
                <h4 className="uppercase text-xs tracking-widest font-bold mb-2">Headquarters</h4>
                <p className="text-brand-ink/80 font-light">Sveavägen 44, 111 34 Stockholm, Sweden</p>
              </div>
              <div>
                <h4 className="uppercase text-xs tracking-widest font-bold mb-2">Email</h4>
                <p className="text-brand-ink/80 font-light underline">hello@hairpop.tech</p>
              </div>
              <div>
                <h4 className="uppercase text-xs tracking-widest font-bold mb-2">Press Inquiries</h4>
                <p className="text-brand-ink/80 font-light underline">press@hairpop.tech</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-brand-ink/5">
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="uppercase text-[10px] tracking-widest font-bold opacity-40">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="uppercase text-[10px] tracking-widest font-bold opacity-40">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-ink transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="uppercase text-[10px] tracking-widest font-bold opacity-40">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-ink transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="uppercase text-[10px] tracking-widest font-bold opacity-40">Subject</label>
                <select className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-ink transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Wholesale</option>
                  <option>Press</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="uppercase text-[10px] tracking-widest font-bold opacity-40">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-ink transition-colors resize-none" />
              </div>
              <button className="w-full bg-brand-ink text-brand-cream py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-brand-ink transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

