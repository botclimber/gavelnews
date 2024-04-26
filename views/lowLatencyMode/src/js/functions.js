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
  //if (scrollPosition > 50 && !isMobileDevice()) {
  if (scrollPosition > 50) {
    menu.classList.add('menu-scrolled');

  } else {
    menu.classList.remove('menu-scrolled');
  }
});

function computeAvg(rawValue, totalValue) {
  const comp = ((rawValue / totalValue) * 100).toFixed(2)

  return (comp != "NaN") ? comp : 0;
}

function transformToPercentages(isTrue, isFalse, isUnclear, noOpinion = 0) {

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