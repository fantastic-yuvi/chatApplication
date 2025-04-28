import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom"; 

export interface User {
  id: string;
  name: string;
}

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

const socket: Socket = io("https://chatapplication-3-r83n.onrender.com");

import ChatList from "../components/chatList";
import Info from "../components/info";
import MessageList from "../components/messageList";

const Chat: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
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

    socket.on("userListUpdated", (data: User[]) => {
      // Create a map to store unique users by ID
      const updatedUsers = new Map();
      
      // Add the existing users to the map
      usersList.forEach((user) => updatedUsers.set(user.id, user));
      
      // Add new users to the map, which will automatically handle duplicates
      data.forEach((user) => updatedUsers.set(user.id, user));

      // Convert the map back to an array and update the state
      setUsersList(Array.from(updatedUsers.values()));
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
  }, [username, usersList]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/4 p-4 border-2 shadow-lg rounded-lg">
        <ChatList usersList={usersList} typingUsers={typingUsers} />
      </div>

      <div className="flex-1 p-4">
        <MessageList />
      </div>

      <div className="w-1/4 p-4">
        <Info username={username || ''} />
      </div>
    </div>
  );
};

export default Chat;
