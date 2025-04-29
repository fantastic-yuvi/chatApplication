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
    socket.emit("stopTyping");
  };

  let typingTimeout: NodeJS.Timeout;
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.emit("typing");

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg?.user === username ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[85%] break-words bg-violet-100 p-2 md:p-3 rounded-lg shadow-md">
              <div className="font-semibold text-violet-600 text-xs md:text-sm mb-1">
                {msg.user}
              </div>
              <div className="text-gray-800 text-sm md:text-base">
                {msg.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-2 md:p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm md:text-base py-2 px-4 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageList;
