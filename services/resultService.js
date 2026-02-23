import axios from "axios";

export const getMatchResult = async (gameId) => {
  try {
    const res = await axios.get(
      `https://api.cricapi.com/v1/match_info?apikey=ed5e1d57-12f2-4052-9c2a-b9d3156c1727&id=${gameId}`
    );

    console.log("reee",res);
    

    if (res.data?.data?.status === "Match finished") {
      return res.data.data.matchWinner;
    }

    return null;
  } catch (e) {
    return null;
  }
};
