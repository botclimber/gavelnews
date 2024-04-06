function waitForAllData() {
  return new Promise(resolve => {
    let interval = setInterval(() => {
      if (allDataIsSet) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

async function sortBy(param) {

  sortObject.isActive = true
  sortObject.param = param

  const url = (filterObject.isActive) ?
    `${pageBaseEndpoint}/sortFilterBy/${param}/${filterObject.param}/${filterObject.value}`
    : `${pageBaseEndpoint}/sortBy/${param}`

  currentReqUrl = url
  next_page = 1
  contentSize = 0

  withLoadScreen(() => { loadDataFromServerGET(currentReqUrl); })
}

async function filterBy(filterValue) {

  if (filterValue === "*") {
    window.location.reload();

  }
  else {

    filterObject.isActive = true
    filterObject.param = "new_source"
    filterObject.value = filterValue

    const url = `${pageBaseEndpoint}/filterBy/new_source/${filterValue}`

    currentReqUrl = url
    next_page = 1
    contentSize = 0

    withLoadScreen(() => { loadDataFromServerGET(currentReqUrl); })
  }
}

async function serachByTextInTitle(textValue) {

  if (textValue !== "") {

    const url = `${pageBaseEndpoint}/search`

    currentReqUrl = url
    next_page = 1
    contentSize = 0

    withLoadScreen(() => { loadDataFromServerPOST(currentReqUrl, {title: textValue}); })

  } else window.location.reload()
}

document.getElementById("searchComponent").addEventListener("keypress", function (event) {

  if (event.key === "Enter") withLoadScreen(() => serachByTextInTitle(event.target.value))
});

// Event listener for the "Load More" button click
document.getElementById('loadMoreButton').addEventListener('click', () => {
  // Load more data when the button is clicked

  if(!readOnlyPage) changeConnection(currentChat.chatCode, currentChat.general, currentChat.newTitle, false);
  else setChatsStatus();
  
  withLoadScreen(() => { loadDataFromServerGET(currentReqUrl, true); })
});