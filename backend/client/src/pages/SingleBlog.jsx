import React from "react";
import { useParams, Link } from "react-router-dom";
import img from '../assets/download.jpeg'
import { MdArrowCircleLeft } from "react-icons/md";

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
const SingleBlog = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) return <h1>Blog not found</h1>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/tips-previews" className="text-gray-900 text-2xl"><MdArrowCircleLeft /></Link>
      <img src={blog.image} alt={blog.title} className="w-full h-60 object-cover my-4 rounded-md" />
      <h1 className="text-base font-bold">{blog.title}</h1>
      <p className="text-gray-700 text-[13px] mt-2">{blog.description}</p>
    </div>
  );
};

export default SingleBlog;
