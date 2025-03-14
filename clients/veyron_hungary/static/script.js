document.addEventListener('DOMContentLoaded', function() {
    // DOM elemek lekérése
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const imageUpload = document.getElementById('image-upload');
    const selectedFile = document.getElementById('selected-file');
    const uploadButton = document.getElementById('upload-button');
    const uploadForm = document.getElementById('upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const uploadedImages = document.getElementById('uploaded-images');
    
    // A feltöltött képek URL-jeinek tárolása
    let uploadedImageUrls = [];
    
    // Chat üzenet küldése
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Felhasználói üzenet megjelenítése
        appendMessage('user', message);
        
        // Input mező törlése
        userInput.value = '';
        
        // "Gépel..." üzenet megjelenítése
        const typingMessage = appendMessage('system', 'Gépel...');
        
        // API kérés küldése
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // "Gépel..." üzenet eltávolítása
            chatMessages.removeChild(typingMessage);
            
            // AI válasz megjelenítése
            if (data.error) {
                appendMessage('system', `Hiba: ${data.error}`);
            } else {
                appendMessage('system', data.response);
            }
            
            // Scrollozás az üzenetek aljára
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            // "Gépel..." üzenet eltávolítása
            chatMessages.removeChild(typingMessage);
            
            // Hiba megjelenítése
            appendMessage('system', `Kommunikációs hiba történt: ${error.message}`);
            console.error('Hiba:', error);
        });
    }
    
    // Üzenet hozzáadása a chat ablakhoz
    function appendMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        
        messageContent.appendChild(paragraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scrollozás az üzenetek aljára
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Kép feltöltése
    function uploadImage(file) {
        if (!file) return;
        
        // FormData létrehozása
        const formData = new FormData();
        formData.append('image', file);
        
        // Feltöltés állapotának frissítése
        uploadStatus.textContent = 'Feltöltés folyamatban...';
        uploadStatus.style.color = 'var(--secondary-color)';
        
        // Kép feltöltése
        fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Hiba megjelenítése
                uploadStatus.textContent = `Hiba: ${data.error}`;
                uploadStatus.style.color = 'var(--accent-color)';
            } else {
                // Sikeres feltöltés
                uploadStatus.textContent = 'Kép sikeresen feltöltve!';
                uploadStatus.style.color = 'var(--success-color)';
                
                // Kép megjelenítése
                const imageUrl = data.image_url;
                uploadedImageUrls.push(imageUrl);
                
                const imageContainer = document.createElement('div');
                imageContainer.className = 'uploaded-image';
                
                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = 'Feltöltött kép';
                
                const copyButton = document.createElement('button');
                copyButton.className = 'image-url-button';
                copyButton.innerHTML = '<i class="fas fa-link"></i>';
                copyButton.title = 'URL másolása';
                copyButton.onclick = function() {
                    navigator.clipboard.writeText(imageUrl)
                        .then(() => {
                            alert('Kép URL másolva a vágólapra!');
                        })
                        .catch(err => {
                            console.error('Nem sikerült másolni:', err);
                        });
                };
                
                imageContainer.appendChild(image);
                imageContainer.appendChild(copyButton);
                uploadedImages.appendChild(imageContainer);
                
                // Felhasználónak üzenet küldése a képről
                appendMessage('system', `Kép feltöltve! A következő URL-en érhető el: ${imageUrl}`);
            }
        })
        .catch(error => {
            // Hiba megjelenítése
            uploadStatus.textContent = `Feltöltési hiba: ${error.message}`;
            uploadStatus.style.color = 'var(--accent-color)';
            console.error('Hiba:', error);
        })
        .finally(() => {
            // Form visszaállítása
            uploadForm.reset();
            selectedFile.textContent = 'Nincs kiválasztott fájl';
            uploadButton.disabled = true;
        });
    }
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
    imageUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            selectedFile.textContent = this.files[0].name;
            uploadButton.disabled = false;
        } else {
            selectedFile.textContent = 'Nincs kiválasztott fájl';
            uploadButton.disabled = true;
        }
    });
    
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (imageUpload.files.length > 0) {
            uploadImage(imageUpload.files[0]);
        }
    });
    
    // Enter billentyű kezelése a textarea-ban
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Megakadályozza az új sor létrehozását
            sendMessage();
        }
    });
}); 