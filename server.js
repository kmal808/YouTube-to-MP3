const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')
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

		await ytdl.getBasicInfo(
			url,
			{
				format: 'mp4',
			},
			(err, info) => {
				if (err) throw err
				title = info.player_response.videoDetails.title.replace(
					/[^\x00-\x7F]/g,
					''
				)
			}
		)

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`)
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res)
	} catch (err) {
		console.error(err)
	}
})

app.listen(port, () => {
	console.log(`Server is running 🏃 on ${port}, better catch it ⚾!!`)
})

