import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { menu } from "../data/menuData";
import coverImage from "../assets/menuCover.jpg";
import menuBackCover from "../assets/menuBackCover.jpg";

export default function MenuBook() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // detect resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* ================= DESKTOP ONLY ================= */}
      {!isMobile && (
        <>
          {/* LEFT DESCRIPTION */}
          <div className="absolute left-15 top-20 z-10 max-w-[300px] text-white">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
              OUR MENU
            </p>

            <h2 className="text-4xl leading-[1.1] mb-6">
              <span className="climate-crisis">Fresh flavours</span>,
              <br />
              Crafted with passion.
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Discover a selection of carefully curated dishes inspired by
              vibrant ingredients and bold culinary creativity.
            </p>

            <span className="text-lime-400 text-sm tracking-wide">
              Explore the menu →
            </span>
          </div>

          {/* FLIPBOOK (DESKTOP ONLY) */}
          <HTMLFlipBook
            width={500}
            height={550}
            showCover={true}
            maxShadowOpacity={0.5}
            usePortrait={false}
            className="shadow-lg rounded-lg z-20"
          >
            {/* COVER */}
            <div className="h-full w-full">
              <div
                className="relative h-full w-full flex items-center justify-center text-center text-white"
                style={{
                  background: `url(${coverImage}) center / cover no-repeat`,
                }}
              >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="lime-slice-wrap mb-4">
                    <h1 className="text-4xl font-extrabold font-mono text-white">
                      ZESTY
                    </h1>
                  </div>

                  <span className="text-7xl engagement text-lime-400">
                    Menu
                  </span>

                  <p className="text-gray-300 mt-4">
                    Delicious lemon-inspired dishes
                  </p>
                </div>
              </div>
            </div>

            {/* MENU PAGES */}
            {menu.map((section, i) => (
              <div
                key={i}
                className="p-6 flex flex-col bg-white h-full overflow-hidden"
              >
                <h2 className="text-2xl font-bold mb-4 climate-crisis">
                  {section.section}
                </h2>

                {section.items.map((item, j) => (
                  <div key={j} className="mb-3">
                    <p className="text-lg text-black">{item.name}</p>
                    {item.desc && (
                      <p className="text-sm text-lime-400">{item.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* BACK COVER */}
            <div className="h-full w-full">
              <div
                className="h-full w-full"
                style={{
                  background: `url(${menuBackCover}) center / cover no-repeat`,
                }}
              ></div>
            </div>
          </HTMLFlipBook>
        </>
      )}

      {/* ================= MOBILE ONLY ================= */}
      {isMobile && (
        <div className="w-full px-4 py-10 text-white">
          {/* TITLE */}
          <h2 className="text-3xl mb-6 text-center climate-crisis">Our Menu</h2>

          {/* SIMPLE SCROLL MENU */}
          <div className="space-y-8">
            {menu.map((section, i) => (
              <div key={i}>
                <h3 className="text-2xl mb-3 climate-crisis text-lime-400">
                  {section.section}
                </h3>

                {section.items.map((item, j) => (
                  <div key={j} className="mb-4 border-b border-gray-700 pb-2">
                    <p className="text-lg">{item.name}</p>

                    {item.desc && (
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
