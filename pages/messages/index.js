// pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/MessagePage.module.css";
import { FiEdit } from "react-icons/fi";

export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const currentUserId = "66349f3125f7e6cc0fdd1b18";
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify(newMessage),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          Inbox
          <FiEdit style={{ marginLeft: "auto", cursor: "pointer" }} title="New Message" />
        </div>
        {chats.length === 0 ? (
          <p className={styles.noConversations}>No conversations yet</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`${styles.chatItem} ${
                selectedChat && selectedChat._id === chat._id ? styles.selected : ""
              }`}
            >
              <Image
                src={chat.avatar || "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"}
                width={44}
                height={44}
                className={styles.chatAvatar}
                alt="avatar"
              />
              <div className={styles.chatInfo}>
                <p className={styles.chatUsername}>{chat.username}</p>
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
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
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
