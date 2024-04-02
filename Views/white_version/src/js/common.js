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

function waitForAllData() {
  return new Promise(resolve => {
    let interval = setInterval(() => {
      if (typeof allData !== 'undefined') {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

// Function to generate date options until a specific date
function generateDateOptions() {
  const endDate = new Date("2024-03-20")

  const yesterday = getSubtractedDate(1)
  var options = `<button class="date-option active-date flex items-center" onclick="location.href='index.html'">
  <img class="w-[15px] h-[12px] mr-2" src="./src/images/live.gif" alt="Live icon" />
  <span>${yesterday}</span>
</button>`;

  var currentDate = new Date(getSubtractedDate(2));
  while (currentDate >= endDate) {
    var formattedDate = currentDate.toISOString().slice(0, 10);

    options += `<button class="date-option" onclick="location.href='index_old.html?date=${formattedDate}'">${formattedDate}</button>`;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return options;
}

function computeAvg(rawValue, totalValue) {
  const comp = ((rawValue / totalValue) * 100).toFixed(2)

  return (comp != "NaN") ? comp : 0;
}

function transformToPercentages(isTrue, isFalse, noOpinion, isUnclear) {

  const totalVotes = (isTrue) + (isFalse) + (isUnclear) + (noOpinion)

  const isTruePerc = parseFloat(computeAvg(isTrue, totalVotes))
  const isFalsePerc = parseFloat(computeAvg(isFalse, totalVotes))
  const noOpinionPerc = parseFloat(computeAvg(noOpinion, totalVotes))
  const isUnclearPerc = parseFloat(computeAvg(isUnclear, totalVotes))

  return { "isTruePerc": isTruePerc, "isFalsePerc": isFalsePerc, "noOpinionPerc": noOpinionPerc, "isUnclearPerc": isUnclearPerc, "totalVotes": totalVotes }
}

async function hideButtons(newId) {
  const btns = document.getElementById(`toVoteButtons-${newId}`)
  btns.style.display = "none"
}

async function setBarsContent(new_data) {

  const bar = document.getElementById(`bar-${new_data.new_id}`)

  const totalVotes = (new_data.new_isTrue) + (new_data.new_isFalse) + (new_data.new_isUnclear) + (new_data.new_noOpinion)

  const isTruePerc = computeAvg(new_data.new_isTrue, totalVotes)
  const isFalsePerc = computeAvg(new_data.new_isFalse, totalVotes)
  const noOpinionPerc = computeAvg(new_data.new_noOpinion, totalVotes)
  const isUnclearPerc = computeAvg(new_data.new_isUnclear, totalVotes)

  bar.innerHTML = `
  <div class="w-full h-4 bg-green-500 rounded-l-full relative" style="width: ${isTruePerc}%;">
                  <span class="tooltip-text">${isTruePerc}% (${new_data.new_isTrue})</span>
                </div>
                <div class="w-full h-4 bg-gray-500 relative" style="width: ${noOpinionPerc}%;">
                  <span class="tooltip-text">${noOpinionPerc}% (${new_data.new_noOpinion})</span>
                </div>
                <div class="w-full h-4 bg-orange-500 relative" style="width: ${isUnclearPerc}%;">
                  <span class="tooltip-text">${isUnclearPerc}% (${new_data.new_isUnclear})</span>
                </div>
                <div class="w-full h-4 bg-red-500 rounded-r-full relative" style="width: ${isFalsePerc}%;">
                  <span class="tooltip-text">${isFalsePerc}% (${new_data.new_isFalse})</span>
                </div>
  `
}

async function sortBy(veracityValue) {

  /* consider using bubble or any other sorting algorithm if its too slow
  var sortedData = allData;

  for(var i = sortedData.length; i > 0; i--){
    for(var j = 0; j < i - 1; j++){
      if(sortedData[j][veracityValue] < sortedData[j+1][veracityValue]){
        var temp = sortedData[j];
        sortedData[j] = sortedData[j + 1];
        sortedData[j + 1] = temp;
      }
    }
  }*/

  manipulatedData = manipulatedData.sort((a, b) => {
    const percentagesOfA = transformToPercentages(a.new_isTrue, a.new_isFalse, a.new_noOpinion, a.new_isUnclear)
    const percentagesOfB = transformToPercentages(b.new_isTrue, b.new_isFalse, b.new_noOpinion, b.new_isUnclear)

    return percentagesOfB[veracityValue] - percentagesOfA[veracityValue]
  });

  await setContent(manipulatedData)

}

async function filterBy(sourceValue) {

  if (sourceValue === "*") {
    manipulatedData = allData;
    await setContent(manipulatedData);

  }
  else {
    manipulatedData = allData.filter(item => item.new_source === sourceValue);
    await setContent(manipulatedData)
  }
}

async function serachByTextInTitle(textValue) {

  if (textValue === "") { await setContent(manipulatedData); }
  else {
    const dataContains = manipulatedData.filter(item => item.new_title.toLowerCase().includes(textValue.toLowerCase()));
    await setContent(dataContains);
  }

}

document.getElementById("searchComponent").addEventListener("input", function (event) {
  withLoadScreen(() => serachByTextInTitle(event.target.value))
});

function checkVote(newId) {
  const getVotedList = localStorage.getItem("votedNews")

  if (getVotedList !== null) {
    const votedList = JSON.parse(getVotedList)

    return votedList.newIds.includes(newId)
  }

  return false
}

async function markNewAsVoted(newId) {
  const getVotedList = localStorage.getItem("votedNews")

  if (getVotedList !== null) {

    if (!checkVote(newId)) {
      var votedList = JSON.parse(getVotedList)
      votedList.newIds.push(newId)
      localStorage.setItem("votedNews", JSON.stringify(votedList))
    }
  } else {
    const votedList = JSON.stringify({ "newIds": [newId] })
    localStorage.setItem("votedNews", votedList)
  }
}

function getSubtractedDate(dayToSubtract) {
  const date = new Date();
  date.setDate(date.getDate() - dayToSubtract)

  return date.toISOString().slice(0, 10)
}

// Generate date options and insert them into the container
container.innerHTML = generateDateOptions();
