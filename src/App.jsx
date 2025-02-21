// src/App.js
import { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [targetDir, setTargetDir] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !targetDir) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, targetDir }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Repositórios clonados com sucesso!");
      } else {
        setMessage(data.error || "Erro desconhecido.");
      }
    } catch (error) {
      setMessage("Erro ao se comunicar com o servidor.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Clone All Your GitHub Repos
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub Username
            </label>
            <input
              type="text"
              id="user"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter GitHub username"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="targetDir"
              className="block text-sm font-medium text-gray-700"
            >
              Target Directory (Absolute Path)
            </label>
            <input
              type="text"
              id="targetDir"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              placeholder="Absolute Path E.g C:\Downloads"
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 bg-blue-500 text-white font-semibold rounded-lg ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Clonando..." : "Clone Repositories"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.includes("erro") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
