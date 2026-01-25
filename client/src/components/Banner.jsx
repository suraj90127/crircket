import React from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ban1 from "../assets/banner/slider-20241230214137914-1730193512615__m8.png"
import ban2 from "../assets/banner/slider-2024123021428611-dc2.png"
import ban3 from "../assets/banner/slider-default-2024108141433208.jpg"
import ban4 from "../assets/banner/slider-default-2025221103413148.jpg"

const banner = [
    ban1, ban2, ban3, ban4
]
const Banner = () => {
      // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }
  return (
    <div>
       <div className="relative overflow-hidden">
        <Slider {...sliderSettings}>
        {banner.map((item, i) => (
          <div className="relative h-auto" key={i}>
          <img src={item} alt="banner" className="object-cover h-auto w-full" />
          </div>
        ))}
        </Slider>
      </div>
    </div>
  )
}

export default Banner
