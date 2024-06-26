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
    blockedUser();
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
    blockedUser();
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

async function setCategories() {
  const cats = document.getElementById("categoriesDropDown")
  const dateForCategories = (readOnlyPage) ? dateAsGlobal : "current"
  console.log(`requesting categories ${dateForCategories}`)
  const request = await fetch(`${api}/news/categories/${dateForCategories}`)
  const response = await request.json()

  if (request.ok) {
    response.cats.map(cat => {
      if (cat) cats.innerHTML += `<a href="#" onclick="withLoadScreen(() => filterByCat('${cat}'))">${cat}</a>`;
    });
  } else showErrorMessage(response.msg);

}

setCategories();