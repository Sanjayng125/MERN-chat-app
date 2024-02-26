import ChatModel from "../models/ChatModel.js";

export const createChat = async (req, res) => {
  if (!req?.body?.senderId || !req?.body?.receiverId) {
    return res
      .status(201)
      .json({ success: false, message: "Sender-Id and Reciever-Id Required!" });
  }
  try {
    const newChat = new ChatModel({
      members: [req?.body?.senderId, req?.body?.receiverId],
    });
    const result = await newChat.save();
    if (result) {
      return res.status(201).json({ success: true, message: "Chat Created!" });
    } else {
      return res.status(500).json({
        success: true,
        message: "Something went wrong while creating chat!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      members: { $in: [req?.params?.userId] },
    });
    return res.status(200).json(chats);
  } catch (error) {
    console.log(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req?.params?.firstId, req?.params?.secondId] },
    });
    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
