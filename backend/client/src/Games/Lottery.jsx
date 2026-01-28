import React from 'react'
import img from '../assets/download.jpeg'
import Banner from '../components/Banner'

const games = [
    {
      id: 1,
      title: "POINT TEEN PATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 2,
      title: "JOKER TEEN PATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 3,
      title: "MUFLIS TEEN PATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 4,
      title: "1DAY TEEN PATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 5,
      title: "DTL TEENPATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 6,
      title: "20-20 TEENPATTI",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 7,
      title: "20-20 POKER - A",
      image: img,
      bgColor: "bg-emerald-700",
    },
    {
      id: 8,
      title: "20-20 POKER - B",
      image: img,
      bgColor: "bg-emerald-700",
    },
  ]
const Lottery = () => {
  return (
    <div>
       <Banner />
       <div className=" mx-auto">
       <div className="container mx-auto p-1 md:p-4 relative">
  <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
    {games.map((game) => (
      <div key={game.id} className="relative group cursor-pointer">
        <div
          className={` rounded-lg overflow-hidden `}
        >
          <div className="md:h-48 relative flex items-center justify-center">
              <img src={game.image} alt="game" />
          </div>
          <div className=" text-center font-bold">{game.title}</div>
        </div>
      </div>
    ))}
  </div>
</div>
       </div>
    </div>
  )
}

export default Lottery
