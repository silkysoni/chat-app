import express from 'express'
import { login, register, allUser, users } from '../controllers/UserController.js'
import { verifyToken } from '../middleware/AuthMiddleWare.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get('/', verifyToken, allUser)

router.get("/all", verifyToken, users)

export default router