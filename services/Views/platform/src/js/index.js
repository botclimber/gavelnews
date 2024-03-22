
loadDataFromServer = async () => {
  const response = await fetch("http://localhost:3000/");
  const news = await response.json();

  allData = news.data;
  manipulatedData = news.data;
  await setContent(news.data)

}

withLoadScreen(() => loadDataFromServer())