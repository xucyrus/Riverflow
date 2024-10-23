// Author: zhier1114
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const imageUploader = (subfolder) => {
  const uploadDirectory = path.join(__dirname, '..', '..', 'client', 'public', 'images', subfolder)

  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true })
    console.log(`Created upload directory: ${uploadDirectory}`)
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExtensions.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG and PNG are allowed.'))
    }
  }

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
  })
}

module.exports = imageUploader
