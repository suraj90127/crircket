import axios from "axios";

export const getFantasyResult = async (gameName) => {
  try {

    const res = await axios.get(
      "https://cricket-api.vercel.app/cri.php?url=https://www.cricbuzz.com/live-cricket-scores/"
    );

    console.log("rrrrr",res);
    

    const data = res.data;

    // if (!data) return null;

    return {
      winner: data.winner,
      score: data.score,
      status: data.status
    };

  } catch (err) {
    console.log("ffffff",err.message);
    return null;
  }
};
