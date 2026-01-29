import express from "express";
import {
  addBank,
  changePasswordByUserSelf,
  getLoginHistory,
  getPasswordHistoryByUserId,
  getUserBankDetails,
  getUserById,
  getWithdrawalById,
  getWithdrawalHistory,
  loginUser,
  user_logout,
  userWithdrawal,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/register", registerUser);
router.post("/user/login", loginUser);
router.get("/get/user-details", authMiddleware, getUserById);
router.get("/customer/logout", user_logout);
router.post(
  "/change/password-self/user",
  authMiddleware,
  changePasswordByUserSelf
);
router.get("/password/history", authMiddleware, getPasswordHistoryByUserId);
router.get("/get/user-login-history/:userId", authMiddleware, getLoginHistory);
router.post("/user/addbank",authMiddleware, addBank);
router.post("/user/withdraw",authMiddleware, userWithdrawal);
router.get("/user/bank-details", authMiddleware, getUserBankDetails);
router.get("/user/withdraw-history", authMiddleware, getWithdrawalHistory);
router.get("/user/withdraw-history/:id", authMiddleware, getWithdrawalById);

export default router;
