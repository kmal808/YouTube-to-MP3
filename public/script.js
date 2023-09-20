//$ Client side JS

//note: Get the form data, POST it, and return the conversion

//* Get the form element and add an event listener for submission
const form = document.getElementById('conversion-form')
form.addEventListener('submit', (event) => {
	event.preventDefault()

	const validation = document.getElementById('youtube-link').value

	//* Get the selected conversion type (youtube or file)
	const conversionType = document.querySelector(
		'input[name="conversion-type"]:checked'
	).value

	//* Get the input value based on the selected conversion type
	const inputElement = document.getElementById(
		conversionType === 'youtube' ? 'youtube-link' : 'file-input'
	)
	const inputValue =
		conversionType === 'youtube' ? inputElement.value : inputElement.files[0]

	//* Create a FormData object to send the data
	const formData = new FormData()
	formData.append(conversionType, inputValue)

	//* Make the POST request to the correct endpoint
	const url =
		conversionType === 'youtube' ? '/convert/youtube' : '/convert/file'
	fetch(url, {
		method: 'POST',
		body: formData,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Conversion failed')
			}
			return response.blob()
		})
		.then((blob) => {
			//* Create a download link for the converted file
			const downloadLink = document.createElement('a')
			downloadLink.href = URL.createObjectURL(blob)
			downloadLink.download = 'output.mp3'
			downloadLink.click()
		})
		.catch((error) => {
			console.error(error)
			alert('Conversion failed.')
		})
})

// document
// 	.getElementById('converterForm')
// 	.addEventListener('submit', (event) => {
// 		event.preventDefault()

// 		var youtubeLink = document.getElementById('youtubeLink').value
// 		var conversionSettings = document.getElementById('conversionSettings').value

// 		// Validate the YouTube link
// 		if (!validateYouTubeLink(youtubeLink)) {
// 			alert('Invalid YouTube link. Please enter a valid YouTube URL.')
// 			return
// 		}

// 		// Send a request to the server to convert the YouTube video
// 		var xhr = new XMLHttpRequest()
// 		xhr.open('POST', '/convert')
// 		xhr.setRequestHeader('Content-Type', 'application/json')
// 		xhr.onload = function () {
// 			if (xhr.status === 200) {
// 				var response = JSON.parse(xhr.responseText)
// 				displayConversionResult(response.message, response.downloadUrl)
// 			} else {
// 				displayConversionResult(
// 					'An error occurred during conversion. Please try again.'
// 				)
// 			}
// 		}
// 		xhr.send(
// 			JSON.stringify({
// 				youtubeLink: youtubeLink,
// 				conversionSettings: conversionSettings,
// 			})
// 		)
// 	})

function validateYouTubeLink(validation) {
	// RegEx to validate the input
	var regex =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/
	return regex.test(validation)
}

function displayConversionResult(result) {
	const resultContainer = document.getElementById('result-container')
	const resultText = document.getElementById('result-text')
	const copyButton = document.getElementById('copy-button')

	resultContainer.style.display = 'block' // Show the result container
	resultText.textContent = result // Set the result text

	// Copy button functionality
	copyButton.style.display = 'inline-block' // Show the copy button
	copyButton.addEventListener('click', () => {
		navigator.clipboard
			.writeText(result) // Copy the result to the clipboard
			.then(() => {
				alert('Result copied to clipboard!')
			})
			.catch((error) => {
				console.error('Failed to copy result:', error)
			})
	})
}
