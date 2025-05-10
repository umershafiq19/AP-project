import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/ChatPage.module.css"; // Create this file

export default function ChatPage() {
  const router = useRouter();
  const { conversationID } = router.query;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const currentUserId = "66349f3125f7e6cc0fdd1b18";
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversationID) {
      fetch(`/api/messages/${currentUserId}/${conversationID}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [conversationID]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: conversationID,
      content: text.trim(),
      timestamp: new Date().toISOString(), // Add this line
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
    <div className={styles.chatContainer}>
      <div className={styles.topBar}>
        <button onClick={() => router.back()} className={styles.backButton}>←</button>
        <Image
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
          width={40}
          height={40}
          className={styles.avatar}
          alt="Avatar"
        />
        <h2 className={styles.chatHeading}>Chat with User</h2>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.noMessages}>No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
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
              <div className={styles.messageBubble}>{msg.content}
                <div className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputBar}>
        <input
          type="text"
          className={styles.textInput}
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              //e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
