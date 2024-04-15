async function sortBy(param) {

  sortObject.isActive = true
  sortObject.param = param

  const url = (filterObject.isActive) ?
    `${pageBaseEndpoint}/sortFilterBy/${param}/${filterObject.param}/${filterObject.value}`
    : `${pageBaseEndpoint}/sortBy/${param}`

  currentReqUrl = url
  next_page = 1
  contentSize = 0

  withLoadScreen(async () => { await loadDataFromServerGET(currentReqUrl); setChatsStatusOnLoad();})
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

    withLoadScreen(async () => { await loadDataFromServerGET(currentReqUrl); setChatsStatusOnLoad(); })
  }
}

async function filterByCat(filterValue) {

  if (filterValue === "*") {
    window.location.reload();

  }
  else {

    filterObject.isActive = true
    filterObject.param = "new_type"
    filterObject.value = filterValue

    const url = `${pageBaseEndpoint}/filterBy/new_type/${filterValue}`

    currentReqUrl = url
    next_page = 1
    contentSize = 0

    withLoadScreen(async () => { await loadDataFromServerGET(currentReqUrl); setChatsStatusOnLoad(); })
  }
}

async function serachByTextInTitle(textValue) {

  if (textValue !== "") {

    const url = `${pageBaseEndpoint}/search`

    currentReqUrl = url
    next_page = 1
    contentSize = 0

    withLoadScreen( async () => { await loadDataFromServerPOST(currentReqUrl, { title: textValue }); setChatsStatusOnLoad(); })

  } else window.location.reload()
}

document.getElementById("searchComponent").addEventListener("keypress", function (event) {

  if (event.key === "Enter") withLoadScreen(() => serachByTextInTitle(event.target.value))
});

// Event listener for the "Load More" button click
document.getElementById('loadMoreButton').addEventListener('click', () => {

  
  withLoadScreen(async () => {  await loadDataFromServerGET(currentReqUrl, true); setChatsStatusOnLoad();})
});

function setChatsStatusOnLoad() {
  if (!readOnlyPage) changeConnection(currentChat.chatCode, currentChat.general, currentChat.newTitle, false);
  else setChatsStatus();
}