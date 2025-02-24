import { useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // Sending the username to the backend
      const response = await axios.post(
        "http://localhost:3000",
        { user: username },
        { responseType: "blob" }
      );

      // Create a temporary link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `${username}_repos.zip`); // Name of the file to download
      document.body.appendChild(a);
      a.click();

      // Reset loading state
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error downloading repositories.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">
          GitHub Repositories Downloader
        </h1>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter GitHub username"
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-3 text-white rounded ${
            loading ? "bg-gray-500" : "bg-blue-500"
          } hover:bg-blue-600`}
        >
          {loading ? "Cloning..." : "Download Repos as ZIP"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default App;
