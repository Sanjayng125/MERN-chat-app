import MessageModel from "../models/MessageModel.js";

export const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req?.body;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const chatId = req?.params?.chatId;
    const messages = await MessageModel.find({ chatId });
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
