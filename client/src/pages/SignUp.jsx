import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        console.log(data.message);

        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-500 mt-5 ml-3 font-semibold"> {error}</p>
        )}
        <input
          type="text"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Username"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-white hover:opacity-95 rounded-lg p-3 uppercase font-bold disabled:opacity-70"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Have an account ? </p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600 font-semibold hover:text-blue-500">
            Sign in
          </span>
        </Link>
      </div>
    </div>
  );
}
