interface InfoProps {
  username: string;
}

const Info: React.FC<InfoProps> = ({ username }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={'./avatar.png'}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-2 border-violet-300"
        />
        <div className="text-lg font-semibold">{username}</div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Welcome to the chat, {username}! Here you can talk to others in real-time.</p>
      </div>
    </div>
  );
};

export default Info;
