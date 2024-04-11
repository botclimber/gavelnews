handleResponse = async (res, append = false) => {
  console.log(res)
  contentSize += res.contentSize

  if (contentSize >= res.allContentSize) loadBtn.classList.add('hidden');
  else loadBtn.classList.remove('hidden');

  newsContentSize.innerHTML = `${contentSize} of ${res.allContentSize} news`

  next_page++

  await setContent(res.content.data, append)
}

loadDataFromServerPOST = async (reqUrl, bodyContent = {}, append = false) => {
  const response = await fetch(`${reqUrl}/${next_page}`, {
    method: "POST",
    headers: headerWithToken,
    body: JSON.stringify(bodyContent)
  });

  const news = await response.json();
  console.log(response)

  if (response.ok) {
    await handleResponse(news, append);
  } else if (response.status === 403) {
    // If the error is 403, clear the body and show an error message
    window.document.body.innerHTML = news.msg;
    window.document.body.style.color = "white";
    window.document.body.style.backgroundColor = "black";
    showErrorMessage(news.msg);
  } else {
    // For other errors, show an error message
    showErrorMessage(news.msg);
  }

}

loadDataFromServerGET = async (reqUrl, append = false) => {

  const response = await fetch(`${reqUrl}/${next_page}`, {
    method: 'GET',
    headers: headerWithToken
  });
  const news = await response.json();

  if (response.ok) {
    await handleResponse(news, append);
  } else if (response.status === 403) {
    // If the error is 403, clear the body and show an error message
    window.document.body.innerHTML = news.msg;
    window.document.body.style.color = "white";
    window.document.body.style.backgroundColor = "black";
    showErrorMessage(news.msg);
  } else {
    // For other errors, show an error message
    showErrorMessage(news.msg);
  }
}

async function reloadData() {

  currentReqUrl = pageBaseEndpoint;
  next_page = 1;
  contentSize = 0;

  withLoadScreen(async () => { await loadDataFromServerGET(currentReqUrl); setChatsStatusOnLoad() })
}



withLoadScreen(() => { currentReqUrl = pageBaseEndpoint; loadDataFromServerGET(currentReqUrl); })