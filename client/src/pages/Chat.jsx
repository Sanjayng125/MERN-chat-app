import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth";
import { FaArrowLeft, FaBars, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import Conversation from "../components/Conversations/Conversation";
import ChatBox from "../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { FaMessage, FaPerson, FaXmark } from "react-icons/fa6";
import Spinner2 from "../components/Spinner2";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8800";

const Chat = () => {
  const [auth] = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [addUserMenuOn, setAddUserMenuOn] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchError, setSearchError] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAllUser, setSearchAllUser] = useState([]);
  const [searchAllUserError, setSearchAllUserError] = useState(false);

  //   sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.emit("new-user-add", auth?.user?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [auth]);

  //   receiving message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    if (auth?.user !== null) getChats();
  }, [auth?.user]);

  const getChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/${auth?.user?._id}`);
      const data = await res.json();
      setChats(data);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== auth?.user?._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const getSearchUser = async (email) => {
    try {
      setLoading(true);
      setSearchError(null);
      const res = await fetch(`/api/user/get-user-email/${email}`);
      const data = await res.json();
      // console.log(data);
      if (data?.success) {
        setSearchUser(data?.user[0]);
        setLoading(false);
        setSearchError(null);
      } else {
        setLoading(false);
        setSearchError(data?.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addConversation = async (id) => {
    let chatExists = false;
    chats.forEach((ele) => {
      // console.log(ele.members.includes(id), ele.members);
      if (ele.members.includes(id)) {
        chatExists = true;
      }
    });
    if (!chatExists) {
      try {
        setLoading(true);
        const res = await fetch(`/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderId: auth?.user?._id, receiverId: id }),
        });
        const data = await res.json();
        if (data?.success) {
          setLoading(false);
          alert(data?.message);
          setSearchUser(null);
          setSearchEmail("");
          getChats();
        } else {
          alert(data?.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Chat already exists!");
    }
  };

  const searchUsers = async (query) => {
    if (query !== "") {
      setSearchAllUserError(false);
      try {
        const res = await fetch(`/api/user/search-users/${query}`);
        const data = await res.json();
        if (data?.success) {
          setSearchAllUser(data?.users);
        } else {
          setSearchAllUserError(data?.msg);
          setSearchAllUser([]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSearchAllUser([]);
    }
  };

  return (
    <div className="w-full h-dvh flex justify-center relative">
      <div
        className="addChat w-full h-dvh absolute bg-black bg-opacity-50 z-30"
        hidden={!addUserMenuOn}
      >
        <div className="bg-white p-5 rounded-lg flex flex-col gap-3 absolute left-2/4 top-2/4 translate-x-[-50%] translate-y-[-50%]">
          <button
            className="w-min text-2xl hover:scale-90"
            onClick={(e) => {
              e.preventDefault();
              setAddUserMenuOn(!addUserMenuOn);
              setSearchEmail("");
              setSearchUser(null);
            }}
          >
            <FaXmark />
          </button>
          <h1 className="text-center font-bold">Add Chat</h1>
          <input
            type="email"
            className="border p-2 py-1 rounded-lg"
            placeholder="Email"
            required
            onChange={(e) => setSearchEmail(e.target.value)}
            value={searchEmail}
          />
          {searchError !== null && (
            <p className="text-red-600 text-sm">{searchError}</p>
          )}
          {searchUser !== null && (
            <div className="border p-2 rounded flex gap-2">
              <p>
                <span className="font-semibold">{searchUser?.fullName}</span> -{" "}
                {searchUser?.email}
              </p>
              {auth?.user?.email !== searchUser?.email && (
                <button
                  className="text-green-600 hover:opacity-90 hover:underline ml-2 disabled:opacity-80"
                  onClick={(e) => {
                    e.preventDefault();
                    addConversation(searchUser?._id);
                  }}
                >
                  Add
                </button>
              )}
            </div>
          )}
          <button
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded w-full hover:opacity-90 disabled:opacity-80"
            onClick={(e) => {
              e.preventDefault();
              getSearchUser(searchEmail);
            }}
          >
            {loading ? "Loading" : "Find"}
          </button>
        </div>
      </div>
      <div
        className={`w-full ${
          currentChat === null ? "block" : "hidden"
        } min-w-[250px] sm:min-w-[300px] md:w-[30%] bg-slate-600 md:flex md:flex-col relative`}
        style={{ borderRight: "1px solid white" }}
      >
        <div
          className="w-full border-b flex flex-col justify-center items-center p-2 text-white"
          style={{ paddingBlock: "14px" }}
        >
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              MERNChat <FaMessage />
            </h1>
            <Link to={"/profile"} className="cursor-pointer">
              <img
                src={auth?.user?.avatar}
                alt="DP"
                className="w-10 h-10 border border-slate-500 rounded-full"
              />
            </Link>
          </div>
          <div className="w-full flex flex-col relative">
            <div className="w-full flex items-center justify-between mt-3 gap-2">
              <input
                type="text"
                className="p-2 py-1 rounded-3xl outline-none flex-1 text-black"
                placeholder="Search name, email"
                onChange={(e) => {
                  searchUsers(e.target.value || "");
                }}
              />
            </div>
            {(searchAllUserError || searchAllUser?.length > 0) && (
              <div className="w-full bg-white p-2 text-black mt-2 rounded-xl absolute z-10 top-10 flex justify-between">
                <div>
                  {searchAllUserError && <p>{searchAllUserError}</p>}
                  {searchAllUser?.map((user, i) => (
                    <p key={i}>
                      <span className="font-semibold">{user?.fullName}</span> -{" "}
                      {user?.email}
                    </p>
                  ))}
                </div>
                <button
                  className="ml-1 h-min w-min flex items-center"
                  onClick={() => setSearchAllUser([])}
                >
                  <FaXmark />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="chat-list w-full p-2 flex flex-col items-center gap-2">
          <p className="text-white my-2 text-xl font-semibold mr-auto">Chats</p>
          <button
            onClick={() => setAddUserMenuOn(!addUserMenuOn)}
            className="bg-white p-2 rounded-full absolute text-slate-700 text-2xl right-2 bottom-2 hover:text-white hover:bg-slate-700"
          >
            <FaPlus />
          </button>
          {loading && <Spinner2 />}
          {!loading && (!chats || chats.length <= 0) && (
            <h1 className="text-white">No Chats Yet</h1>
          )}
          {chats &&
            chats.length > 0 &&
            chats.map((chat, i) => {
              return (
                <div
                  onClick={() => {
                    setLoading(true);
                    setCurrentChat(null);
                    setCurrentChat(chat);
                    setLoading(false);
                  }}
                  key={i}
                  className="w-full"
                >
                  <Conversation
                    data={chat}
                    currentUserId={auth?.user?._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              );
            })}
        </div>
      </div>

      <div
        className={`md:flex md:w-[70%] bg-slate-500 ${
          currentChat !== null ? "flex w-full" : "hidden"
        }`}
      >
        <button
          className={`h-fit fixed z-10 p-3 pl-0 m-2 text-white text-2xl rounded-full cursor-pointer`}
          onClick={() => setCurrentChat(null)}
          hidden={currentChat === null}
        >
          <FaArrowLeft />
        </button>
        <ChatBox
          chat={currentChat}
          currentUserId={auth?.user?._id}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
