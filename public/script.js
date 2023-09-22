let button = document.getElementById('btn')
let input = document.querySelector('.URL-input')
let serverURL = 'http://localhost:2323'

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
	} else {
		alert('Failed to download the audio. Please try again.')
	}
}
