import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  console.log(fileUploadError);

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

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form className="flex flex-col gap-4">
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
