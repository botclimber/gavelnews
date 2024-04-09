const usersChart = document.getElementById('newUsersChart')
const totalUsers = document.getElementById('totalUsers')

const setTotalUsers = async () => {
    await waitForAllData()

    totalUsers.innerHTML = allData.length
}

function extractDataByDay(dataArray) {
    const data = Array.from({ length: 31 }, () => 0); // Initialize array with 31 elements for each day
    // Iterate over the dataArray
    dataArray.forEach((item, index) => {
        // Extract the day from createdAt
        const day = new Date(item.createdAt).getDate();
        // Increment the count of users for the corresponding day
        data[day - 1]++; // Subtract 1 to adjust for zero-based index
    });
    return data;
}

async function setUsersChart() {
    await waitForAllData()

    // Get the current date
    const currentDate = new Date();
    const currentMonth = new Date().getMonth();

    // Get the number of days in the current month
    const numberOfDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Generate labels dynamically based on the number of days in the current month
    const labels = Array.from({ length: numberOfDaysInMonth }, (_, index) => `${index + 1}`);

    // Update the data object with the dynamically generated labels
    const data = {
        labels: labels,
        datasets: [{
            label: 'New Users',
            data: extractDataByDay(allData),
            backgroundColor: 'green',
            borderColor: 'green',
            borderWidth: 1
        }]
    };

    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Users'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of Month'
                    }
                }
            }
        }
    };

    // Render the chart
    const newUsersChart = new Chart(
        usersChart,
        config
    );
}

setUsersChart()
setTotalUsers()