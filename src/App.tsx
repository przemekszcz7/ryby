/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Phone, ArrowRight, Check, Menu, X } from 'lucide-react';
import { owoceMorzaList, rybyFiletowaneList } from './data';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<number>(0);

  // References for revealing content on scroll
  const revealedRefs = useRef<(HTMLDivElement | HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      scrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll-reveal animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // If the element reveal is the cennik section, we trigger index-delay reveal
          if (entry.target.id === 'cennik') {
            const rows = entry.target.querySelectorAll('.item-row');
            rows.forEach((row, index) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.opacity = '0';
              htmlRow.style.transform = 'translateY(12px)';
              htmlRow.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
              setTimeout(() => {
                htmlRow.style.opacity = '1';
                htmlRow.style.transform = 'translateY(0)';
              }, index * 25);
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealedRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | HTMLElement | null) => {
    if (el && !revealedRefs.current.includes(el)) {
      revealedRefs.current.push(el);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div className="min-h-screen bg-page-bg font-sans text-text-secondary antialiased">
      
      {/* STICKY NAVIGATION */}
      <header 
        className={`fixed top-0 left-0 w-full z-1000 transition-all duration-300 border-b border-border-color ${
          scrolled 
            ? 'bg-white/98 shadow-sm py-3' 
            : 'bg-white/96 backdrop-blur-md py-4'
        }`}
        id="main-header"
      >
        <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center h-16">
          <a href="#" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <img 
              className="w-8 h-8 rounded-[4px] object-cover border border-border-color/40" 
              src="https://i.ibb.co/ZphJHnXd/301608594-465227248959822-4051887093912608871-n.jpg" 
              referrerPolicy="no-referrer"
              alt="Ryby Dostawa Do Domu logo" 
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-1.2rem tracking-tight text-navy leading-none">RYBY</span>
              <span className="font-sans font-light text-[0.8rem] text-text-muted leading-tight mt-0.5">dostawa do domu</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#cennik" className="font-medium text-[0.875rem] text-text-secondary hover:text-navy transition-colors">Cennik</a>
            <a href="#o-nas" className="font-medium text-[0.875rem] text-text-secondary hover:text-navy transition-colors">O Nas</a>
            <a href="#opinie" className="font-medium text-[0.875rem] text-text-secondary hover:text-navy transition-colors">Opinie</a>
            <a href="#kontakt" className="font-medium text-[0.875rem] text-text-secondary hover:text-navy transition-colors">Kontakt</a>
            <a 
              href="tel:574442660" 
              className="bg-teal-accent text-white font-semibold text-[0.875rem] rounded-full px-[22px] py-[9px] shadow-[0_4px_16px_rgba(10,140,110,0.3)] hover:bg-teal-light hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,140,110,0.4)] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" /> 574 442 660
            </a>
          </nav>

          {/* Hamburger (Mobile Toggle) */}
          <button 
            className="md:hidden p-2 text-navy hover:bg-slate-100 rounded-md transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Menu"
            id="btn-hamburger"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-white z-999 flex flex-col justify-center items-center gap-8 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <a href="#cennik" className="font-semibold text-2xl text-navy" onClick={closeMobileMenu}>Cennik</a>
        <a href="#o-nas" className="font-semibold text-2xl text-navy" onClick={closeMobileMenu}>O Nas</a>
        <a href="#opinie" className="font-semibold text-2xl text-navy" onClick={closeMobileMenu}>Opinie</a>
        <a href="#kontakt" className="font-semibold text-2xl text-navy" onClick={closeMobileMenu}>Kontakt</a>
        <a 
          href="tel:574442660" 
          className="bg-teal-accent text-white font-semibold text-lg rounded-full px-8 py-3.5 shadow-lg hover:bg-teal-light mt-4 flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <Phone className="w-5 h-5" /> 574 442 660
        </a>
      </div>

      {/* HERO SECTION */}
      <section 
        id="hero" 
        className="bg-navy relative overflow-hidden min-h-screen flex items-center pt-[140px] pb-[100px] px-6 text-center"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)'
        }}
      >
        {/* Ambient Water Blurs */}
        <div className="absolute rounded-full filter blur-[100px] pointer-events-none bg-teal-accent/12 w-[600px] h-[600px] -top-[100px] -right-[100px] z-1" />
        <div className="absolute rounded-full filter blur-[100px] pointer-events-none bg-[#1A4D6E]/30 w-[500px] h-[500px] -bottom-[150px] -left-[150px] z-1" />

        <div className="max-w-[760px] mx-auto relative z-2 w-full">
          <span className="hero-label text-teal-accent font-semibold text-[0.72rem] tracking-[0.18em] uppercase">
            Warszawa i okolice · Dostawa następnego dnia
          </span>
          <hr className="w-16 border-t-2 border-teal-accent mx-auto my-[18px]" />
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] text-white tracking-[-0.03em] leading-[0.92] mb-6">
            Ryby i owoce morza<br />
            prosto do Twoich <span className="font-sans font-light text-white/50">drzwi.</span>
          </h1>
          <p className="font-sans font-light text-[1.05rem] text-white/60 max-w-[480px] mx-auto mb-8 leading-relaxed">
            Świeże ryby i owoce morza z dostawą do domu w Warszawie i okolicach. Zamów dziś — dostarczymy następnego dnia.
          </p>

          <div className="flex justify-center flex-wrap gap-3 mb-[36px]">
            <span className="bg-white/7 border border-white/12 rounded-full px-[18px] py-2 text-[0.85rem] text-white/85 inline-flex items-center gap-1.5 font-sans">
              🐟 Świeże ryby
            </span>
            <span className="bg-white/7 border border-white/12 rounded-full px-[18px] py-2 text-[0.85rem] text-white/85 inline-flex items-center gap-1.5 font-sans">
              🦐 Owoce morza
            </span>
            <span className="bg-white/7 border border-white/12 rounded-full px-[18px] py-2 text-[0.85rem] text-white/85 inline-flex items-center gap-1.5 font-sans">
              🚚 Następny dzień
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 max-w-[420px] sm:max-w-none mx-auto">
            <a 
              href="#cennik" 
              className="bg-teal-accent text-white font-semibold text-base rounded-[6px] px-8 py-3.5 shadow-[0_6px_24px_rgba(10,140,110,0.4)] hover:bg-teal-light hover:-translate-y-0.5 transition-all text-center"
            >
              Zobacz cennik
            </a>
            <a 
              href="tel:574442660" 
              className="border-1.5 border-white/25 text-white/80 font-medium text-base rounded-[6px] px-8 py-3.5 hover:border-white/50 hover:text-white hover:bg-white/2 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-teal-accent" /> Zadzwoń: 574 442 660
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section 
        id="o-nas" 
        ref={addToRefs} 
        className="section reveal-el bg-white border-b border-border-color py-24 px-6"
      >
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-[72px] items-start">
          
          {/* Left Column Text */}
          <div>
            <span className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-teal-accent block mb-2">
              O DOSTAWIE
            </span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] text-navy tracking-[-0.02em] leading-tight mb-[14px]">
              Świeże ryby bez wychodzenia z domu.
            </h2>
            <hr className="w-14 border-t-3 border-teal-accent mb-6" />
            
            <div className="text-text-secondary text-base leading-relaxed space-y-4 font-sans">
              <p>
                Dostarczamy ryby i owoce morza bezpośrednio do Twoich drzwi w Warszawie i okolicach. Zamawiasz dziś — masz towar następnego dnia.
              </p>
              <p>
                Produkty są odpowiednio zapakowane i przygotowane do przechowywania. Dbamy o jakość na każdym etapie — od chłodni po Twój próg.
              </p>
            </div>

            <div className="mt-8 border-t border-border-color">
              <div className="flex justify-between items-center py-4 border-b border-border-color/40 gap-4">
                <span className="font-semibold text-text-primary text-[0.95rem]">Dostawa następnego dnia</span>
                <span className="text-text-muted text-[0.9rem] text-right">zamów do wieczora, odbierz rano</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-border-color/40 gap-4">
                <span className="font-semibold text-text-primary text-[0.95rem]">Warszawa i okolice</span>
                <span className="text-text-muted text-[0.9rem] text-right">sprawdź czy dowozimy do Ciebie</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-border-color/40 gap-4">
                <span className="font-semibold text-text-primary text-[0.95rem]">Właściwe pakowanie</span>
                <span className="text-text-muted text-[0.9rem] text-right">produkty bezpieczne w transporcie</span>
              </div>
            </div>
          </div>

          {/* Right Column Order Card */}
          <div className="bg-navy text-white/85 p-9 rounded-[6px] relative overflow-hidden shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-teal-accent">
            <span className="font-sans font-semibold text-[0.7rem] tracking-[0.18em] uppercase text-teal-accent block mb-3">
              ZAMÓW TERAZ
            </span>
            <a 
              href="tel:574442660" 
              className="font-display font-bold text-3xl sm:text-4xl text-white block hover:text-teal-accent transition-colors tracking-tight my-4"
            >
              574 442 660
            </a>
            <hr className="border-t border-white/9 my-5" />
            <span className="font-sans text-[0.85rem] text-white/45 block mb-1">Obszar: Warszawa i okolice</span>
            <span className="font-sans text-[0.8rem] text-white/35 italic block">Dostawa następnego dnia po zamówieniu</span>
            <a 
              href="https://www.facebook.com/RybyDostawaDoDomu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 font-sans font-medium text-[0.875rem] text-teal-accent mt-5 hover:text-teal-light hover:underline underline-offset-4"
            >
              Facebook <i className="fa-brands fa-facebook"></i> →
            </a>
          </div>

        </div>
      </section>

      {/* CENNIK SECTION */}
      <section 
        id="cennik" 
        ref={addToRefs} 
        className="section reveal-el bg-page-bg py-24 px-6"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-12">
            <span className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-teal-accent block mb-2">
              CENNIK
            </span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] text-navy tracking-[-0.02em]">
              Aktualny cennik
            </h2>
            <p className="font-sans font-light italic text-base text-text-muted mt-2">
              Opakowania po 1 kg · ceny za kilogram
            </p>
          </div>

          {/* CATEGORY 1: OWOCE MORZA */}
          <div className="mb-14 rounded-[6px] overflow-hidden shadow-sm">
            <div className="bg-navy px-6 py-4 flex justify-between items-center gap-4">
              <h3 className="font-display font-bold text-lg text-white">🦐 Owoce Morza</h3>
              <span className="font-sans font-light italic text-xs text-white/55">opakowanie 1 kg</span>
            </div>
            <div className="bg-white border border-border-color border-t-0 divide-y divide-surface-tint">
              {owoceMorzaList.map((item) => (
                <div key={item.id} className="item-row px-6 py-3.5 flex justify-between items-center gap-4 hover:bg-page-bg transition-colors">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="font-sans text-xs text-text-muted min-w-[28px]">{item.id}.</span>
                    <span className="font-display font-semibold text-[1rem] text-text-primary truncate">{item.name}</span>
                  </div>
                  <div className="min-w-[90px] text-right flex justify-end">
                    <span className="font-sans font-semibold tabular-nums text-price-color text-[1rem]">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORY 2: RYBY FILETOWANE */}
          <div className="mb-14 rounded-[6px] overflow-hidden shadow-sm">
            <div className="bg-navy px-6 py-4 flex justify-between items-center gap-4">
              <h3 className="font-display font-bold text-lg text-white">🐟 Ryby Filetowane</h3>
              <span className="font-sans font-light italic text-xs text-white/55">różne wielkości opakowań</span>
            </div>
            <div className="bg-white border border-border-color border-t-0 divide-y divide-surface-tint">
              {rybyFiletowaneList.map((item) => (
                <div key={item.id} className="item-row px-6 py-3.5 flex justify-between items-center gap-4 hover:bg-page-bg transition-colors">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="font-sans text-xs text-text-muted min-w-[28px]">{item.id}.</span>
                    <span className="font-display font-semibold text-[1rem] text-text-primary truncate">{item.name}</span>
                    {item.packageSize && (
                      <span className="hidden sm:inline-block bg-[#EEF8F4] text-teal-accent rounded-full px-2.5 py-0.5 text-[0.72rem] font-sans font-medium whitespace-nowrap">
                        {item.packageSize}
                      </span>
                    )}
                  </div>
                  <div className="min-w-[90px] text-right flex justify-end items-center gap-3">
                    {item.packageSize && (
                      <span className="inline-block sm:hidden bg-[#EEF8F4] text-teal-accent rounded-full px-2 py-0.5 text-[0.65rem] font-sans font-medium whitespace-nowrap">
                        {item.packageSize}
                      </span>
                    )}
                    <span className="font-sans font-semibold tabular-nums text-price-color text-[1rem]">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STRIP BOTTOM */}
          <div className="bg-navy p-6 sm:p-8 rounded-[6px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <span className="font-sans font-light italic text-sm text-white/55">
              Ceny mogą ulec zmianie. Aktualne ceny potwierdzimy przy zamówieniu.
            </span>
            <a 
              href="tel:574442660" 
              className="font-sans font-semibold text-teal-accent flex items-center gap-1.5 hover:text-teal-light transition-colors"
            >
              Zapytaj o dostępność <ArrowRight className="w-4 h-4 animate-pulse" />
            </a>
          </div>

        </div>
      </section>

      {/* REVIEW SECTION */}
      <section 
        id="opinie" 
        ref={addToRefs} 
        className="section reveal-el bg-navy py-24 px-6 text-center"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-12">
            <span className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-teal-accent block mb-2">
              OPINIE
            </span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] text-white tracking-[-0.02em]">
              Co mówią klienci
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[6px] p-9 max-w-[620px] mx-auto mb-9 text-center relative">
            <span className="font-display font-extrabold text-[5rem] text-teal-accent leading-[0.8] block -mb-[15px] select-none">
              “
            </span>
            <p className="font-sans font-normal italic text-[1.1rem] text-white/85 leading-relaxed">
              Dostawa następnego dnia, bardzo dobra jakość i sensownie zapakowane. Będę korzystać i bardzo polecam.
            </p>
            <div className="text-teal-accent text-lg mt-5 mb-2 tracking-[2px]">
              ★★★★★
            </div>
            <span className="font-sans text-[0.85rem] text-white/30 block">— Zadowolony Klient</span>
          </div>

          <a 
            href="https://www.facebook.com/RybyDostawaDoDomu/reviews/?id=100064176514430&sk=reviews" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block text-center font-sans font-medium text-[0.9rem] tracking-[0.15em] uppercase text-teal-accent hover:text-teal-light"
          >
            WIĘCEJ OPINII NA FACEBOOKU <i className="fa-brands fa-facebook ml-1"></i> →
          </a>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section 
        id="kontakt" 
        ref={addToRefs} 
        className="section reveal-el bg-white border-t border-border-color py-24 px-6"
      >
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div>
            <span className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-teal-accent block mb-2">
              KONTAKT
            </span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] text-navy tracking-[-0.02em] leading-tight mb-[14px]">
              Zamów lub zapytaj.
            </h2>
            <hr className="w-14 border-t-3 border-teal-accent mb-6" />
            <p className="text-text-secondary text-base mb-8">
              Działamy w Warszawie i okolicach. Zadzwoń lub napisz przez Facebooka — odpowiemy i ustalimy szczegóły dostawy.
            </p>

            <div className="space-y-0 mb-8 border-t border-border-color">
              <div className="py-4 border-b border-border-color/80">
                <span className="font-sans font-semibold text-[0.7rem] tracking-[0.15em] uppercase text-text-muted block mb-1">
                  TELEFON
                </span>
                <a href="tel:574442660" className="font-display font-bold text-[1.45rem] text-navy hover:text-teal-accent transition-colors block">
                  574 442 660
                </a>
              </div>
              <div className="py-4 border-b border-border-color/80">
                <span className="font-sans font-semibold text-[0.7rem] tracking-[0.15em] uppercase text-text-muted block mb-1">
                  OBSZAR DOSTAW
                </span>
                <span className="font-sans text-[1rem] text-text-secondary block">
                  Warszawa i okolice
                </span>
              </div>
              <div className="py-4 border-b border-border-color/80">
                <span className="font-sans font-semibold text-[0.7rem] tracking-[0.15em] uppercase text-text-muted block mb-1">
                  FACEBOOK
                </span>
                <a 
                  href="https://www.facebook.com/RybyDostawaDoDomu/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-sans font-medium text-teal-accent hover:text-teal-light text-[1rem] flex items-center gap-1"
                >
                  Ryby Dostawa Do Domu <i className="fa-brands fa-facebook"></i> →
                </a>
              </div>
            </div>

            <a 
              href="tel:574442660" 
              className="bg-teal-accent text-white font-semibold text-base rounded-[6px] px-8 py-4 shadow-[0_6px_24px_rgba(10,140,110,0.3)] hover:bg-teal-light hover:-translate-y-0.5 transition-all w-full text-center block"
            >
              <Phone className="w-4 h-4 inline-block mr-2" /> Zadzwoń: 574 442 660
            </a>
          </div>

          {/* Right: Steps */}
          <div className="bg-page-bg border border-border-color rounded-[6px] p-9">
            <span className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-text-muted block mb-6">
              JAK ZAMÓWIĆ
            </span>
            
            <div className="space-y-6">
              <div className="flex gap-5 border-b border-border-color/60 pb-5">
                <span className="font-display font-bold text-[1.8rem] text-teal-accent min-w-[40px] leading-none">1</span>
                <div>
                  <h4 className="font-sans font-medium text-text-primary text-[1rem] leading-none mb-1">Zadzwoń</h4>
                  <p className="font-sans text-text-muted text-[0.875rem] leading-relaxed">Zadzwoń i omów zamówienie</p>
                </div>
              </div>

              <div className="flex gap-5 border-b border-border-color/60 pb-5">
                <span className="font-display font-bold text-[1.8rem] text-teal-accent min-w-[40px] leading-none">2</span>
                <div>
                  <h4 className="font-sans font-medium text-text-primary text-[1rem] leading-none mb-1">Potwierdź</h4>
                  <p className="font-sans text-text-muted text-[0.875rem] leading-relaxed">Ustalamy termin i szczegóły dostawy</p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="font-display font-bold text-[1.8rem] text-teal-accent min-w-[40px] leading-none">3</span>
                <div>
                  <h4 className="font-sans font-medium text-text-primary text-[1rem] leading-none mb-1">Odbierz</h4>
                  <p className="font-sans text-text-muted text-[0.875rem] leading-relaxed">Towar dostarczamy następnego dnia</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071D2E] border-t-2 border-teal-accent py-7 text-white px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              className="w-6 h-6 rounded-[3px] object-cover" 
              src="https://i.ibb.co/ZphJHnXd/301608594-465227248959822-4051887093912608871-n.jpg" 
              referrerPolicy="no-referrer"
              alt="Ryby Dostawa Do Domu favicon" 
            />
            <span className="font-display font-bold text-[0.95rem] tracking-tight">RYBY Dostawa Do Domu</span>
          </div>
          <div className="font-sans font-light text-xs text-white/25">
            Warszawa i okolice · 574 442 660
          </div>
          <div className="font-sans font-light text-xs text-white/20">
            © 2026
          </div>
        </div>
      </footer>

    </div>
  );
}
