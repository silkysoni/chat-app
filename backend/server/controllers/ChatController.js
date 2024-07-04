
import Chat from "../models/chatModel.js"
import User from "../models/UserModel.js"

export const startChat = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            res.status(400).json({ message: "userId param not sent with request!" })
        }
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"
        })
        if (isChat.length > 0) {
            res.send(isChat[0])
        }
        else {
            let chatData = new Chat({
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.id, userId]
            })
            let savedChatData = await chatData.save()

            const fullChat = await Chat.findOne({ _id: savedChatData._id }).populate("users", "-password")

            res.status(200).json(fullChat)
        }
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export const fetchChats = async (req, res) => {
    try {

        Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(401).json({ error: error.message, success: false })
    }
}

