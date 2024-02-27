import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import Spinner2 from "../Spinner2";

const ChatBox = ({ chat, currentUserId, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scroll = useRef();

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);

    const getUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/get-user/${userId}`);
        const data = await res.json();
        setUserData(data);
        // console.log(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(false);
      try {
        const { data } = await axios.get(`/api/message/${chat._id}`);
        // console.log(data);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };

    // send message to db
    try {
      const { data } = await axios.post(`/api/message/`, message);
      setMessages([...messages, data]);
      setNewMessage("");
      setSending(false);
    } catch (error) {
      setSending(false);
      console.log(error);
    }

    //send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  //scroll to bottom
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="w-full h-dvh">
        {!loading && chat === null && (
          <h1 className="text-xl text-center text-white">
            Select a chat to start messaging
          </h1>
        )}
        {loading && (
          <div className="w-full h-dvh flex justify-center items-center">
            <Spinner2 width={"150px"} height={"150px"} />
          </div>
        )}
        {!loading && chat !== null && (
          <div className="h-[90%] overflow-auto">
            {/* header */}
            <div className="fixed header flex flex-col w-full bg-slate-600">
              <div className="pl-10 p-3 flex items-center gap-2 rounded-lg text-white font-semibold">
                <img
                  src={userData?.avatar}
                  alt=""
                  className="w-10 h-10 border border-slate-500 rounded-full"
                />
                <div className="flex flex-col">
                  <span>
                    {userData?.fullName} - {userData?.email}
                  </span>
                </div>
              </div>
              <hr />
            </div>
            {/* messages */}
            <div className="chat-body py-16">
              {messages.length > 0 &&
                messages.map((message, i) => {
                  return (
                    <div
                      ref={scroll}
                      className={`flex flex-col p-2 max-w-[40%] font-medium my-2 ${
                        message?.senderId === currentUserId
                          ? "ml-auto rounded-s-lg text-end bg-slate-700 text-white"
                          : "bg-white rounded-e-lg text-black"
                      }`}
                      key={i}
                    >
                      <span>{message?.text}</span>
                      <span className="text-sm font-normal">
                        {format(message?.createdAt)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {/* chat sender */}
        {chat !== null && (
          <div className="w-full px-2">
            <div className="flex justify-center gap-2">
              <input
                type="text"
                className="p-3 rounded-3xl w-[80%] outline-none"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                disabled={sending}
                onClick={handleSend}
                className="p-3 py-2 rounded-3xl text-white bg-slate-700 disabled:opacity-80"
              >
                {sending ? "Sending" : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
