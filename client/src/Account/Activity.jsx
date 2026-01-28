import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getUser,
  getLoginHistory,
  messageClear,
} from "../redux/reducer/authReducer";

const data = [
  {
    date: "2022-01-01 12:00:00",
    status: "Success",
    ip: "192.168.1.1",
    isp: "Google",
    city: "New York, NY, USA",
  },
];

const Activity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, LoginData, loading, successMessage, errorMessage } =
    useSelector((state) => state.auth);
  // console.log("LoginData", LoginData);

  useEffect(() => {
    dispatch(getLoginHistory(userInfo?._id));
  }, [dispatch, userInfo?._id]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  return (
    <div className=" mx-auto  overflow-hidden relative text-sm">
      <div className="mt-4 overflow-auto">
        <div className="bg-blue-one text-white px-4 py-2 font-semibold">
          Password change history
        </div>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Date / Time</th>
              <th className="border px-4 py-2 text-center">Login Staus</th>
              <th className="border px-4 py-2 text-center">IP Address</th>
              <th className="border px-4 py-2 text-center">ISP</th>
              <th className="border px-4 py-2 text-center">
                City/State/Country
              </th>
            </tr>
          </thead>
          <tbody>
            {LoginData.map((item, i) => (
              <tr>
                <td colSpan="" className="border px-4 py-2 text-center">
                  {item.dateTime}
                </td>
                <td colSpan="" className="border px-4 py-2 text-center">
                  {item.status}
                </td>
                <td colSpan="" className="border px-4 py-2 text-center">
                  {item.ip}
                </td>
                <td colSpan="" className="border px-4 py-2 text-center">
                  {item.isp}
                </td>
                <td colSpan="" className="border px-4 py-2 text-center">
                  {item.city}/{item.region}/{item.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity;
