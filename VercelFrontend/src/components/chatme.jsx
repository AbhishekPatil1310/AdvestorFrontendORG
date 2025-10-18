import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie"; // 👈 for reading JWT token
import { getAllUsers } from "../api/adminApi";
import { useSelector } from "react-redux";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        if (user?.role === "admin") {
          setUsers(data);
        } else {
          const adminUsers = data.filter((u) => u.role === "admin");
          setUsers(adminUsers);
        }
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  // Connect socket once
  useEffect(() => {
    if (!user) return;

    const token = Cookies.get("accessToken"); // 👈 read token from cookie

    if (!token) {
      console.warn("⚠️ No access token found in cookies — socket auth will fail.");
      return;
    }

    const newSocket = io(import.meta.env.VITE_CHAT_BACKEND_URL, {
      auth: { token }, // 👈 send token here instead of relying on cookies
      transports: ["websocket"], // ✅ ensures proper connection on production
    });

    console.log("🔌 Attempting to connect to:", import.meta.env.VITE_CHAT_BACKEND_URL);

    newSocket.on("connect", () => {
      console.log("🟢 Connected to chat server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on("private_message", (data) => {
      console.log("📩 Incoming message:", data);

      setChat((prev) => [
        ...prev,
        {
          from: data.from === user?._id ? "Me" : receiver?.name || "Unknown",
          message: data.message,
        },
      ]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user, receiver]);

  // Fetch chat history when receiver changes
  useEffect(() => {
    if (!receiver || !user) return;

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_CHAT_BACKEND_URL}/api/chat/${receiver._id}`,
          { credentials: "include" } // 👈 still send cookies for REST
        );
        console.log("📡 Fetching chat history from microservice...");

        const data = await res.json();

        const formatted = data.messages.map((msg) => ({
          from: msg.from === user._id ? "Me" : receiver.name,
          message: msg.message,
        }));

        setChat(formatted);
      } catch (err) {
        console.error("❌ Error fetching chat history:", err);
        setChat([]);
      }
    };

    fetchChatHistory();
    return () => setChat([]);
  }, [receiver, user]);

  const sendMessage = () => {
    if (!receiver || !message.trim() || !socket) return;

    console.log("📤 Sending message:", { to: receiver._id, message });

    socket.emit("private_message", { to: receiver._id, message });

    setChat((prev) => [...prev, { from: "Me", message }]);
    setMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Users */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Users</h2>
        {users.map((userItem) => (
          <div
            key={userItem._id}
            onClick={() => setReceiver(userItem)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              receiver?._id === userItem._id
                ? "bg-blue-200"
                : "hover:bg-gray-200"
            }`}
          >
            {userItem.name} ({userItem.email})
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {receiver ? (
            <>
              <h2 className="font-bold text-lg mb-4">
                Chat with {receiver.name}
              </h2>
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.from === "Me" ? "text-right" : "text-left"
                  }`}
                >
                  <p>
                    <strong>{msg.from}:</strong> {msg.message}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        {/* Input box */}
        {receiver && (
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
