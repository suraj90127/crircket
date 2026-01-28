import { useEffect } from "react";
import io from "socket.io-client";

const LiveScoreSocket = () => {
    useEffect(() => {
        const options = {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            forceNew: true,
        };

        const socket = io("https://d-score.scoreswift.xyz", options);

        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("subscribe", { type: 1, rooms: [462034047] }); // Replace room ID if needed
            console.log("data has been sent, waiting for score update");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        socket.on("connect_timeout", () => {
            console.error("Connection timeout");
        });

        socket.on("update", (data) => {
            console.log("Score update has arrived:", data);
            // TODO: update your state here if needed
        });

        return () => {
            console.log("Cleaning up socket...");
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Live Score Socket Connected</h2>
            {/* You can render score or data here if you store it in state */}
        </div>
    );
};

export default LiveScoreSocket;
