import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerImages = [
  "https://i.ibb.co/7dh4CfG7/1banner-jpg.jpg",
  "https://i.ibb.co/C5p8YcPn/2-banner-jpg.jpg",
  "https://i.ibb.co/99qHNQYF/3-banner-jpg.jpg",
];

const Banner = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="relative overflow-hidden">
      <Slider {...sliderSettings}>
        {bannerImages.map((img, i) => (
          <div className="relative h-auto" key={i}>
            <img
              src={img}
              alt={`banner-${i + 1}`}
              className="object-cover h-auto w-full"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;