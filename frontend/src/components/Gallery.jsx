import React from "react";
import ImageGallery from "react-image-gallery";
import "../styles/image-gallery.css";

import starter1 from "../assets/GalleryImages/starter1.jpg";
import starter2 from "../assets/GalleryImages/starter2.jpg";
import starter3 from "../assets/GalleryImages/starter3.jpg";
import starter4 from "../assets/GalleryImages/starter4.jpg";
import main1 from "../assets/GalleryImages/main1.jpg";
import main2 from "../assets/GalleryImages/main2.jpg";
import main3 from "../assets/GalleryImages/main3.jpg";
import main4 from "../assets/GalleryImages/main4.jpg";
import main5 from "../assets/GalleryImages/main5.jpg";
import dessert1 from "../assets/GalleryImages/dessert1.jpg";
import dessert2 from "../assets/GalleryImages/dessert2.png";
import dessert3 from "../assets/GalleryImages/dessert3.png";
import dessert4 from "../assets/GalleryImages/dessert4.png";

export default function Gallery() {
  const images = [
    { original: starter1, thumbnail: starter1 },
    { original: starter2, thumbnail: starter2 },
    { original: starter3, thumbnail: starter3 },
    { original: starter4, thumbnail: starter4 },
    { original: main1, thumbnail: main1 },
    { original: main2, thumbnail: main2 },
    { original: main3, thumbnail: main3 },
    { original: main4, thumbnail: main4 },
    { original: main5, thumbnail: main5 },
    { original: dessert1, thumbnail: dessert1 },
    { original: dessert2, thumbnail: dessert2 },
    { original: dessert3, thumbnail: dessert3 },
    { original: dessert4, thumbnail: dessert4 },
  ];

  return (
    <div className="px-4 sm:px-6 py-10">
      {/* Title */}
      <h2 className="text-white text-3xl sm:text-4xl mb-6 flex justify-center items-center climate-crisis">
        Gallery
      </h2>

      {/* Gallery container */}
      <div className="w-full max-w-5xl mx-auto">
        <ImageGallery
          items={images}
          showThumbnails={window.innerWidth > 768}
          showBullets={window.innerWidth <= 768}
          showPlayButton={false}
          showFullscreenButton={true}
        />
      </div>
    </div>
  );
}
