import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth.js'

import { 
  uploadFile, 
  getFiles, 
  downloadFile 
} from '../controllers/fileController.js'

const router = Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', authenticate, upload.single('file'), uploadFile)
router.get('/', authenticate, getFiles)
router.get('/download/:id', authenticate, downloadFile)

export default router

