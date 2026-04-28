import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex items-center bg-white px-4 sm:px-6 md:px-20 py-16 md:py-20">
      {/* Container */}
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-16 text-black">
        {/* LEFT SIDE - ABOUT */}
        <div className="flex-1 max-w-2xl">
          <h2 className="climate-crisis text-3xl md:text-4xl mb-6 md:mb-7 text-center md:text-left">
            About Us
          </h2>

          <p className="leading-relaxed text-sm md:text-base text-black text-center md:text-left">
            Welcome to ZESTY, where bold flavours meet fresh inspiration. We
            believe great food is more than just a meal — it’s an experience.
            Every dish is crafted with fresh ingredients, vibrant flavours, and
            a passion for bringing people together around the table.
            <br />
            <br />
            From light, refreshing starters to rich, comforting mains, our menu
            is designed to surprise and delight with every bite. Whether you’re
            here for a casual lunch, a special dinner, or just good vibes with
            friends, ZESTY is your place to relax, enjoy, and savour the moment.
            <br />
            <br />
            At ZESTY, we keep things fresh, simple, and unforgettable — just
            like life should be.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 space-y-10">
          {/* CONTACT */}
          <div className="text-center md:text-left">
            <h3 className="text-lime-400 text-lg mb-4">Contact Us</h3>

            <div className="flex justify-center md:justify-start items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faPhone} />
              <span>+44 7700 900123</span>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>hello@zesty-restaurant.com</span>
            </div>

            {/* SOCIAL */}
            <div className="flex justify-center md:justify-start gap-5 mt-5 text-xl">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-400 transition"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-400 transition"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-400 transition"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </div>
          </div>

          {/* LOCATION */}
          <div className="text-center md:text-left">
            <h3 className="text-lime-400 text-lg mb-4">Where We Are</h3>

            <p>
              ZESTY Restaurant
              <br />
              42 Lemon Street
              <br />
              Soho, London
              <br />
              W1D 4UR
            </p>

            <p className="text-gray-500 text-sm mt-3">
              Open: Mon - Sun | 12:00 - 22:30
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
