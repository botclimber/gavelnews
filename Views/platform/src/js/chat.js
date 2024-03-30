const chat = document.getElementById("chat-output")
const msgInput = document.getElementById("chat-input-message")
var activeNew = null

const newCodeRegex = /\[new:([a-zA-Z0-9-]+)\]/g;

// Function to replace [new:code]
function replaceNewCode(match, code) {

    const findNew = Object.values(allData).find(row => row.new_id == code)
    return `<a href="${findNew.new_link}" target="_blank" style="color:blue;">${findNew.new_title}</a>`;
}

// Establishing a WebSocket connection
const socket = new WebSocket('ws://localhost:8001/');

// Event handler for when the connection is established
socket.onopen = function (event) {
    console.log('WebSocket connection established');
};

// Event handler for receiving messages from the server
socket.onmessage = function (event) {
    console.log('Received message from server:', event.data);

    const data = JSON.parse(event.data)

    const message = data.message.replace(newCodeRegex, replaceNewCode)

    if (data.user === userId) {
        chat.innerHTML += `
        <div class="flex gap-3 my-4 text-gray-600 text-sm flex-1 justify-end">
                    <p class="leading-relaxed text-right"><span class="block font-bold text-gray-700">(${data.user}) You </span>${message}
                        <span class="block text-[8pt] text-gray-400 mt-2">${data.date}</span></p>
                    <span class="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                        <div class="rounded-full bg-gray-100 border p-1"><svg stroke="none" fill="black"
                                stroke-width="0" viewBox="0 0 16 16" height="20" width="20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                                </path>
                            </svg></div>
                    </span>
                </div>
        `

    } else {
        chat.innerHTML += `
    <div class="flex gap-3 my-4 text-gray-600 text-sm flex-1"><span
                        class="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                        <div class="rounded-full bg-gray-100 border p-1"><svg stroke="none" fill="black"
                                stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                                </path>
                            </svg></div>
                    </span>
                    <p class="leading-relaxed"><span class="block font-bold text-gray-700">${data.user} </span>${message}
                        <span class="block text-[8pt] text-gray-400 mt-2">${data.date}</span></p>
                </div>
    `
    }
    chat.scrollTop = chat.scrollHeight
    msgInput.value = ""
};

// Event handler for errors
socket.onerror = function (error) {
    console.error('WebSocket error:', error);
};

// Event handler for when the connection is closed
socket.onclose = function (event) {
    console.log('WebSocket connection closed');
};

// Sending a message to the server
function sendMessage() {
    const msg = msgInput.value
    const toJson = { "user": userId, "message": msg, "date": new Date() }

    socket.send(JSON.stringify(toJson));
}

function onInputFocus(event) {

    const emojis = {
        '#:smile': '😀',
        '#:laugh': '😂',
        '#:heartEyes': '😍'
    }

    const lookForEmoji = () => {
        // TODO: check if this is uneficcient
        Object.keys(emojis).map(key => {
            msgInput.value = msgInput.value.replaceAll(key, emojis[key])
        })
    }

    lookForEmoji()

    if (event.key == 'Enter') sendMessage();
}

function setNewForChat(newId) { activeNew = newId }

addEventListener("keydown", (event) => {
    if (event.key === "Alt" && activeNew !== null) msgInput.value += `[new:${activeNew}]`;
})