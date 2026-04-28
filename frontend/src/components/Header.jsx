import { useState } from "react";

export default function Header({ show, onBook }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ pointerEvents: "none" }}
    >
      {/* MAIN BAR */}
      <div className="grid grid-cols-3 items-center w-full max-w-6xl mx-auto px-4 py-3 bg-black border border-white rounded-full text-white pointer-events-auto">
        {/* LEFT (DESKTOP MENU) */}
        <div className="hidden md:flex gap-6 text-sm">
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1">
              <span className="block w-6 h-[2px] bg-white"></span>
              <span className="block w-6 h-[2px] bg-white"></span>
              <span className="block w-6 h-[2px] bg-white"></span>
            </div>
          </button>
        </div>

        {/* CENTER LOGO */}
        <div className="flex justify-center">
          <div className="lime-slice-wrap">
            <a href="#home">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-mono">
                ZESTY
              </h1>
            </a>
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={onBook}
            className="px-3 sm:px-5 py-1 sm:py-2 bg-lime-400 text-black rounded-full shadow-[3px_3px_0px_white] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Book
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-4 bg-black border border-white rounded-xl p-4 flex flex-col gap-4 text-white pointer-events-auto">
          <a href="#menu" onClick={() => setMenuOpen(false)}>
            Menu
          </a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </div>
      )}
    </header>
  );
}
