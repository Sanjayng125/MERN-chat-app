import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const Navigate = useNavigate();
  const fileRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPercentage, setPhotoPercentage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: auth?.user?.fullName,
    avatar: auth?.user?.avatar,
  });
  //   console.log(profilePhoto);

  const handleProfilePhoto = (photo) => {
    try {
      setLoading(true);
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-images/${photoname}`); //profile-images - folder name in firebase
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          //   console.log(progress);
          setPhotoPercentage(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const res = await fetch(
              `/api/user/update-profile-photo/${auth?.user?._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": " application/json",
                },
                body: JSON.stringify({ avatar: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              alert(data?.message);
              setFormData({ ...formData, avatar: downloadUrl });
              setProfilePhoto(null);
              setAuth({ ...auth, user: data?.user });
              setLoading(false);
              setPhotoPercentage(null);
              return;
            } else {
              setLoading(false);
              console.log("Something went wrong!");
            }
            setLoading(false);
            alert(data?.message);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/update-profile/${auth?.user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": " application/json",
        },
        body: JSON.stringify({ fullName: formData?.fullName }),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        setFormData({ ...formData, fullName: data?.user?.fullName });
        setAuth({ ...auth, user: data?.user });
        setLoading(false);
        return;
      } else {
        setLoading(false);
        console.log("Something went wrong!");
        return;
      }
      setLoading(false);
      alert(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("auth");
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      setLoading(false);
      Navigate("/sign-in");
      alert(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{ background: "linear-gradient(to right, purple, blue)" }}
    >
      <div className="flex flex-col justify-center items-center p-3 rounded-lg shadow-xl w-[270px] sm:w-[300px] border gap-3 bg-white bg-opacity-30 text-white">
        <h1 className="text-2xl font-bold mb-3">Profile</h1>
        <div className="relative rounded-full overflow-hidden">
          <img
            src={
              profilePhoto !== null
                ? URL.createObjectURL(profilePhoto)
                : auth?.user?.avatar
            }
            alt="Profile Img"
            className="rounded-full w-32 h-32 cursor-pointer"
            onClick={() => fileRef.current.click()}
            onMouseOver={() => {
              document.getElementById("photoLabel").classList.add("block");
            }}
            onMouseOut={() => {
              document.getElementById("photoLabel").classList.remove("block");
            }}
          />
          <p
            className="absolute bottom-0 bg-gray-500 text-white font-semibold p-2 py-1 w-full text-center bg-opacity-80"
            hidden
            id="photoLabel"
          >
            Edit
          </p>
        </div>
        {profilePhoto && (
          <button
            disabled={loading}
            className="bg-gray-600 text-white p-3 rounded hover:opacity-90 disabled:opacity-80"
            onClick={() => handleProfilePhoto(profilePhoto)}
          >
            {photoPercentage !== null
              ? `Uploading - ${photoPercentage}%`
              : "Update Profile Photo"}
          </button>
        )}
        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Name"
          className="p-3 py-2 rounded-lg border w-full bg-white bg-opacity-30 text-white"
          value={formData?.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        <input
          type="text"
          className="p-3 py-2 rounded-lg border w-full bg-white bg-opacity-30 text-white disabled:bg-gray-400"
          value={auth?.user?.email}
          disabled
        />
        <button
          disabled={auth?.user?.fullName === formData?.fullName.trim()}
          className="bg-green-600 text-white p-3 rounded w-full hover:opacity-90 disabled:opacity-80"
          onClick={handleProfileUpdate}
        >
          Update
        </button>
        <Link
          to={"/"}
          className="bg-red-600 text-white p-3 rounded w-full hover:opacity-90 text-center    "
        >
          Back
        </Link>
        <button
          disabled={loading}
          className="text-red-600 text-lg font-bold hover:underline disabled:opacity-80 flex gap-2 items-center"
          onClick={handleLogout}
        >
          Logout <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default Profile;
