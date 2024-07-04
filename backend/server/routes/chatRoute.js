import express from 'express'
import { startChat, fetchChats } from '../controllers/ChatController.js'
import { verifyToken } from '../middleware/AuthMiddleWare.js'

const router = express.Router()

router.post('/', verifyToken, startChat)
router.get('/', verifyToken, fetchChats)


export default router