// document.getElementById("sendMessage").addEventListener("click", async () => {
//     const userMessage = document.getElementById("userInput").value;
//     const chatMessages = document.getElementById("chatMessages");

//     // Display user's message in chat
//     chatMessages.innerHTML += `<p>User: ${userMessage}</p>`;

//     // Send the user's message to the AI API
//     const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer YOUR_API_KEY`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             prompt: userMessage,
//             max_tokens: 150
//         })
//     });

//     const data = await response.json();
//     const aiMessage = data.choices[0].text.trim();

//     // Display AI's response in chat
//     chatMessages.innerHTML += `<p>AI: ${aiMessage}</p>`;

//     // Clear the input field
//     document.getElementById("userInput").value = '';
// });
