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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyContent)
    });
  
    const news = await response.json();
  
    await handleResponse(news, append)
    
  }

  loadDataFromServerGET = async (reqUrl, append = false) => {

    const response = await fetch(`${reqUrl}/${next_page}`);
    const news = await response.json();
  
    await handleResponse(news, append)
  }

  async function reloadData(){

    currentReqUrl = pageBaseEndpoint;
    next_page = 1;
    contentSize = 0;
    
    withLoadScreen( async () => {  await loadDataFromServerGET(currentReqUrl); setChatsStatusOnLoad() })
  }

  

  withLoadScreen(() => { currentReqUrl = pageBaseEndpoint; loadDataFromServerGET(currentReqUrl); })