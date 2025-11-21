// ChatBox.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatBox({ receiverId }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Connect socket
  useEffect(() => {
    if (!receiverId) return;

    // Optional: fallback token if Render strips cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    const newSocket = io(import.meta.env.VITE_CHAT_BACKEND_URL, {
      withCredentials: true,          // 🔥 Send Fastify HttpOnly cookies
      transports: ["websocket"],      // Faster & reliable
      query: { token },               // 🔥 fallback auth if cookies fail
    });

    newSocket.on("connect", () =>
      console.log("🟢 ChatBox connected:", newSocket.id)
    );

    // Receive private messages
    newSocket.on("private_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          from: data.from,
          message: data.message,
          self: false,
        },
      ]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [receiverId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !socket || !receiverId) return;

    socket.emit("private_message", {
      to: receiverId,
      message: input,
    });

    // Show message instantly on sender UI
    setMessages((prev) => [
      ...prev,
      {
        from: "Me",
        message: input,
        self: true,
      },
    ]);

    setInput("");
  };

  return (
    <div className="p-4 border rounded w-80 bg-white shadow">
      {/* Messages */}
      <div className="h-64 overflow-y-auto border p-2 mb-3 rounded bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20">
            No messages yet...
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.self ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-1 rounded-lg ${
                msg.self
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
