// ChatBox.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatBox({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, [userId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send_message", { senderId: userId, content: input });
      setInput("");
    }
  };

  return (
    <div className="p-4 border rounded w-80">
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-1 ${
              msg.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            <span className="px-2 py-1 bg-gray-200 rounded">
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
