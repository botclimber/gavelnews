const api = "http://localhost"
const apiKey = "greedisgood"
var allData = undefined;

async function loadData() {

  try {
    const response = await fetch(`${api}/admin/getUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    console.log(data)
    allData = data

  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

function waitForAllData() {
  return new Promise(resolve => {
    let interval = setInterval(() => {
      if (allData) {
        clearInterval(interval);
        resolve();
      }
    }, 0);
  });
}

loadData();