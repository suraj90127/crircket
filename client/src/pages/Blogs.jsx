import React from "react";
import { Link } from "react-router-dom";
import img from '../assets/download.jpeg'

const blogs = [
  {
    id: 1,
    title: "Indian Wells: Swiatek thrashes Muchova...",
    description: "Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise...",
    image: img,
  },
  {
    id: 2,
    title: "UEFA Champions League: Raphinha, Yamal score...",
    description: "Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise...",
    image: img,
  },
  {
    id: 3,
    title: "WPL 2025: RCB’s 11-run win denies Mumbai...",
    description: "Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise Royal Challengers Bengaluru is an eccentric franchise...",
    image: img,
  },
];

const Blogs = () => {
  return (
    <div className="mx-auto p-4">
      <h1 className=" font-bold mb-4">NEWS</h1>
      {blogs.map((blog) => (
        <Link to={`/blog/${blog.id}`} key={blog.id} className="block mb-4 bg-white">
          <div className="flex flex-col md:flex-row items-center  p-1 shadow">
            <img src={blog.image} alt={blog.title} className=" md:w-28 md:h-20 md:mr-4" />
            <div>
              <h2 className="font-bold">{blog.title}</h2>
              <p className="text-gray-600 text-sm">{blog.description.substring(0, 600)}...</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blogs;
