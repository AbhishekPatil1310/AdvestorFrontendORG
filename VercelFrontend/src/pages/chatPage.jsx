import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const { id: receiverId } = useParams(); // receiver id from URL
  const user = useSelector((state) => state.auth.user); // logged-in user

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ws = useRef(null);

  // Fetch receiver info
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${receiverId}`, {
          credentials: "include", // send cookie
        });
        if (!res.ok) throw new Error("Failed to fetch receiver info");
        const data = await res.json();
        setReceiver(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReceiver();
  }, [receiverId]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://localhost:8000/messages/history/${receiverId}`,
          {
            method: "GET",
            credentials: "include", // crucial for cookie
          }
        );
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [receiverId]);

  // WebSocket connection
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/chat");

    ws.current.onopen = () => console.log("WebSocket connected!");
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };
    ws.current.onerror = (err) => console.error("WebSocket error:", err);
    ws.current.onclose = () => console.log("WebSocket closed");

    return () => ws.current?.close();
  }, []);

  const handleSend = () => {
    if (!newMsg.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN)
      return;

    const msg = {
      sender_id: user._id,
      receiver_id: receiverId,
      content: newMsg,
      timestamp: Date.now(),
    };

    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]); // optimistic update
    setNewMsg("");
  };

  if (loading) return <p className="text-gray-600">Loading messages...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white font-semibold">
        Chat with {receiver?.name || "Loading..."}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              m.sender_id === user._id
                ? "bg-indigo-600 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start mr-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
