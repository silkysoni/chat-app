import express from 'express'
import { createGroupChat, renameGroup, removeFromGroup, addToGroup } from '../controllers/GroupController.js'
import { verifyToken } from '../middleware/AuthMiddleWare.js'

const router = express.Router()

router.post('/create', verifyToken, createGroupChat)
router.put('/rename', verifyToken, renameGroup)
router.put('/add-member', verifyToken, addToGroup)
router.put('/remove-member', verifyToken, removeFromGroup)

export default router