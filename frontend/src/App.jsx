import { useEffect, useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MenuBook from "./components/MenuBook";
import Gallery from "./components/Gallery";
import BookingModal from "./components/BookingModal";
import AboutUs from "./components/AboutUs";

function App() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [showOnHover, setShowOnHover] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showHeader = isAtTop || showOnHover;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowOnHover(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowOnHover(false);
    }, 1000);
  };

  return (
    <>
      {/* Hover trigger */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-[60]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* HEADER */}
      <Header show={showHeader} onBook={() => setShowBooking(true)} />

      {/* HERO */}
      <section
        id="home"
        className="hero-video relative h-screen overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-[#0d0d0d] z-20"></div>
        <div className="content relative z-20">
          <HomePage onBook={() => setShowBooking(true)} />
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="relative py-20 bg-neutral-900">
        <div className="relative z-20 max-w-6xl mx-auto px-6 flex justify-center">
          <MenuBook />
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative py-20 bg-[#111]">
        <div className="pointer-events-none absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent z-10"></div>

        <div className="relative z-20 max-w-6xl mx-auto px-6">
          <Gallery />
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="min-h-screen">
        <div className="pointer-events-none absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent z-10"></div>
        <AboutUs />
      </section>

      {/* MODAL */}
      <BookingModal show={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}

export default App;
