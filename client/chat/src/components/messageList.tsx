import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chatapplication-3-r83n.onrender.com");

interface Message {
  user: string;
  message: string;
}

const MessageList: React.FC = () => {
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      socket.emit("join", storedUsername);
    }

    socket.on("receiveMessage", (data: Message) => {
      console.log("Received message:", data);
      setChat((prev) => [...prev, data]);
    });

    socket.on("chatHistory", (messages: Message[]) => {
      setChat(messages);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", message);
    setMessage("");
    socket.emit('stopTyping');
  };

  let typingTimeout: NodeJS.Timeout;
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.emit('typing');

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg?.user === username ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%] break-words bg-violet-100 p-3 rounded-lg shadow-md">
              <div className="font-semibold text-violet-600 text-sm mb-1">
                {msg.user}
              </div>
              <div className="text-gray-800">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-4 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageList;
