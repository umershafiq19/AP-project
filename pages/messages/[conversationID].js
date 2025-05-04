// pages/messages/[conversationID].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ChatPage() {
  const router = useRouter();
  const { conversationID } = router.query;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const currentUserId = "66349f3125f7e6cc0fdd1b18"; // Replace with actual logged-in user ID

  useEffect(() => {
    if (conversationID) {
      fetch(`/api/messages/USER_ID/${conversationID}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [conversationID]);

  const sendMessage = async () => {
    await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: conversationID,
        content: text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setText("");
    // Refresh chat
    const res = await fetch(`/api/messages/USER_ID/${conversationID}`);
    const data = await res.json();
    setMessages(data);
  };

  return (
    <div className="p-4">
      <div className="h-[400px] overflow-y-auto border mb-2 p-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-1 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
            <span className="inline-block bg-gray-200 p-2 rounded">{msg.content}</span>
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
