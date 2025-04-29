import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import ChatList from "../components/chatList";
import Info from "../components/info";
import MessageList from "../components/messageList";

export interface User {
  id: string;
  name: string;
}

const socket: Socket = io("https://chatapplication-3-r83n.onrender.com");

const Chat: React.FC = () => {
  const [usersList, setUsersList] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username, navigate]);
  useEffect(() => {
    if (username) {
      socket.emit("join", username);
    }
  
    socket.on("userListUpdated", (data: string[]) => {
      const uniqueUsers = Array.from(new Set(data)); 
      setUsersList(uniqueUsers); 
    });
  
    socket.on("userTyping", ({ name }: { name: string }) => {
      setTypingUsers((prev) => [...new Set([...prev, name])]);
    });
  
    socket.on("userStopTyping", ({ name }: { name: string }) => {
      setTypingUsers((prev) => prev.filter((n) => n !== name));
    });
  
    return () => {
      socket.off("userListUpdated");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [username]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="w-full md:w-1/4 p-2 md:p-4 border-b md:border-b-0 md:border-r shadow-md rounded-md md:rounded-lg">
        <ChatList usersList={usersList} typingUsers={typingUsers} />
      </div>

      <div className="w-full md:flex-1 p-2 md:p-4 overflow-auto">
        <MessageList />
      </div>

      <div className="w-full md:w-1/4 p-2 md:p-4 border-t md:border-t-0 md:border-l shadow-md rounded-md md:rounded-lg">
        <Info username={username || ""} />
      </div>
    </div>
  );
};

export default Chat;
