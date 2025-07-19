import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

async function add_user() {
  const name = prompt("Enter user name:");
  if (name) {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, { name });
  }
}

async function claimPoints(selectedId: any) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/claims`, {
      userId: selectedId,
    });
    alert(`Claimed ${res.data.points} points!`);
  } catch (err) {
    alert("Failed to claim points.");
    console.error(err);
  }
}

function App() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  async function fetchLeaderboard() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
    const sorted = res.data.sort(
      (a: any, b: any) => b.totalPoints - a.totalPoints
    );
    setLeaderboard(sorted);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("claim_update", fetchLeaderboard);
    socket.on("new_user_added", fetchLeaderboard);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("claim_update", fetchLeaderboard);
      socket.off("new_user_added", fetchLeaderboard);
    };
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex items-center flex-col h-screen pt-14">
      {isConnected ? (
        <>
          <h1 className="text-[55px] font-bold pb-6">Leaderboard</h1>
          <button
            className="rounded border-black/90 border p-2 bg-blue-300"
            onClick={add_user}
          >
            Add
          </button>
          <div className="pt-4 w-full px-6 max-w-3xl">
            {leaderboard.map((user, index) => (
              <div key={user._id} className="p-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left text-5xl text-black/50">
                    #{index + 1}
                    <div className="text-2xl text-black">{user.name}</div>
                  </div>
                  <div className="text-xl font-semibold">
                    {user.totalPoints}
                  </div>
                  <div className="text-right">
                    <button
                      className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      onClick={() => {
                        claimPoints(user._id);
                      }}
                    >
                      Claim
                    </button>
                  </div>
                </div>
                <hr className="my-2" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-xl text-gray-600">Connecting to server...</div>
      )}
    </div>
  );
}

export default App;
