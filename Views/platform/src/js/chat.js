const chat = document.getElementById("chat-output")
const msgInput = document.getElementById("chat-input-message")
var activeNew = null
var socket = null // chatConnection()

const newCodeRegex = /\[new:([a-zA-Z0-9-]+)\]/g;
const roomCodeRegex = /\[room:([a-zA-Z0-9-]+)\]/g;

// Function to replace [new:code]
function replaceNewCode(match, code) {

    const findNew = Object.values(allData).find(row => row.new_id == code)
    return ` <a href="${findNew.new_link}" target="_blank" style="color:blue; display: flex; align-items: center;">[<svg class="h-5 w-5" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>file_url [#1734]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-340.000000, -1359.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M297.9792,1199.0005 L284.0002,1199.0005 L284.0002,1208.94827 L286.0002,1208.94827 L286.0002,1200.99005 L296.0002,1200.99005 L296.0002,1206.95872 L302.0002,1206.95872 L302.0002,1208.94827 L304.0002,1208.94827 L304.0002,1205.40488 L297.9792,1199.0005 Z M295.0002,1214.02661 C295.0002,1213.4765 294.5522,1213.03184 294.0002,1213.03184 L293.0002,1213.03184 L293.0002,1215.02139 L294.0002,1215.02139 C294.5522,1215.02139 295.0002,1214.57573 295.0002,1214.02661 L295.0002,1214.02661 Z M295.7242,1216.38424 L297.0002,1218.89605 L295.0002,1218.89605 L294.0002,1216.90649 L293.0002,1216.90649 L293.0002,1218.89605 L291.0002,1218.89605 L291.0002,1210.93783 L294.0002,1210.93783 C295.6572,1210.93783 297.0002,1212.32554 297.0002,1213.97389 C297.0002,1214.98259 296.4942,1215.84407 295.7242,1216.38424 L295.7242,1216.38424 Z M300.0002,1210.93783 L298.0002,1210.93783 L298.0002,1218.89605 L304.0002,1218.89605 L304.0002,1216.90649 L300.0002,1216.90649 L300.0002,1210.93783 Z M288.0002,1210.93783 L290.0002,1210.93783 L290.0002,1216.01617 C290.0002,1217.66352 288.6572,1219.0005 287.0002,1219.0005 C285.3432,1219.0005 284.0002,1217.66352 284.0002,1216.01617 L284.0002,1210.93783 L286.0002,1210.93783 L286.0002,1216.01617 C286.0002,1216.56528 286.4482,1217.01095 287.0002,1217.01095 C287.5522,1217.01095 288.0002,1216.56528 288.0002,1216.01617 L288.0002,1210.93783 Z" id="file_url-[#1734]"> </path> </g> </g> </g> </g></svg>${findNew.new_title}]</a> `;
}

function replaceRoomCode(match, code) {

    const findNew = Object.values(allData).find(row => row.new_id == code)
    return ` <a href="#" onclick="changeConnection('/${findNew.new_id}', false, '${findNew.new_title}')" style="color:blue; display: flex; align-items: center;">[
    <svg fill="#003d52" class="h-5 w-5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h8v10c0,0.413,0.254,0.784,0.64,0.933C14.757,57.978,14.879,58,15,58 c0.276,0,0.547-0.115,0.74-0.327L25.442,47H54c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z M12,15h15c0.553,0,1,0.448,1,1 s-0.447,1-1,1H12c-0.553,0-1-0.448-1-1S11.447,15,12,15z M46,33H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34c0.553,0,1,0.448,1,1 S46.553,33,46,33z M46,25H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34c0.553,0,1,0.448,1,1S46.553,25,46,25z"></path> </g>
    </svg>
    <span style="margin-left: 5px;">${findNew.new_title.substring(0, chatTitleLimit)}...]</span>
</a>`;
}

