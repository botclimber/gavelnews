var activeNew = null
var socket = chatConnection();
var newConnection;
const emojiContainer = document.getElementById("emojiContainer")

function loadEmojis() {

    for (let x in emojis) {
        emojiContainer.innerHTML += `<button class="emoji-button" onclick="selectEmoji('${emojis[x]}')">${emojis[x]}</button>`
    }

}

// Sending a message to the server
async function sendMessage() {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} | ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

    console.log("Sending message ...")
    const msg = msgInput.value
    const toJson = {token: userGoogleCredentials.token, "icon": chatIcon, "usernameId": userInfo, "message": msg, "date": formattedDate }

    const s = await socket
    s.send(JSON.stringify(toJson));
    console.log("Message Sent.")
}

function onInputFocus(event) {

    const lookForEmoji = () => {
        // TODO: check if this is uneficcient
        Object.keys(emojis).map(key => {
            msgInput.value = msgInput.value.replaceAll(key, emojis[key])
        })
    }

    lookForEmoji()

    if (event.keyCode == 13) sendMessage(); // if user clicks Enter
}

function setNewForChat(newId) { activeNew = newId }
function validateNew(newCode = null) {
    const newCodeNotInInput = msgInput.value.includes(newCode)

    return newCode !== null && !newCodeNotInInput
}

addEventListener("keydown", (event) => {
    if (event.key === "Alt" && activeNew !== null) insertNewInInput(activeNew);
})

async function changeConnection(chatCode = "/", general = true, newTitle = "", openChat = true) {
    chat.innerHTML = ""

    currentChat.chatCode = chatCode
    currentChat.general = general
    currentChat.newTitle = newTitle

    if (socket !== null) {
        const s = await socket
        s.close()
    }

    if (openChat) chatContainer.classList.remove('hidden');

    socket = chatConnection(chatCode, general, newTitle)
}

function insertNewInInput(newCode = null) {
    if (socket == null) changeConnection();

    const fullString = `[new:${newCode}]`

    if (validateNew(fullString)) {
        chatContainer.classList.remove('hidden');
        msgInput.value += fullString;
    }
}

function insertRoomInInput(newCode = null) {
    if (socket == null) changeConnection();

    const fullString = `[room:${newCode}]`

    if (validateNew(fullString)) {
        chatContainer.classList.remove('hidden');
        msgInput.value += fullString;
    }
}

async function chatConnection(chatCode = "/", general = true, newTitle = "") {
    newConnection = true
    await waitForAllData();

    setChatTitle(`#${chatCode.replace("/", "")}`, general, `${newTitle}`)

    // Establishing a WebSocket connection
    const connection = new WebSocket(`${chatWebsocket}${chatCode}`);

    // Event handler for when the connection is established
    connection.onopen = function (event) {
        console.log('WebSocket connection established');
    };

    // Event handler for receiving messages from the server
    connection.onmessage = async function (event) {
        console.log('Received message from server');

        const data = JSON.parse(event.data)
        console.log(data)

        if (data.chatsStatus) {
            for (let x in data.chatsStatus) {
                const chatIcon = document.getElementById(`chatIcon-${x}`)

                if (chatIcon && data.chatsStatus[x] && x !== "/")
                    chatIcon.innerHTML += `<circle cx="20" cy="4" r="4" fill="#1dff00" /><text x="12" y="11" fill="white" text-anchor="middle" alignment-baseline="middle">${data.chatsStatus[x]}</text>`
            }
        } else {
            if (Array.isArray(data)) {
                for (const item of data) await printToChat(JSON.parse(item));

            } else await printToChat(data);

            const isAtBottom = isScrolledToBottom(chat);

            if (isAtBottom || newConnection){ scrollToBottom(chat); newConnection = false }
            msgInput.value = "";
        }
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

loadEmojis()