function waitForAllData() {
    return new Promise(resolve => {
      let interval = setInterval(() => {
        if (allDataIsSet) {
          clearInterval(interval);
          resolve();
        }
      }, 0);
    });
  }

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
function generateDateOptions() {
    const endDate = new Date("2024-03-20")

    const yesterday = getSubtractedDate(1)
    var options = `<button class="date-option active-date flex items-center" onclick="window.location.href=window.location.href = '/'">
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

function getSubtractedDate(dayToSubtract) {
    const date = new Date();
    date.setDate(date.getDate() - dayToSubtract)

    return date.toISOString().slice(0, 10)
}

// Generate date options and insert them into the container
//container.innerHTML = generateDateOptions();