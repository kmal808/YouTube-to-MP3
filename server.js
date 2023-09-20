const express = require('express')
const multer = require('multer')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

require('dotenv').config({ path: './config/.env' })

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/script.js', (req, res) => {
	res.set('Content-Type', 'text/javascript')
	res.sendFile(path.join(__dirname, 'public', 'script.js'))
})

app.get('/style.css', (req, res) => {
	res.set('Content-Type', 'text/css')
	res.sendFile(path.join(__dirname, 'public', 'style.css'))
})

// app.get('/', function (req, res) {
// 	res.setHeader(
// 		'Content-Security-Policy',
// 		"style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
// 	)
// 	res.sendFile(path.join(__dirname, 'index.html'))
// })

//$ Use multer for file uploads and downloads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage: storage })

//$ YouTube url conversion
app.post('/convert/youtube', (req, res) => {
	const youtubeLink = req.body.youtubeLink
	const conversionSettings = req.body.conversionSettings

	//* Validate the YouTube link
	if (!validateYouTubeLink(youtubeLink)) {
		res.status(400).json({
			message: 'Invalid YouTube URL',
		})
		return
	}

	//* Perform the conversion using ytdl-core library
	const stream = ytdl(youtubeLink, { filter: 'audioonly' })

	//* Set the appropriate content type based on the conversion settings
	let contentType = ''
	if (conversionSettings === 'mp3') {
		contentType = 'audio/mpeg'
	} else if (conversionSettings === 'mp4') {
		contentType = 'video/mp4'
	} else {
		res.status(400).json({ message: 'Invalid conversion settings.' })
		return
	}

	res.set(
		'Content-Disposition',
		`attachment; filename="output.${conversionSettings}"`
	)
	res.set('Content-Type', contentType)

	//* Pipe the converted file to the response
	stream.pipe(res)

	//* Get the download URL of the converted file
	const downloadUrl = `/downloads/output.${conversionSettings}`

	res.json({ message: 'Conversion Successful.', downloadUrl: downloadUrl })
})

//$ File upload conversion
app.post('/convert/file', upload.single('file'), (req, res) => {
	const file = req.file

	if (!file) {
		res.status(400).json({ message: 'No file uploaded' })
		return
	}

	const filePath = file.path

	ffmpeg(filePath)
		.format('mp3')
		.on('error', (err) => {
			console.error(err)
			res.status(500).json({ message: 'Conversion failed' })
		})
		.on('end', () => {
			res.set('Content-Disposition', 'attachement; filename=:"output.mp3"')
			res.set('Content-Type', 'audio/mpeg')

			//* Pipe the converted file to the response
			res.download(`${filePath}.mp3`, 'output.mp3', (err) => {
				if (err) {
					console.error(err)
					res.status(500).json({ message: 'Download failed' })
				}
			})
		})
		.save(`${filePath}.mp3`)
})

function validateYouTubeLink(youtubeLink) {
	//* RegEx to validate YouTube URL
	const regex =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/
	return regex.test(youtubeLink)
}

app.listen(port, () => {
	console.log(`Server listening on ${process.env.PORT}, better catch it!!`)
})
