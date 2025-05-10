// pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "../../styles/MessagePage.module.css"
export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const currentUserId = "66349f3125f7e6cc0fdd1b18";
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchInbox() {
      const res = await fetch(`/api/messages/inbox/${currentUserId}`);
      const data = await res.json();
      setChats(data);
    }
    fetchInbox();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages/${currentUserId}/${selectedChat._id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedChat) return;

    await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: selectedChat._id,
        content: text,
      }),
      headers: { "Content-Type": "application/json" },
    });

    setText("");

    const res = await fetch(`/api/messages/${currentUserId}/${selectedChat._id}`);
    const data = await res.json();
    setMessages(data);
  };

  return (
    <div className="page-container">
  {/* Sidebar */}
  <div className="sidebar">
    <h2 className="sidebar-header">Inbox</h2>
    {chats.length === 0 ? (
      <p className="text-gray-500 px-5 mt-4">No conversations yet</p>
    ) : (
      chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          className={`chat-item ${selectedChat && selectedChat._id === chat._id ? "selected" : ""}`}
        >
          <Image
            src={chat.avatar || "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"}
            width={40}
            height={40}
            className="chat-avatar"
            alt="avatar"
          />
          <div className="chat-info">
            <p className="chat-username">{chat.username}</p>
            <p className="chat-last-message">{chat.lastMessage}</p>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Chat Window */}
  <div className="chat-window">
    {selectedChat ? (
      <>
        <div className="chat-header">
          <Image
            src={selectedChat.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
            width={40}
            height={40}
            className="chat-avatar"
            alt="user"
          />
          <h2>{selectedChat.username}</h2>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.senderId === currentUserId ? "me" : "other"}`}
            >
              <div className="message-bubble">{msg.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </>
    ) : (
      <div className="chat-body">
        <p style={{ textAlign: "center", color: "#999", marginTop: "30%" }}>
          Select a conversation to start chatting 💬
        </p>
      </div>
    )}
  </div>
</div>
  )}