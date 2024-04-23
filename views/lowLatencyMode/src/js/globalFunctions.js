function showLoading() {
  document.getElementById("loading-container").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading-container").style.display = "none";
}

function showErrorMessage(message) {
  Toastify({
    text: message,
    duration: 5000, // Duration in milliseconds (5 seconds in this example)
    gravity: 'top', // Display position: 'top', 'center', 'bottom'
    position: 'right', // Toast position: 'left', 'center', 'right'
    backgroundColor: 'linear-gradient(to right, #FF6C6C, #FF0000)', // Background color
    stopOnFocus: true // Stop the toast when focused
  }).showToast();
}

// try to replace the setTimeout by a promise
async function withLoadScreen(func) {
  showLoading();

  // for some reason the load screen only shows if code inside setTimeout
  setTimeout(async () => {
    await func()
    hideLoading();
  }, 0)
}

function blockedUser() {
  window.document.body.innerHTML = news.msg;
  window.document.body.style.color = "white";
  window.document.body.style.backgroundColor = "black";
  showErrorMessage(news.msg);
}

async function checkUrlForNewId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString);

  newId = urlParams.get("new_id")
  date = urlParams.get("date")

  if(newId && date) await getNewById(newId, date);
  else withLoadScreen(() => { currentReqUrl = pageBaseEndpoint; loadDataFromServerGET(currentReqUrl); })
}