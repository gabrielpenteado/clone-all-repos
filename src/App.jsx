import { useState } from "react";
import axios from "axios";
import { FaDownload, FaFolderOpen, FaInfoCircle } from "react-icons/fa";

const App = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    if (!username) {
      setError("Please enter a GitHub username.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000",
        { user: username },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `${username}_repos.zip`);
      document.body.appendChild(a);
      a.click();

      setUsername("");
    } catch (err) {
      console.error(err);
      setError("Error downloading repositories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-blue-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 transition-all duration-300 hover:shadow-2xl relative">
        <h1 className="text-2xl font-bold text-center mb-8 text-blue-600">
          GitHub Repo Downloader
        </h1>

        <div className="absolute top-2 left-2 md:top-2 md:right-2">
          <FaInfoCircle
            className="w-5 h-5 text-blue-500 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

          {isHovered && (
            <div className="absolute transform -translate-y-8 left-0 -top-18 bg-white shadow-md rounded-lg p-3 w-72 text-[12px] md:text-sm text-gray-700 border">
              <div className="flex items-start space-x-2 mb-2">
                <span className="text-blue-500">•</span>
                <span>Works only with public repositories.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>Has a limit of 100 repositories.</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter GitHub username"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative animate-pulse">
              <FaFolderOpen className="text-6xl text-blue-500" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Cloning repositories...
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full cursor-pointer py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
            loading ? "hidden" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {!loading && (
            <div className="flex items-center gap-4">
              <FaDownload />
              <span>Download ZIP</span>
            </div>
          )}
        </button>

        {error && (
          <p className="mt-4 p-3 text-red-600 bg-red-50 rounded-lg text-center animate-shake">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
