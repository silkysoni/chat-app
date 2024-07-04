import express from 'express'
import { verifyToken } from '../middleware/AuthMiddleWare.js'
import { sendMessage, allMessages } from '../controllers/MessageController.js'

const router = express.Router()

router.post('/', verifyToken, sendMessage)
router.get('/:chatId', verifyToken, allMessages)

export default router