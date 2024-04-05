loadDataFromServer = async () => {
  const response = await fetch(`${api}/news/current`);
  const news = await response.json();

  console.log(news)

  allData = news.content.data;
  manipulatedData = news.content.data;
  await setContent(news.content.data)

}

async function vote(voteValue, newId) {

  // Make the PATCH request
  fetch(`${api}/new/${newId}/${voteValue}`, {
    method: 'PATCH',
  })
    .then(async response => {

      await hideButtons(newId)
      await markNewAsVoted(newId)

      const data = await response.json()

      if (response.ok) {
        allData = data.allData.data.data // ? strange ...

        await setBarsContent(data.new_data)
      } else throw Error(data.msg)

    })
    .catch(error => {
      console.error('Error during PATCH request:', error);
      showErrorMessage(error)
    });
}

async function setContent(dataList) {
  // clear div content
  news_div.innerHTML = ""

  dataList.forEach(r => {

    const newType = (r.new_type === undefined) ? "" : `<svg class="h-4 w-5" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 422.186 422.186" xml:space="preserve" fill="#000000" transform="matrix(-1, 0, 0, -1, 0, 0)rotate(-45)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="XMLID_14_"> <g> <path style="fill:#A7B6C4;" d="M134.729,242.243c-1.47,0-2.85-0.58-3.89-1.62c-1.04-1.03-1.61-2.42-1.61-3.88 c0-1.47,0.57-2.86,1.61-3.89l142.05-142.06c9.82-9.81,23.05-15.42,36.38-15.42c0.14,0,0.29,0,0.44,0.01 c13.3,0.12,25.8,5.37,35.21,14.78s14.66,21.91,14.78,35.2c0.13,13.48-5.49,26.9-15.41,36.82l-218.71,218.71 c-12.88,12.87-30.02,19.97-48.29,19.97c-19.22,0-37.65-8.16-50.58-22.38c-10.67-11.74-16.94-26.93-17.63-42.76 c-0.86-19.44,6.22-37.69,19.93-51.4l237.89-237.9c16.19-16.19,37.72-25.1,60.61-25.1c22.9,0,44.42,8.91,60.61,25.1 c33.42,33.43,33.42,87.81,0,121.23l-161.24,161.24c-1.04,1.04-2.42,1.61-3.89,1.61s-2.85-0.57-3.89-1.61 c-1.04-1.04-1.61-2.42-1.61-3.89s0.57-2.85,1.61-3.89l161.24-161.24c14.12-14.11,21.89-32.88,21.89-52.83 c0-19.96-7.77-38.73-21.89-52.84c-14.11-14.11-32.87-21.88-52.83-21.88c-0.04,0-0.08,0-0.12,0 c-19.62,0.03-39.07,8.24-53.36,22.53l-237.24,237.24c-10.82,10.82-16.78,25.21-16.78,40.51s5.96,29.69,16.78,40.51 c11.16,11.17,25.83,16.75,40.5,16.75s29.35-5.58,40.51-16.75l219.34-219.34c8.65-8.65,12.76-20.64,11.26-32.89 c-0.85-7-3.6-13.64-7.95-19.2c-7.6-9.73-18.99-15.31-31.23-15.31c-10.54,0-20.46,4.11-27.92,11.57l-142.68,142.68 C137.579,241.663,136.199,242.243,134.729,242.243z"></path> <path d="M130.839,240.623c1.04,1.04,2.42,1.62,3.89,1.62s2.85-0.58,3.89-1.62l142.68-142.68c7.46-7.46,17.38-11.57,27.92-11.57 c12.24,0,23.63,5.58,31.23,15.31c4.35,5.56,7.1,12.2,7.95,19.2c1.5,12.25-2.61,24.24-11.26,32.89l-219.34,219.34 c-11.16,11.17-25.84,16.75-40.51,16.75s-29.34-5.58-40.5-16.75c-10.82-10.82-16.78-25.21-16.78-40.51s5.96-29.69,16.78-40.51 l237.24-237.24c14.29-14.29,33.74-22.5,53.36-22.53c0.04,0,0.08,0,0.12,0c19.96,0,38.72,7.77,52.83,21.88 c14.12,14.11,21.89,32.88,21.89,52.84c0,19.95-7.77,38.72-21.89,52.83l-161.24,161.24c-1.04,1.04-1.61,2.42-1.61,3.89 s0.57,2.85,1.61,3.89c1.04,1.04,2.42,1.61,3.89,1.61s2.85-0.57,3.89-1.61l161.24-161.24c33.42-33.42,33.42-87.8,0-121.23 c-16.19-16.19-37.71-25.1-60.61-25.1c-22.89,0-44.42,8.91-60.61,25.1l-237.89,237.9c-13.71,13.71-20.79,31.96-19.93,51.4 c0.69,15.83,6.96,31.02,17.63,42.76c12.93,14.22,31.36,22.38,50.58,22.38c18.27,0,35.41-7.1,48.29-19.97l218.71-218.71 c9.92-9.92,15.54-23.34,15.41-36.82c-0.12-13.29-5.37-25.79-14.78-35.2s-21.91-14.66-35.21-14.78c-0.15-0.01-0.3-0.01-0.44-0.01 c-13.33,0-26.56,5.61-36.38,15.42l-142.05,142.06c-1.04,1.03-1.61,2.42-1.61,3.89 C129.229,238.203,129.799,239.593,130.839,240.623z M394.489,40.063c36.93,36.93,36.93,97.02,0,133.95l-161.25,161.24 c-2.73,2.74-6.38,4.25-10.25,4.25c-3.87,0-7.51-1.51-10.25-4.25c-2.74-2.73-4.25-6.38-4.25-10.25s1.51-7.51,4.25-10.25 l161.24-161.24c12.41-12.42,19.25-28.92,19.25-46.47c0-17.56-6.84-34.06-19.25-46.47c-12.41-12.42-28.91-19.25-46.47-19.25 c-0.03,0-0.07,0-0.11,0c-17.25,0.02-34.39,7.28-47.01,19.9l-237.24,237.24c-9.12,9.12-14.14,21.24-14.14,34.14 s5.02,25.03,14.14,34.15c18.83,18.82,49.46,18.82,68.29,0l219.34-219.34c6.68-6.68,9.84-15.95,8.69-25.44 c-0.66-5.38-2.77-10.47-6.11-14.74c-5.89-7.54-14.69-11.86-24.14-11.86c-8.14,0-15.79,3.17-21.55,8.93l-142.69,142.69 c-5.65,5.65-14.85,5.65-20.51,0c-5.65-5.66-5.65-14.85,0-20.51l142.06-142.05c11.62-11.62,27.44-18.19,43.26-18.05 c15.67,0.14,30.41,6.33,41.49,17.42c11.09,11.08,17.27,25.81,17.42,41.48c0.15,15.87-6.43,31.64-18.05,43.27l-218.71,218.7 c-14.57,14.58-33.98,22.61-54.65,22.61c-21.75,0-42.61-9.23-57.24-25.33c-12.08-13.29-19.17-30.49-19.97-48.41 c-0.97-21.99,7.05-42.65,22.56-58.17l237.9-237.89c17.89-17.89,41.67-27.74,66.97-27.74 C352.809,12.323,376.599,22.173,394.489,40.063z"></path> </g> </g> </g> </g></svg>${r.new_type}`

    const percentages = transformToPercentages(r.new_isTrue, r.new_isFalse, r.new_noOpinion, r.new_isUnclear)

    const isTruePerc = percentages.isTruePerc
    const isFalsePerc = percentages.isFalsePerc
    const noOpinionPerc = percentages.noOpinionPerc
    const isUnclearPerc = percentages.isUnclearPerc

    const isVoted = (checkVote(r.new_id)) ? "hidden" : ""

    news_div.innerHTML += /* html */
      `<div id="${r.new_id}" class="mb-6 lg:mb-0">
                <div>
                  <div class="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20"
                    data-te-ripple-init data-te-ripple-color="light">
                    <img src="${r.new_img}" class="w-full" alt="" />
                    <a href="${r.new_link}" onmouseover="setNewForChat('${r.new_id}')" onmouseout="setNewForChat(null)" target="_blank">
                      <div
                        class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,.15)]">
                      </div>
                    </a>
                  </div>
        
                  <!-- Colored bar based on user votes -->
                  <div class="flex justify-center mb-2" id="bar-${r.new_id}">
                    <div class="w-full h-4 bg-green-500 rounded-l-full relative" style="width: ${isTruePerc}%;">
                      <span class="tooltip-text">${isTruePerc}% (${r.new_isTrue})</span>
                    </div>
                    <div class="w-full h-4 bg-gray-500 relative" style="width: ${noOpinionPerc}%;">
                      <span class="tooltip-text">${noOpinionPerc}% (${r.new_noOpinion})</span>
                    </div>
                    <div class="w-full h-4 bg-orange-500 relative" style="width: ${isUnclearPerc}%;">
                      <span class="tooltip-text">${isUnclearPerc}% (${r.new_isUnclear})</span>
                    </div>
                    <div class="w-full h-4 bg-red-500 rounded-r-full relative" style="width: ${isFalsePerc}%;">
                      <span class="tooltip-text">${isFalsePerc}% (${r.new_isFalse})</span>
                    </div>
                </div>
        
                <!-- Buttons for user feedback -->
                <div class=" ${isVoted} flex justify-between mb-5" id = "toVoteButtons-${r.new_id}">
                    <button onclick="vote('new_isTrue','${r.new_id}')" class="text-sm px-2 py-1 rounded-md bg-green-500 text-white font-bold mr-1">True</button>
                    <button onclick="vote('new_noOpinion','${r.new_id}')" class="text-sm px-2 py-1 rounded-md bg-gray-500 text-white font-bold mr-1">No Opinion</button>
                    <button onclick="vote('new_isUnclear','${r.new_id}')" class="text-sm px-2 py-1 rounded-md bg-orange-500 text-white font-bold mr-1">Unclear</button>
                    <button onclick="vote('new_isFalse','${r.new_id}')" class="text-sm px-2 py-1 rounded-md bg-red-500 text-white font-bold">False</button>
                </div>
        
                  <h5 class="mb-3 text-lg font-bold"><a href="${r.new_link}" target="_blank">${r.new_title}</a></h5>
                  <div class="mb-3 flex items-center justify-center text-sm font-medium text-yellow-600">
                    ${newType}
                  </div>
                  <p class="mb-4 dark:text-neutral-300">
                    ${r.new_desc}
                  </p>
                  <button title="Copy link to current chat" onclick="insertNewInInput('${r.new_id}')" class="bg-[#983e16] hover:bg-[#b97a5f] text-[8pt] text-white font-bold py-1 px-2 rounded inline-flex items-center">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path opacity="0.5" d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                  </button>
                  <button title="Copy chat link to current chat" onclick="insertRoomInInput('${r.new_id}')" class="bg-[#983e16] hover:bg-[#b97a5f] text-[8pt] text-white font-bold py-1 px-2 rounded inline-flex items-center">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier" > <path  fill="#fff" d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM1.25 10.5C1.25 10.9142 1.58579 11.25 2 11.25C2.41421 11.25 2.75 10.9142 2.75 10.5H1.25ZM3.07351 15.6264C2.915 15.2437 2.47627 15.062 2.09359 15.2205C1.71091 15.379 1.52918 15.8177 1.68769 16.2004L3.07351 15.6264ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z"></path> <path d="M15.5 7.83008L15.6716 8.00165C17.0049 9.33498 17.6716 10.0017 17.6716 10.8301C17.6716 11.6585 17.0049 12.3252 15.6716 13.6585L15.5 13.8301" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13.2939 6L11.9998 10.8296L10.7058 15.6593" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8.49994 7.83008L8.32837 8.00165C6.99504 9.33498 6.32837 10.0017 6.32837 10.8301C6.32837 11.6585 6.99504 12.3252 8.32837 13.6585L8.49994 13.8301" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                  </button>
                  <button title="Open this new chat" onclick="changeConnection('/${r.new_id}', false, '${r.new_title}')" class="bg-[#983e16] hover:bg-[#b97a5f] text-[8pt] text-white font-bold py-1 px-2 rounded inline-flex items-center">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="chatIcon-${r.new_id}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM1.25 10.5C1.25 10.9142 1.58579 11.25 2 11.25C2.41421 11.25 2.75 10.9142 2.75 10.5H1.25ZM3.07351 15.6264C2.915 15.2437 2.47627 15.062 2.09359 15.2205C1.71091 15.379 1.52918 15.8177 1.68769 16.2004L3.07351 15.6264ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z" fill="#ffffff"></path> </g></svg>
                  </button>
                  <p class="mt-4 text-neutral-500 dark:text-neutral-500">
                    <small>Published at ${r.new_date} by
                      <u>${r.new_source}</u></small>
                  </p>
                </div>
              </div>`
  })

}

window.addEventListener('scroll', function() {
  var menu = document.getElementById('menu');
  var scrollPosition = window.scrollY;

  // Adjust class based on scroll position
  if (scrollPosition > 50) {
      menu.classList.add('menu-scrolled');
      menu.style.position = "fixed";

  } else {
      menu.classList.remove('menu-scrolled');
      menu.style.position = "relative";
  }
});

withLoadScreen(() => loadDataFromServer())