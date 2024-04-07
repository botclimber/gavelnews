const chatTitle = document.getElementById('chatTitle')
const chat = document.getElementById("chat-output")
const msgInput = document.getElementById("chat-input-message")

const usernameRegex = /#(\w+)/g;

const newRegex = /\[new:(.*?)\]/g;
const newCodeRegex = /\[new:([a-zA-Z0-9-]+)\]/;

const roomRegex = /\[room:(.*?)\]/g;
const roomCodeRegex = /\[room:([a-zA-Z0-9-]+)\]/;

async function getNewFromServer(id) {

    const date = (readOnlyPage)? dateAsGlobal : "current"
    const request = await fetch(`${api}/news/${date}/getNew/${id}`)
    const response = await request.json()

    console.log(response)
    return response
}

async function replaceNewCode(message) {

    const matches = message.match(newRegex);

    if (!matches) {
        return message;
    }

    // Array to hold promises for all replacements
    const replacementPromises = matches.map(async match => {
        const code = match.match(newCodeRegex)[1]; // Extract the code from the match

        const findNew = await getNewFromServer(code);

        const replaceWith = ` <a href="#" onclick="serachByTextInTitle('${findNew.new_title}')" style="color:blue; display: flex; align-items: center;"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path opacity="0.5" d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        <span style="margin-left: 5px;">${findNew.new_title.substring(0, chatTitleLimit)}...</span></a> `;

        // Replace the match with the new content
        return replaceWith
    });

    // Wait for all replacement promises to resolve
    const replacements = await Promise.all(replacementPromises);

    // Replace each match with the corresponding replacement
    let replacedMessage = message;
    matches.forEach((match, index) => {
        replacedMessage = replacedMessage.replace(match, replacements[index]);
    });

    return replacedMessage;
}

async function replaceRoomCode(message) {
    const matches = message.match(roomRegex);

    if (!matches) {
        return message;
    }

    // Array to hold promises for all replacements
    const replacementPromises = matches.map(async match => {
        const code = match.match(roomCodeRegex)[1]; // Extract the code from the match

        const findNew = await getNewFromServer(code);

        const action = (readOnlyPage) ? `readOnlyChat('${findNew.new_id}', '${findNew.new_title}')` : `changeConnection('/${findNew.new_id}', false, '${findNew.new_title}')`

        const replaceWith = ` <a onclick="${action}" style="color:blue; display: flex; align-items: center;cursor: pointer">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 9H16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 12.5H13.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM1.25 10.5C1.25 10.9142 1.58579 11.25 2 11.25C2.41421 11.25 2.75 10.9142 2.75 10.5H1.25ZM3.07351 15.6264C2.915 15.2437 2.47627 15.062 2.09359 15.2205C1.71091 15.379 1.52918 15.8177 1.68769 16.2004L3.07351 15.6264ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z" fill="#1C274C"></path> </g></svg>
        <span style="margin-left: 5px;">${findNew.new_title.substring(0, chatTitleLimit)}...</span>
    </a> `;

        // Replace the match with the new content
        return replaceWith
    });

    // Wait for all replacement promises to resolve
    const replacements = await Promise.all(replacementPromises);

    // Replace each match with the corresponding replacement
    let replacedMessage = message;
    matches.forEach((match, index) => {
        replacedMessage = replacedMessage.replace(match, replacements[index]);
    });

    return replacedMessage;
}

function setChatTitle(chatCode = "/", general = true, title = "", goBackBtn = true) {

    const backBtn = (goBackBtn) ? `<button onclick="changeConnection()" class="bg-[#983e16] hover:bg-[#b97a5f] text-[8pt] text-white font-bold p-1 mr-1 rounded inline-flex items-center">
    Go back
</button>` : ""

    if (general)
        chatTitle.innerHTML = '<h2 class="font-semibold text-lg tracking-tight">Gavel News Court</h2>';

    else
        chatTitle.innerHTML = `
        <div class="flex items-center">
            ${backBtn}
            <h2 class="font-semibold text-lg tracking-tight"><a href="#" onclick="serachByTextInTitle('${title}')">${title.substring(0, chatTitleLimit)}...</a></h2>
        </div>
        `
}

async function printToChat(data) {
    try {
        const messageReplaceNewCodes = await replaceNewCode(data.message);
        const messageReplaceRoomCodes = await replaceRoomCode(messageReplaceNewCodes);

        const userIdToCompare = userId.replace(usernameRegex, "").trim()

        if (data.user === userIdToCompare) {
            chat.innerHTML += `<div class="flex gap-3 my-4 text-gray-600 text-sm flex-1 justify-end">
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
        </div>`;
        } else {
            chat.innerHTML += `<div class="flex gap-3 my-4 text-gray-600 text-sm flex-1"><span
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
    </div>`;
        }

        const isAtBottom = isScrolledToBottom(chat);
        if (isAtBottom) scrollToBottom(chat);
        msgInput.value = "";
    } catch (error) {
        console.error("Error in printToChat:", error);
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