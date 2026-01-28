import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const Rolling = () => {

  return (
    <div className=" mx-auto  overflow-hidden relative text-sm">
      <div className="p-2 grid grid-cols-3 gap-1 items-center justify-between border overflow-hidden">
        <select className="border p-2 bg-white col-span-1 ">
          <option>Data Source</option>
        </select>
        <select className="border p-2 bg-white col-span-1 ">
          <option>Cricket</option>
        </select>
        <input type="date" className="border p-2 bg-white col-span-1 " />
        <input type="date" className="border p-2 bg-white col-span-1 " />
        <button className="bg-blue text-white px-4 py-2 col-span-1 ">Get Commission</button>
      </div>
      
      <div className="mt-4">
        <div className="bg-blue-one text-white px-4 py-2 font-semibold">Rolling Commission</div>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Type</th>
              <th className="border px-4 py-2 text-center">Total Stack</th>
              <th className="border px-4 py-2 text-center">Total Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" className="border px-4 py-2 text-center">No data!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rolling;
