import bgImage from "../assets/LandingPageBackground.png";

export default function HomePage({ onBook }) {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-[#020202]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 w-full max-w-6xl px-6 flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
          <span className="climate-crisis text-4xl sm:text-5xl md:text-6xl">
            Fresh flavours.
          </span>
          <br />
          Unforgettable moments.
        </h1>

        {/* BUTTON */}
        <button
          onClick={onBook}
          className="mt-6 px-6 py-3 text-sm sm:text-base font-medium bg-white text-black transition-all shadow-[4px_4px_0px_#A3E635] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
        >
          Book
        </button>
      </div>
    </div>
  );
}
