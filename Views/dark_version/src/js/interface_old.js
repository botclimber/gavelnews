loadDataFromServer = async () => {

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString);

  const date = urlParams.get("date")

  if (date != null) {
    const response = await fetch(`${api}/old/${date}`);
    const news = await response.json();

    if (response.ok) {
      allData = news.data;
      manipulatedData = news.data;
      await setContent(news.data)
    } else {

      showErrorMessage(news.msg)
    }

  } else {
    showErrorMessage("No Data found for that specific date!")

  }
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

    const getColorOverlay = () => {
      if (isTruePerc > isFalsePerc && isTruePerc > noOpinionPerc && isTruePerc > isUnclearPerc) return "bg-green-500";
      else if (isFalsePerc > isTruePerc && isFalsePerc > noOpinionPerc && isFalsePerc > isUnclearPerc) return "bg-red-500";
      else if (noOpinionPerc > isFalsePerc && noOpinionPerc > isTruePerc && noOpinionPerc > isUnclearPerc) return "bg-gray-500";
      else if (isUnclearPerc > isFalsePerc && isUnclearPerc > isTruePerc && isUnclearPerc > noOpinionPerc) return "bg-orange-500";
      else return "";
    }

    news_div.innerHTML += /* html */
      `<div class="mb-6 lg:mb-0">
                <div>
                  <div class="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20"
                    data-te-ripple-init data-te-ripple-color="light">
                    <img src="${r.new_img}" class="w-full" alt="" />
                    <div class="absolute top-0 left-0 w-full h-full ${getColorOverlay()} opacity-50"></div>
                    <a href="${r.new_link}" target="_blank">
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
        
                  <h5 class="mb-3 text-lg font-bold"><a href="${r.new_link}" target="_blank">${r.new_title}</a></h5>
                  <div class="mb-3 flex items-center justify-center text-sm font-medium text-yellow-600">
                    ${newType}
                  </div>
                  <p class="mb-4 dark:text-neutral-300">
                    ${r.new_desc}
                  </p>
                  <p class="mt-6 text-neutral-500 dark:text-neutral-500">
                    <small>Published at ${r.new_date} by
                      <u>${r.new_source}</u></small>
                  </p>
                </div>
              </div>`
  })

}

withLoadScreen(() => loadDataFromServer())