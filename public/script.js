const button = document.getElementById('btn')
const input = document.querySelector('.URL-input')
const enviroment = process.env.NODE_ENV

if (enviroment === 'production') {
	serverURL = 'https://yt2mp3.wtf.kim'
	console.log('Production')
} else {
	serverURL = 'http://localhost:2323'
	console.log('Development')
}
// const serverURL = 'http://localhost:2323'

button.addEventListener('click', () => {
	if (!input.value) {
		alert('Enter a valid YouTube URL')
	} else {
		downloadmp3(input.value)
	}
})
async function downloadmp3(query) {
	const res = await fetch(`${serverURL}/downloadmp3?url=${query}`)
	if (res.status === 200) {
		const blob = await res.blob()
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.style.display = 'none'
		a.href = url
		a.download = 'output.mp3'
		document.body.appendChild(a)
		a.click()
		window.URL.revokeObjectURL(url)

		// Generate QR Code
		const qrCodeContainer = document.getElementById('qrcode')
		qrCodeContainer.innerHTML = ''
		const qrCode = new QRCode(
			qrCodeContainer,
			{
				text: `${url}`,
				width: 128,
				height: 128,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H,
			},
			(err) => {
				if (err) {
					console.error(err)
				} else {
					document.getElementById('qrcode-container').style.display = 'block'
					console.log('QR Code generated')
				}
			}
		)
	} else {
		alert('Failed to download the audio. Please try again.')
	}
}
