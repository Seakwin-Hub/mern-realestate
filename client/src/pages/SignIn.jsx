import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  singInSuccess,
  clearError,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(error);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      dispatch(clearError());
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      console.log(data);
      if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        console.log(data.message);

        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(singInSuccess(data));
      navigate("/");
    } catch (error) {
      // setLoading(false);
      // console.log(error.message);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign in</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-500 mt-5 ml-3 font-semibold "> {error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-white hover:opacity-95 rounded-lg p-3 uppercase font-bold disabled:opacity-70"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-3 mt-5">
        <p>{`Don't have an account ? `}</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-600 font-semibold hover:text-blue-500">
            Sign up
          </span>
        </Link>
      </div>
    </div>
  );
}
