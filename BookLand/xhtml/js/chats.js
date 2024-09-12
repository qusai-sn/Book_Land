document.addEventListener('DOMContentLoaded', function() {
    var userId = localStorage.getItem('userId');

    async function GetAllMessage() {
        if (!userId) {
            console.error('User ID is not found in localStorage.');
            return;
        }

        const API = `https://localhost:44301/api/Chat/showMessage/1`;
        //https://localhost:44309/api/Chat/showMessage/1

 
        try {
            const response = await fetch(API);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const messageContainer = document.getElementById("message-container");
            messageContainer.innerHTML = '';

            data.forEach(message => {
                const messageClass = message.flag === 1 ? 'message-admin' : 'message-user';
                messageContainer.innerHTML += `
                    <div class="${messageClass}">
                        <strong>${message.flag === 1 ? 'Admin' : 'User'}:</strong>
                        <p>${message.cmessages || 'No message content'}</p>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    // Call the function to load messages when the modal is shown
    $('#chatModal').on('shown.bs.modal', GetAllMessage);

    async function sendMessage() {
        const messageInput = document.getElementById('message-input').value.trim();
        if (!messageInput) {
            // alert("Please enter a message before sending.");
            Swal.fire({
                title: "Something is wrong",
                text: "Please enter a message before sending.",
                icon: "question"
              });
            return;
        }

        const API = `https://localhost:44301/api/Chat/replayMessage/${userId}`;
        
        const formData = new FormData();
        formData.append('cmessages', messageInput);
        formData.append('flag', 0); // Indicates this message is from the user

        try {
            const response = await fetch(API, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            document.getElementById('message-input').value = '';
            GetAllMessage(); // Refresh messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // Attach sendMessage function to the button click event
    document.querySelector('.modal-footer .btn-primary').addEventListener('click', sendMessage());
});