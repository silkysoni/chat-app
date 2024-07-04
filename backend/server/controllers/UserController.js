import User from "../models/UserModel.js";
import generateToken from "../connection/generateToken.js";
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;
        const salt = bcrypt.genSalt();

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json("User with this email address already exist!")
        } else {
            let pass = password.toString();
            const hashedPassword = await bcrypt.hash(pass, parseInt(salt));
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                pic: pic
            })
            const savedUser = await user.save()
            res.status(200).json(savedUser)
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const registeredUser = await User.findOne({ email })

        if (!registeredUser) {
            return res.status(404).json("User doesnt exists!")
        }
        else {
            const passwordMatch = await bcrypt.compare(password, registeredUser.password);
            if (!passwordMatch) {
                return res.status(400).json("Incorrect credentials!")
            }
            else {
                let token = generateToken(registeredUser._id)
                return res.status(200).json(token)
            }
        }

    } catch (error) {
        res.status(400).json({ error: error.message, success: "false" })
    }
}
export const allUser = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        } : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user.id } })
        res.send(users)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const users = async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}