// Functio to print to chat
function printToChat(data) {

    const messageReplaceNewCodes = data.message.replace(newCodeRegex, replaceNewCode)
    const messageReplaceRoomCodes = messageReplaceNewCodes.replace(roomCodeRegex, replaceRoomCode)

    if (data.user === userId) {
        chat.innerHTML += `
    <div class="flex gap-3 my-4 text-gray-600 text-sm flex-1 justify-end">
                <p class="leading-relaxed text-right"><span class="block font-bold text-gray-700">(${data.user}) You </span>${messageReplaceRoomCodes}
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
                <p class="leading-relaxed"><span class="block font-bold text-gray-700">${data.user} </span>${messageReplaceRoomCodes}
                    <span class="block text-[8pt] text-gray-400 mt-2">${data.date}</span></p>
            </div>
`
    }

    const isAtBottom = isScrolledToBottom(chat)
    if (isAtBottom) scrollToBottom(chat)
    msgInput.value = ""
}


async function chatConnection(chatCode = "/", general = true, newTitle = "") {
    await waitForAllData()

    const chatTitle = document.getElementById('chatTitle')

    if (general)
        chatTitle.innerHTML = '<h2 class="font-semibold text-lg tracking-tight">Gavel News Court</h2>';
    else
        chatTitle.innerHTML = `
        <button onclick="changeConnection()" class="bg-blue-500 hover:bg-blue-700 text-[8pt] text-white font-bold py-1 px-2 rounded inline-flex items-center">
                  go back
                  </button>
        <h2 class="font-semibold text-lg tracking-tight">${newTitle}</h2>
        `

    // Establishing a WebSocket connection
    const connection = new WebSocket(`${websocket}:8002${chatCode}`);

    // Event handler for when the connection is established
    connection.onopen = function (event) {
        console.log('WebSocket connection established');
    };

    // Event handler for receiving messages from the server
    connection.onmessage = function (event) {
        console.log('Received message from server');

        const data = JSON.parse(event.data)

        if (Array.isArray(data)) data.forEach(item => printToChat(JSON.parse(item)));
        else printToChat(data);

    };

    // Event handler for errors
    connection.onerror = function (error) {
        console.error('WebSocket error:', error);
    };

    // Event handler for when the connection is closed
    connection.onclose = function (event) {
        console.log('WebSocket connection closed');
    };

    return connection
}

// Sending a message to the server
async function sendMessage() {
    const msg = msgInput.value
    const toJson = { "user": userId, "message": msg, "date": new Date() }

    const s = await socket
    s.send(JSON.stringify(toJson));
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
function validateNew(newCode = null) {
    const newCodeNotInInput = msgInput.value.includes(newCode)

    return newCode !== null && !newCodeNotInInput
}
function insertNewInInput(newCode = null) {
    const fullString = `[new:${newCode}]`

    if (validateNew(fullString)) {
        chatContainer.classList.remove('hidden');
        msgInput.value += fullString;
    }
}

addEventListener("keydown", (event) => {
    if (event.key === "Alt" && activeNew !== null) insertNewInInput(activeNew);
})

async function changeConnection(chatCode = "/", general = true, newTitle = "") {
    chat.innerHTML = ""

    if (socket !== null) {
        const s = await socket
        s.close()
    }

    socket = chatConnection(chatCode, general, newTitle)

    chatContainer.classList.remove('hidden');

}

function insertRoomInInput(newCode = null) {
    const fullString = `[room:${newCode}]`

    if (validateNew(fullString)) {
        chatContainer.classList.remove('hidden');
        msgInput.value += fullString;
    }
}

function isScrolledToBottom(element) {
    // Check if the scroll position is at the bottom within a threshold
    const errorMargin = element.clientHeight / 1.5

    return (element.scrollHeight - element.scrollTop) <= element.clientHeight + errorMargin
}

function scrollToBottom(element) {
    // Scroll to the bottom of the element
    element.scrollTop = element.scrollHeight * 2;
}