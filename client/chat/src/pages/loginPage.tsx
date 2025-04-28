import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Please enter a valid name!');
      return;
    }

    localStorage.setItem('username', username);
    navigate("/chat");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the Chat App</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Enter your Name:</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-sm hover:bg-blue-600"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
