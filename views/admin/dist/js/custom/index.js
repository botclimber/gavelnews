const api = "http://localhost:8003/admin"
const apiKey = "greedisgood"
var allData = undefined;

async function loadData(){
    
    try {
        const response = await fetch(`${api}/getUsers`, {
            headers: {
                'x-api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        allData = data

        console.log('Data:', data); // Handle the retrieved data here
    
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