// pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../../styles/MessagePage.module.css";
import { FiEdit } from "react-icons/fi";
import users from "../api/auth/me";
import User from "@/models/User";
import { useSession } from "next-auth/react";

export default function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId="66349f3125f7e6cc0fdd1b18";

 // Replace with actual logged-in user ID
  //const { data: session } = useSession();
//   const currentUserId = session?.user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch all users (excluding current user)
    const fetchUsers = async () => {
      const res = await fetch(`/api/users/all?currentUserId=${currentUserId}`);
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages/${currentUserId}/${selectedChat._id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 const sendMessage = async () => {
  if (!text.trim() || !selectedChat) return;

  const newMessage = {
    senderId: currentUserId,
    receiverId: selectedChat._id,
    content: text.trim(),
    timestamp: new Date().toISOString(),
  };

  setText(""); // Clear input immediately for better UX

  try {
    const res = await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify(newMessage),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Message not sent");

    const savedMessage = await res.json(); // message with _id
    setMessages((prev) => [...prev, savedMessage]); // push only saved message
  } catch (err) {
    console.error("Send error", err);
    // Optionally show UI alert
  }
};


  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          Inbox
          <FiEdit style={{ marginLeft: "auto", cursor: "pointer" }} title="New Message" />
        </div>
        {users.length === 0 ? (
          <p className={styles.noConversations}>No users available</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedChat(user)}
              className={`${styles.chatItem} ${
                selectedChat && selectedChat._id === user._id ? styles.selected : ""
              }`}
            >
              <Image
                src={user.avatar}
                width={44}
                height={44}
                className={styles.chatAvatar}
                alt="avatar"
              />
              <div className={styles.chatInfo}>
                <p className={styles.chatUsername}>{user.username}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <Image
                src={
                  selectedChat.avatar ||
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                }
                width={40}
                height={40}
                className={styles.chatAvatar}
                alt="user"
              />
              <h2>{selectedChat.username}</h2>
            </div>

            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.messageRow} ${
                    msg.senderId === currentUserId ? styles.sent : styles.received
                  }`}
                >
                  {msg.senderId !== currentUserId && (
                    <Image
                      src={selectedChat.avatar }
                      width={32}
                      height={32}
                      className={styles.smallAvatar}
                      alt="User"
                    />
                  )}
                  <div className={styles.messageBubble}>
                    {msg.content}
                    <div className={styles.timestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputBar}>
              <input
                type="text"
                className={styles.textInput}
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button onClick={sendMessage} className={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className={styles.messages}>
            <p className={styles.noMessages}>Select a conversation to start chatting 💬</p>
          </div>
        )}
      </div>
    </div>
  );
}