// import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Bank from "../models/addBankModel.js";
import jwt from "jsonwebtoken";
import SubAdmin from "../models/subAdminModel.js";
import passwordHistory from "../models/passwordHistory.js";
import LoginHistory from "../models/loginHistory.js";
import axios from "axios";
import betModel from "../models/betModel.js";
import UserWithdrawal from "../models/userwithdrawalModel.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveLoginHistory = async (userName, id, status, req) => {
  // console.log("dfghjk");
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "IP not found";

    // console.log("🔥 Final IP:", ip);

    // ✅ Get geo details
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { city, region, country_name: country, org: isp } = response.data;

    const now = new Date();
    const formattedDateTime = now
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    await LoginHistory.create({
      userName,
      userId: id,
      status: status === "Success" ? "Login Successful" : "Login Failed",
      dateTime: formattedDateTime,
      ip,
      isp,
      city,
      region,
      country,
    });
  } catch (error) {
    console.error("🚨 Login history error:", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("object", userName, password);

    // ✅ Check if userName and password are provided
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password." });
    }

    // ✅ Find sub-admin by userName
    const user = await SubAdmin.findOne({ userName });
    if (!user) {
      await saveLoginHistory(userName, "user not found", "Invalid UserName.", req);
      return res.status(400).json({ message: "User id and password wrong." });
    }
    if (user.status !== "active") {
      return res
        .status(400)
        .json({ message: `Your Account is ${user.status}...` });
    }

    if (user.role !== "user") {
      await saveLoginHistory(userName, user._id, "Login With Admin Id", req);
      return res
        .status(400)
        .json({ message: "This Dashboard is for User Dashboard..." });
    }

    // console.log("user`111111", user);

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await saveLoginHistory(userName, user._id, "Invalid Password.", req);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role ,user:user },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // console.log("Generated Token:", token); // ✅ Debugging: Check if token is generated

    // ✅ Set token in HTTP-only cookie
    res.cookie("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // console.log("Cookie Set:", res.getHeaders()["set-cookie"]); // ✅ Debugging: Check if cookie is set
    await saveLoginHistory(userName, user._id, "Success", req);

    // ✅ Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req; // Get ID from request

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // ✅ Find sub-admin & exclude sensitive fields
    const user = await SubAdmin.findById(id).select(
      "-password -masterPassword"
    );

    if (!user) {
      return res.status(404).json({ message: "Sub-admin not found" });
    }

    const updatedPendingBets = await betModel.find({ userId: id, status: 0 });
    user.exposure = updatedPendingBets.reduce((sum, b) => sum + b.price, 0);

    await user.save()

    res.status(200).json({
      message: "Sub-admin details retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching sub-admin:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const changePasswordByUserSelf = async (req, res) => {
  const { id } = req; // Sub-admin ID (admin making the change)
  try {
    const { oldPassword, newPassword } = req.body;
    const subAdmin = await SubAdmin.findById(id);
    if (!subAdmin) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, subAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old Password Wrong !" });
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(newPassword, salt);
    subAdmin.password = newPassword;
    await subAdmin.save();
    await passwordHistory.create({
      userName: subAdmin.userName,
      remark: "Password Changed By Self.",
      userId: id,
    });
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: subAdmin,
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getPasswordHistoryByUserId = async (req, res) => {
  const { id } = req; // Sub-admin ID (admin making the change)
  try {
    // passed in route as /credit-ref-history/:userId
    const { page = 1, limit = 10, searchQuery = "" } = req.query;
    // console.log("userId", id);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = {
      userId: id,
      // userName: { $regex: searchQuery },
    };

    const data = await passwordHistory
      .find(filter)
      .sort({ createdAt: -1 }) // optional: latest first
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await passwordHistory.countDocuments(filter);

    // console.log("total", total);
    // console.log("data", data);

    return res.status(200).json({
      message: "Password History fetched successfully",
      data,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching creditRefHistory:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};
export const getLoginHistory = async (req, res) => {
  try {
    const { userId } = req.params; // passed in route as /credit-ref-history/:userId
    // console.log("userId", userId);
    const data = await LoginHistory.find({ userId }); // optional: latest first
    // console.log("data", data);
    res.status(200).json({
      message: "Login history fetched successfully",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching login history:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const user_logout = async (req, res) => {
  res.clearCookie("auth", {
    httpOnly: true, // must match the cookie options used when setting
    secure: true, // only if you're using HTTPS
    sameSite: "None", // or 'Lax' or 'Strict', must match
    path: "/", // make sure path is same as when set
  });

  res.status(200).json({ message: "Logout success" });
};

export const addBank = async (req, res) => {

  console.log("req.body",req.body);
  
  const { id } = req;
  try {
    const { phone, bankName, accountNumber, ifscCode, accountHolderName, accountType } = req.body;

    if (!bankName || !accountNumber || !ifscCode || !accountHolderName || !accountType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await SubAdmin.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure account number is unique (model also enforces this)
    const existing = await Bank.findOne({ accountNumber });
    if (existing) {
      return res.status(400).json({ message: "Account number already exists" });
    }

    const bank = await Bank.create({
      userId: id,
      phone,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      accountType,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: bank,
    });
  } catch (error) {
    console.error("Add Bank Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserBankDetails = async (req, res) => {
  try {
    const { id } = req;
    // if (!id) return res.status(400).json({ message: "User ID is required" });

    const user = await SubAdmin.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const banks = await Bank.find({ userId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Bank details fetched successfully",
      data: banks,
    });
  } catch (error) {
    console.error("Get Bank Details Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const userWithdrawal = async (req, res) => {
  try {
    const { id } = req;
    const {amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }



    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const user = await SubAdmin.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.avbalance < amount){
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const accountDetails = await Bank.findOne({ userId: id });
    if (!accountDetails) {
      return res.status(404).json({ message: "Bank details not found" });
    }


    user.avbalance -= amount;

    const withdrawal = await UserWithdrawal.create({
      userId: id,
      amount,
      paymentMethod,
      accountnumber: accountDetails.accountNumber,
      ifsc: accountDetails.ifscCode,
      phone: accountDetails.phone,
    });

       await user.save();

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: withdrawal,
    });
  } catch (error) {
    console.error("Withdrawal Request Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    const { id } = req ;
    // const { id } = req ;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const withdrawals = await UserWithdrawal.find({ userId: id })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await UserWithdrawal.countDocuments({ userId: id });

    res.status(200).json({
      success: true,
      message: "Withdrawal history fetched successfully",
      data: withdrawals,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Get Withdrawal History Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWithdrawalById = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await UserWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    res.status(200).json({
      success: true,
      message: "Withdrawal details retrieved successfully",
      data: withdrawal,
    });
  } catch (error) {
    console.error("Get Withdrawal Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};