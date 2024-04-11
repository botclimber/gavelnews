const tableContent = $("#tableContent").DataTable();


async function setTableContent() {
    await waitForAllData()

    tableContent.clear().draw();

    /*
    <th>IP</th>
                        <th>USER AGENT</th>
                        <th>USER NAME</th>
                        <th>USER EMAIL</th>
                        <th>USER IMG</th>
                        <th>USERNAME ID</th>
                        <th>TOTAL VOTES</th>
                        <th>NR CHAT MSGS</th>
                        <th>REGISTED_AT</th>
                        <th>BLOCKED</th>
                        <th></th>
    */
    allData.map((item, index) => {
        tableContent.row.add([
            item.userIdentifier.ip,
            item.userIdentifier.userAgent,
            (item.userInfo)? item.userInfo.fullName : "anonymous",
            (item.userInfo)? item.userInfo.email : "anonymous",
            (item.userInfo)? `<img src="${item.userInfo.img}" />` : "anonymous",
            JSON.stringify(item.usernameId),
            /* html */
            `<div class="flex gap-1">
            <div class="flex items-center justify-center w-12 h-12 bg-green-500 text-white text-sm number-square">${item.votes.true}</div>
            <div class="flex items-center justify-center w-12 h-12  bg-red-500 text-white text-sm number-square">${item.votes.false}</div>
            <div class="flex items-center justify-center w-12 h-12  bg-yellow-500 text-white text-sm number-square">${item.votes.unclear}</div>
            <div class="flex items-center justify-center w-12 h-12  bg-gray-500 text-white text-sm number-square">${item.votes.noopinion}</div>
        </div>`,
            item.chatMessages,
            item.createdAt,
            (item.block.status)? `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16Z" fill="#972626"></path> </g></svg>` : `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.4453 2.75 16.5018 4.42242 17.0846 6.68694C17.1879 7.08808 17.5968 7.32957 17.9979 7.22633C18.3991 7.12308 18.6405 6.7142 18.5373 6.31306C17.788 3.4019 15.1463 1.25 12 1.25C8.27208 1.25 5.25 4.27208 5.25 8V10.0546C4.13525 10.1379 3.40931 10.348 2.87868 10.8787C2 11.7574 2 13.1716 2 16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 8 22H16C18.8284 22 20.2426 22 21.1213 21.1213C22 20.2426 22 18.8284 22 16C22 13.1716 22 11.7574 21.1213 10.8787C20.2426 10 18.8284 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16Z" fill="#21732e"></path> </g></svg>`,
            /* html */
            `<div class="flex gap-2">
                            <button onclick='blockAction(${JSON.stringify(item.userIdentifier)}, ${JSON.stringify(item.userInfo) || undefined},"permanent")' type="button" class="btn btn-danger btn-sm text-white">
                              Permanent Block
                            </button>
                            <button onclick='blockAction(${JSON.stringify(item.userIdentifier)}, ${JSON.stringify(item.userInfo) || undefined},"temporary")' type="button" class="btn btn-warning btn-sm">
                              Temporary Block
                            </button>
                            <button onclick='blockAction(${JSON.stringify(item.userIdentifier)}, ${JSON.stringify(item.userInfo) || undefined},"remove")' type="button" class="btn btn-success btn-sm text-white">
                              Remove Block
                            </button>
                          </div>
            `
        ]).draw();
    })
}

async function blockAction(userIdentifier, userInfo, actionValue) {

    if (confirm("Are you sure?")) {

        const time = (actionValue === "temporary") ? prompt("Block time (input format: $value $['mins' | 'hours']) ?", undefined) : undefined

        const addTime = (time)? +time.split(" ")[0]:undefined
        const timeType = (time)? time.split(" ")[1]:undefined

        // Sample body data
        const bodyData = {
            action: actionValue,
            userIdentifier: userIdentifier,
            userInfo: userInfo,
            time: (addTime && timeType)? {timeToAdd: addTime, toAddType: timeType} : undefined
        };

        console.log(bodyData)

        try {
            const response = await fetch(`${api}/admin/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify(bodyData)
            });

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse response data as JSON
            const responseData = await response.json();
            console.log('Response:', responseData);

            window.location.reload();

            return responseData; // Return response data if needed

        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to handle it outside this function
        }
    }
}

setTableContent()