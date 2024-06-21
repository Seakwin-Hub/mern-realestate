import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 self-center object-cover cursor-pointer mt-2"
        />
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <input
          id="email"
          type="text"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <input
          id="password"
          type="text"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <button className="bg-slate-800 text-white hover:opacity-95 rounded-lg p-3 uppercase font-bold disabled:opacity-70">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-800 cursor-pointer">Delete account</span>
        <span className="text-red-800 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
