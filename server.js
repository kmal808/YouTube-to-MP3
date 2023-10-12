const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const app = express()

require('dotenv').config({ path: './config/.env' })

const port = process.env.PORT

app.use(cors())
app.use(
	'/',
	express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
)

app.get('/downloadmp3', async (req, res, next) => {
	try {
		var url = req.query.url
		if (!ytdl.validateURL(url)) {
			return res.sendStatus(400)
		}
		let title = 'audio'

		await ytdl.getBasicInfo(url, { format: 'mp4' }, (err, info) => {
			if (err) throw err
			title = info.player_response.videoDetails.title.replace(
				/[^a-zA-Z0-9]/g,
				''
			)
		})

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`)

		const audio = ytdl(url, { quality: 'highestaudio' })

		ffmpeg()
			.input(audio)
			.audioCodec('libmp3lame')
			.toFormat('mp3')
			.on('end', () => {
				console.log('Conversion finished.')
			})
			.on('error', (err) => {
				console.error(err)
				res.sendStatus(500)
			})
			.pipe(res, { end: true })
	} catch (err) {
		console.error(err)
		res.sendStatus(500)
	}
})

app.listen(port, () => {
	console.log(`Server is running 🏃 on PORT: ${port}, better catch it ⚾!!`)
})
