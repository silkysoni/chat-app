import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        if (!content || !chatId) {
            return res.status(400).json({ message: "Incomplete data!" });
        }

        let newMessage = {
            sender: req.user.id,
            content: content,
            chat: chatId
        }
        let savedMessage = await Message.create(newMessage)

        savedMessage = await savedMessage.populate("sender", "name pic")
        savedMessage = await savedMessage.populate("chat")
        savedMessage = await User.populate(savedMessage, {
            path: "chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: savedMessage
        })

        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const allMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId
        const messages = await Message.find({ chat: chatId }).populate("sender", "name pic email").populate("chat")
        res.status(200).json(messages)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}