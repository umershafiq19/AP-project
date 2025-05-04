// pages/messages/index.js
import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const currentUserId = "66349f3125f7e6cc0fdd1b18"; // Static for now

  // Fetch all chat users (Inbox)
  useEffect(() => {
    async function fetchInbox() {
      const res = await fetch(`/api/messages/inbox/${currentUserId}`);
      const data = await res.json();
      setChats(data);
    }
    fetchInbox();
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages/${currentUserId}/${selectedChat._id}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedChat) return;

    await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: selectedChat._id,
        content: text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setText("");

    // Refresh chat
    const res = await fetch(`/api/messages/${currentUserId}/${selectedChat._id}`);
    const data = await res.json();
    setMessages(data);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar: Inbox */}
      <div className="w-1/3 border-r overflow-y-auto">
        <h2 className="text-xl font-bold p-4">Chats</h2>
        {chats.length === 0 ? (
          <p className="text-gray-500 px-4">No conversations yet</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                selectedChat && selectedChat._id === chat._id ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={chat.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{chat.username}</p>
                <p className="text-sm text-gray-600 truncate max-w-[200px]">{chat.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-4 font-semibold">
              Chat with {selectedChat.username}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.senderId === currentUserId
                      ? "ml-auto bg-blue-500 text-white text-right"
                      : "mr-auto bg-gray-200 text-black text-left"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4 flex">
              <input
                className="border rounded-full flex-1 px-4 py-2 mr-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
