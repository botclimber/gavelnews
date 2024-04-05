var allData;
var dateAsGlobal;
var readOnlyPage;
var next_page = 1;
var filterObject = {isActive: false, param: undefined, value: undefined};
var sortObject = {isActive: false, param: undefined};
var currentReqUrl;

const api = "http://localhost"
const chatWebsocket = "ws://localhost:8002"

const chatTitleLimit = 15

var contentSize = 0;
const newsContentSize = document.getElementById("contentSize")
const news_div = document.getElementById("news")
const container = document.getElementById('dateContainer');
const loadBtn = document.getElementById("loadMoreButton");

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