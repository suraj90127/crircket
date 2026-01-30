import axios from "axios";
import AuthModel from "../models/subAdminModel.js";

/**
 * 🔴 LIVE ENVIRONMENT ONLY
 */
const apiUrl = "https://zapcore.live/api";
const launchUrl = "https://zapcore.live/api/launch-game";
const key = "7WDK1i6lsLyV1WG461bxw91bgKViYMZl";
// const key = "3aqSD5NzX8sKj2MG2CkNS6mqerzJywUW";

/* =========================
   CHECK BALANCE (AUTO CREATE USER)
========================= */
export const checkBalance = async (req, res) => {
  try {
    const playerid = req.user.phone;
    if (!playerid) {
      return res.status(400).json({
        status: false,
        message: "playerid required",
      });
    }

    const response = await axios.post(`${apiUrl}/Userbalance`, {
      playerid,
      key,
    });

    return res.json({
      status: true,
      message: "Balance fetched successfully",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Balance error",
      error: error.response?.data || error.message,
    });
  }
};

/* =========================
   TRANSFER BALANCE (ZAP → LOCAL)
========================= */
export const transferBalance = async (req, res) => {
  try {


    /* 1️⃣ Find user */
    const user = await AuthModel.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid user",
      });
    }

    const playerid = user.phone;

    /* 2️⃣ Get balance from Zapcore */

    const balRes = await axios.post(`${apiUrl}/Userbalance`, {
      playerid,
      key,
    });

    console.log("balResbalRes",balRes);
    

    const zapBalance = Number(balRes.data?.Balance || 0);
    console.log("ZAPCORE BALANCE 👉", zapBalance);

    /* 3️⃣ IF–ELSE CONDITION */
    if (!isNaN(zapBalance) && zapBalance > 0) {

      /* 4️⃣ Add balance to local wallet */
      const updatedUser = await AuthModel.findByIdAndUpdate(
        user._id,
        { $inc: { avbalance: zapBalance } },
        { new: true }
      );

      /* 5️⃣ Reset Zapcore balance */
      const resetRes = await axios.post(`${apiUrl}/Setbalance`, {
        playerid,
        key,
        opening_balance: -zapBalance,
      });

      /* 6️⃣ Rollback if reset fails */
      if (resetRes.data?.status !== true) {
        await AuthModel.updateOne(
          { _id: user._id },
          [
            {
              $set: {
                avbalance: {
                  $cond: [
                    { $gte: ["$avbalance", zapBalance] },
                    { $subtract: ["$avbalance", zapBalance] },
                    0,
                  ],
                },
              },
            },
          ]
        );

        return res.status(500).json({
          status: false,
          message: "Zap reset failed, rollback applied safely",
        });
      }

      /* ✅ SUCCESS */
      return res.status(200).json({
        status: true,
        message: "Balance transferred successfully",
        transferredAmount: zapBalance,
        currentBalance: updatedUser.avbalance,
      });
    }

    /* ❌ NO BALANCE */
    return res.status(200).json({
      status: false,
      message: "No balance to transfer",
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Transfer error",
      error: error.response?.data || error.message,
    });
  }
};

/* =========================
   LAUNCH GAME (LOCAL → ZAP)
========================= */
export const launchGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).json({
        status: false,
        message: "gameId required",
      });
    }

    const user = await AuthModel.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid user",
      });
    }

    const playerid = user.phone;

    // auto-create safety
    await axios.post(`${apiUrl}/Userbalance`, {
      playerid,
      key,
    });

    const response = await axios.post(launchUrl, {
      playerid,
      uid: gameId,
      opening_balance: user.avbalance,
      key,
    });

    // console.log("response",response);
    

    if (response.data?.status === true) {
      await AuthModel.updateOne(
        { _id: user._id },
        { $set: { avbalance: 0 } }
      );

      return res.json({
        status: true,
        message: "Game launched successfully",
        data: response.data,
      });
    }

    return res.status(500).json({
      status: false,
      message: "Game launch failed",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Launch error",
      error: error.response?.data || error.message,
    });
  }
};

/* =========================
   GAME META & LISTING
========================= */
export const getgamedetails = async (req, res) => {
  try {
    const { page = 1, size = 2000 } = req.query;
    const response = await axios.get(
      `${apiUrl}/getgamedetails?page=${page}&size=${size}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const gameProvider = async (req, res) => {
  try {
    const response = await axios.get(
      `${apiUrl}/getgamedetails?provider_list=1`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const gameType = async (req, res) => {
  try {
    const response = await axios.get(
      `${apiUrl}/getgamedetails?gametype_list=1`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const gameListByProvider = async (req, res) => {
  try {
    const { provider, page = 1, size = 20 } = req.query;
    const response = await axios.get(
      `${apiUrl}/getgamedetails?provider=${provider}&page=${page}&size=${size}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const gameListByGameType = async (req, res) => {
  try {
    const { game_type, page = 1, size = 20 } = req.query;
    const response = await axios.get(
      `${apiUrl}/getgamedetails?game_type=${game_type}&page=${page}&size=${size}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const gameListByGameTypeAndProvider = async (req, res) => {
  try {
    const { provider, game_type, page = 1, size = 20 } = req.query;
    const response = await axios.get(
      `${apiUrl}/getgamedetails?provider=${provider}&game_type=${game_type}&page=${page}&size=${size}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

/* =========================
   GAME HISTORY
========================= */
export const gameHistory = async (req, res) => {
  try {
    const { page = 1, size = 20 } = req.body;
    const playerid = user.phone;

    const response = await axios.post(`${apiUrl}/history`, {
      playerid,
      page,
      size,
      key,
    });

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};