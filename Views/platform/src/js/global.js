var allData;
var manipulatedData;

const api = "http://localhost:3000"

const news_div = document.getElementById("news")
var container = document.getElementById('dateContainer');

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