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

// Generate date options and insert them into the container
container.innerHTML = generateDateOptions("./src/images/live.gif", "./index_old.html", "./index.html");