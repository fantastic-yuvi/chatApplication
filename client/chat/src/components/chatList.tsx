import { motion, AnimatePresence } from "framer-motion";


interface ChatListProps {
  usersList: string[];
  typingUsers: string[];
}

const ChatList: React.FC<ChatListProps> = ({ usersList, typingUsers }) => {
  return (
    <div>
      <div className="mt-10 shadow-md rounded-xl shadow-violet-300 h-[40px] flex justify-start pl-8 items-center text-xl">
        <h1>Messages</h1>
      </div>

      <div className="mt-4">
        <AnimatePresence>
          {usersList.map((user) => (
            <motion.div
              key={user}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="mt-4 shadow-md rounded-xl h-[80px] flex flex-col justify-center pl-8 py-2 items-start text-xl capitalize text-[#615EF0] font-semibold relative bg-violet-100"
            >
              <div>{user}</div>

              {typingUsers.includes(user) && (
                <div className="flex space-x-1 mt-1">
                  <div className="text-gray-400 text-sm flex items-center">
                    typing
                    <span className="animate-bounce-dot1 ml-1">.</span>
                    <span className="animate-bounce-dot2">.</span>
                    <span className="animate-bounce-dot3">.</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;
