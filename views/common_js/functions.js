function isMobileDevice() {
    //console.log(navigator.userAgent)
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// fix menu when user scrolls down
window.addEventListener('scroll', function () {
    var menu = document.getElementById('menu');
    var scrollPosition = window.scrollY;

    // Adjust class based on scroll position
    if (scrollPosition > 50 && !isMobileDevice()) {
        menu.classList.add('menu-scrolled');

    } else {
        menu.classList.remove('menu-scrolled');
    }
});

// Function to generate date options until a specific date
function generateDateOptions(iconPath, oldPagePath, currentPagePath) {
    const endDate = new Date("2024-03-20")

    const yesterday = getSubtractedDate(1)
    var options = `<button class="date-option active-date flex items-center" onclick="window.location.href='${currentPagePath}'">
    <img class="w-[15px] h-[12px] mr-2" src="${iconPath}" alt="Live icon" />
    <span>${yesterday}</span>
  </button>`;

    var currentDate = new Date(getSubtractedDate(2));
    while (currentDate >= endDate) {
        var formattedDate = currentDate.toISOString().slice(0, 10);

        options += `<button class="date-option" onclick="location.href='${oldPagePath}?date=${formattedDate}'">${formattedDate}</button>`;
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