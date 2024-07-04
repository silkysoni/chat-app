import Chat from "../models/chatModel.js"

export const createGroupChat = async (req, res) => {

    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please fill all the fields!" })
        }
        let users = JSON.parse(req.body.users)

        if (users.length < 2) {
            return res.status(400).send({ message: "Atleast two users required to form a group chat!" })
        }
        users.push(req.user.id)

        const groupChat = new Chat({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.id
        })
        await groupChat.save()
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export const renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body
        const updatedName = await Chat.findByIdAndUpdate(
            chatId, {
            chatName
        },
            {
                new: true
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (updatedName) {
            let saved = await updatedName.save()
            res.status(200).json(saved)
        }
        else {
            res.status(400).json({ message: "Group not found!" })
        }
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export const addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const added = await Chat.findByIdAndUpdate(
            chatId, {
            $push: { users: userId }

        },
            { new: true }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (added) {
            res.status(200).json(added)
        }
        else {
            res.status(400).json({ message: "Group not found!" })
        }
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export const removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const removed = await Chat.findByIdAndUpdate(
            chatId, {
            $pull: { users: userId }

        },
            { new: true }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (removed) {
            res.status(200).json(removed)
        }
        else {
            res.status(400).json({ message: "Group not found!" })
        }

    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

