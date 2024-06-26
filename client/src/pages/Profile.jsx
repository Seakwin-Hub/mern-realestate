import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  SignOutUserFailure,
  SignOutUserStart,
  SignOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setSuccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      if (fileUploadError <= 2) {
        handleFileUpload(file);
      } else {
        setFileUploadError("error");
      }
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileUploadError(Math.round(selectedFile.size / (1024 * 1024))); // Log file size in bytes
      setFile(selectedFile);
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePerc(Math.round(progress));
      },
      (error) => {
        setfilePerc(0);
        setFileUploadError("error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
        setfilePerc(0);
        setFileUploadError("success");
      }
    );
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                        Firebase storage                                      //
  //          allow read;                                                         //
  //          allow write: if                                                     //
  //          request.resource.size < 2 * 1024 * 1024 &&                          //
  //          request.resource.contentType.matches("image/.*")                    //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(SignOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutUserFailure(data.message));
        return;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 self-center object-cover cursor-pointer mt-2 hover:opacity-80"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError === "error" ? (
            <span className="text-red-700">
              Error Image Upload (Image must be less than 2mb) !!!
            </span>
          ) : filePerc > 0 && filePerc <= 100 ? (
            <span className="text-slate-700"> {`Uploading ${filePerc}%`}</span>
          ) : fileUploadError === "success" ? (
            <span className="text-green-700">Image upload Successful</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          defaultValue={currentUser.password}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white hover:opacity-95 rounded-lg p-3 uppercase font-bold disabled:opacity-70"
        >
          {loading ? "...Loading " : "Update"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-5 ml-3 font-semibold "> {error}</p>
      )}
      {updateSuccess && (
        <p className="text-red-500 mt-5 ml-3 font-semibold ">
          User update Successful
        </p>
      )}
      <div className="flex justify-between mt-4">
        <span
          onClick={handleDeleteUser}
          className="text-red-800 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-800 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
}
