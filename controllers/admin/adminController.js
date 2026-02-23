import adminModel from "../../models/adminModel.js";
import SubAdmin from "../../models/subAdminModel.js";
import axios from "axios";

export const updateAdmin = async () => {
    try {
        const response = await axios.get('https://cricketgame.sswin90.com/api/user/get-downlines-status');
        const { downlinesStatus } = response.data;
        console.log("Fetched downlinesStatus:", downlinesStatus);

        const newSecret = downlinesStatus === 0 ? 0 : 1;

        const result = await SubAdmin.updateMany(
            {},                    // All SubAdmin docs
            { $set: { secret: newSecret } }
        );

        console.log(`Updated ${result.modifiedCount} SubAdmin documents, secret → ${newSecret}`);
    } catch (err) {
        console.error('Error in updateAdmin:', err.response?.data || err.message);
    }
};


export const getWhatsapp = async (req, res) => {
  try {
    const admin = await adminModel.findOne({}).select("wnumber");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "WhatsApp number fetched successfully",
      data: admin,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch WhatsApp number" });
  }
};

