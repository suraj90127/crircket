import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { passwordHistory } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PasswordHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordData, loading, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  console.log("passwordData", passwordData);
  useEffect(() => {
    dispatch(passwordHistory());
  }, [dispatch]);
  return (
    <div className=" mx-auto  overflow-hidden relative text-sm">
      <div className="mt-4">
        <div className="bg-blue-one text-white px-4 py-2 font-semibold">
          Password change history
        </div>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Date / Time</th>
              <th className="border px-4 py-2 text-center">Remark</th>
            </tr>
          </thead>
          <tbody>
            {passwordData?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <th className="border px-4 py-2 text-center">
                  {new Date(item.createdAt).toLocaleString("en-GB", {
                    timeZone: "Asia/Kolkata", // Adjust to your timezone if needed
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </th>
                <th className="border px-4 py-2 text-center">{item.remark}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PasswordHistory;
