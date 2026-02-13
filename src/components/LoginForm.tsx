import { useState } from "react";

interface Props {
  onLogin: (email: string, password: string) => boolean;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({ onLogin, isLoading, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80 border border-white/40"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        LabCraft Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-violet-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-violet-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
);

}

