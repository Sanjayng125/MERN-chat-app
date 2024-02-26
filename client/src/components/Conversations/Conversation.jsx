import React, { useEffect, useState } from "react";

const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const res = await fetch(`/api/user/get-user/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  return (
    <div className="p-3 flex gap-2 rounded-lg text-white font-semibold relative hover:bg-white hover:bg-opacity-60 hover:text-black transition-all duration-150">
      {online && (
        <div className="online-dot absolute bg-green-500 w-3 h-3 rounded-full"></div>
      )}
      <img
        src={userData?.avatar}
        alt="DP"
        className="w-10 h-10 border border-slate-500 rounded-full"
      />
      <div className="flex flex-col">
        <span>
          {userData?.fullName} - {userData?.email}
        </span>
        <span>{online ? "Online" : "Offline"}</span>
      </div>
    </div>
  );
};

export default Conversation;
