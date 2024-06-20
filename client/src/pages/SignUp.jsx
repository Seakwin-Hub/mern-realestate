import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 ">
        <input
          type="text"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Username"
          id="username"
        />
        <input
          type="email"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Email"
          id="email"
        />
        <input
          type="password"
          className="border p-3 rounded-lg focus:outline-none"
          placeholder="Password"
          id="password"
        />
        <button className="bg-slate-600 text-white hover:opacity-95 rounded-lg p-3 uppercase font-bold disabled:opacity-70">
          Sign Up
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
