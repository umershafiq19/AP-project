import { useState } from 'react';
import { useRouter } from 'next/router';

const NewChat = () => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const startChat = async () => {
    const res = await fetch('/api/messages/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, message })
    });
    const result = await res.json();
    if (res.ok) {
      router.push(`/message/${result.conversationId}`);
    } else {
      console.error(result.message || 'Failed to start chat');
    }
  };

  return (
    <div>
      <h1>Start a New Chat</h1>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="alicej"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type the first message..."
      />
      <button onClick={startChat}>Start Chat</button>
    </div>
  );
};

export default NewChat;
