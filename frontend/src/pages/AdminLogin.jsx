import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          username,
          password
        }
      );

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-[0.18em]">
            BulkMail
          </h1>

          <p className="mt-3 text-sm text-zinc-500 tracking-[0.12em] uppercase">
            Admin Portal
          </p>
        </div>

        <div className="border border-zinc-800 rounded-xl p-8 bg-zinc-950">

          <div className="mb-8">
            <h2 className="text-xl font-medium tracking-wide">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block mb-2 text-xs text-zinc-400 tracking-[0.15em] uppercase">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs text-zinc-400 tracking-[0.15em] uppercase">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold tracking-[0.12em] uppercase hover:bg-[#E5C45A] active:scale-[0.98] transition"
            >
              Sign In
            </button>

          </form>

        </div>

        <p className="text-center mt-8 text-[10px] text-zinc-700 tracking-[0.3em]">
          BULKMAIL ADMIN
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;