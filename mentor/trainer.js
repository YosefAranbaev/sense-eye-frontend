function openStat(gameID) {
    console.log(gameID);
    const url = `game_stat.html?gameID=${gameID}`;
    window.location.href = url;
}
let imageState = "original";

function zoomImage(img) {
    if (imageState === "original") {
        img.style.transform = "scale(2)"; // Increase the image size by 2 times
        img.style.transition = "transform 0.5s"; // Add a smooth transition effect
        imageState = "zoomed";
    } else {
        img.style.transform = "scale(1)"; // Reset the image size to its original size
        imageState = "original";
    }
}
function resetImageSize() {
    const images = document.querySelectorAll(".recPic");
    images.forEach((image) => {
        image.style.transform = "scale(1)"; // reset the image size to its original size
        image.removeEventListener("click", resetImageSize); // remove the click listener
    });
    document.removeEventListener("wheel", resetImageSize); // remove the scroll listener
}
function convertDateString(dateString) {
    // Split the date and time components
    const [datePart, timePart] = dateString.split('_');

    // Split the date into year, month, and day
    const [year, month, day] = datePart.split('-');

    // Split the time into hours, minutes, and seconds
    const [hours, minutes, seconds] = timePart.split('-');

    // Create a new Date object with the extracted components
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    // Format the date and time as desired
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    return `${formattedDate} ${formattedTime}`;
}


document.addEventListener("DOMContentLoaded", function () {
    function toggleLogoutOptions() {
        var logoutOptions = document.getElementById("logout-options");

        if (logoutOptions) {
            logoutOptions.remove();
        } else {
            // Create the button list
            var buttonList = document.createElement("div");
            buttonList.id = "logout-options";
            buttonList.classList.add("logout-options");

            var logoutButton = document.createElement("button");
            logoutButton.innerText = "Logout";
            logoutButton.addEventListener("click", function () {
                // Clear localStorage or perform any other logout actions
                localStorage.clear();
                window.location.href = `../login/main.html`;

            });

            buttonList.appendChild(logoutButton);

            // Append the button list after the "user" link
            var userLink = document.getElementById("user");
            userLink.parentNode.insertBefore(buttonList, userLink.nextSibling);
        }
    }

    // Attach the click event handler to the "user" link
    var userLink = document.getElementById("user");
    userLink.addEventListener("click", toggleLogoutOptions);
    let gameID = ''
    if (window.location.pathname.includes("trainer_results.html")) {
        if (!localStorage.getItem("user_org_name")) {
            window.location.href = `../login/main.html`;
        }
        const wrapper = document.querySelector(".wrapper_body");
        const url = "https://sense-eye-backend.onrender.com/api/games";
        console.log(url);
        console.log(localStorage.getItem("user_org_name"))

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((game) => {
                    const jojoElement = document.getElementById("orgNameResult");

                    if (jojoElement) {
                        // If the element exists, set its text content to a new value
                        jojoElement.textContent = "Organization name: " + game.orgName;

                    }
                    console.log(game)
                    console.log(localStorage.getItem("user_org_name"))

                    if (game.orgName == localStorage.getItem("user_org_name")) {
                        console.log(localStorage.getItem("user_org_name"))
                        const gameElement = document.createElement("div");
                        gameElement.classList.add("game");
                        let game_mode = ""
                        if (game.mode == 1) {
                            game_mode = "Single Player"
                        }
                        if (game.mode == 2) {
                            game_mode = "Same Team"
                        }
                        if (game.mode == 3) {
                            game_mode = "Different Teams"
                        }
                        gameElement.innerHTML = `
            <a><h2>Game Mode: ${game_mode}</h2>
            <p>Date: ${convertDateString(game.timestamp)}</p></a>
          `;
                        gameElement.addEventListener("click", function () {
                            console.log("aaa")
                            gameID = game.timestamp;
                            openStat(game.timestamp);

                        });
                        wrapper.appendChild(gameElement);
                    }
                });
            })
            .catch((error) => console.log(error));
    }
    if (window.location.pathname.includes("game_stat.html")) {
        if (!localStorage.getItem("user_org_name")) {
            window.location.href = `../login/main.html`;
        }
        const wrapper = document.querySelector(".wrapper_body");
        const params = new URLSearchParams(window.location.search);
        gameID = params.get("gameID");
        const url = `https://sense-eye-backend.onrender.com/api/statistics/${gameID}`;
        console.log(url);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    const noResElement = document.createElement("div");
                    noResElement.className = "noRec";
                    noResElement.innerText = "No Statistics found";
                    wrapper.appendChild(noResElement);
                    throw new Error("No Statistics found");
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                appendedRecCounter = 0
                console.log(data)
                if (data.length != 0) {
                    data.forEach((game) => {
                        fetch(game.frame)
                            .then(response => {
                                if (response.ok) {
                                    const jojoElement = document.getElementById("gameRecTitle");
                                    const dateTitle = document.getElementById("gameDateRecTitle")
                                    if (jojoElement && dateTitle) {
                                        // If the element exists, set its text content to a new value
                                        jojoElement.textContent = "Organization name: " + game.orgName;
                                        dateTitle.textContent = convertDateString(game.gameID);
                                    }
                                    console.log('---->' + game)
                                    console.log('++++++>' + gameID)
                                    const recElement = document.createElement("div");
                                    recElement.classList.add("game");
                                    const nameParam = new URLSearchParams(new URL(game.frame).search);
                                    result = nameParam.get("name");
                                    result = result.replace(/_/g, ' ');
                                    result = result.replace('.png', " ")

                                    // Capitalize the first letter
                                    result = result.charAt(0).toUpperCase() + result.slice(1);
                                    recElement.innerHTML = `
                                <div class="frame">
                                <h3 id="stat_header">${result}</h3>
                                <img class="recPic" id="myImage-${game.gameID}" src=${game.frame}>
                                </div>
                            `;

                                    recElement.addEventListener("click", function () {
                                        const imageElements = document.querySelectorAll(`[id^="myImage-${game.gameID}"]`);
                                        imageElements.forEach((imageElement) => {
                                            imageElement.addEventListener("click", function () {
                                                zoomImage(this);
                                            });
                                        });
                                    });
                                    wrapper.appendChild(recElement);
                                    appendedRecCounter++;
                                }
                            });
                    })
                        .catch(error => {
                            console.log('Error occurred while checking image validity:', error);
                        });
                }
                if (appendedRecCounter == 0) {
                    const noResElement = document.createElement("div");
                    noResElement.className = "noRec";
                    noResElement.innerText = "No Statistics found";
                    wrapper.appendChild(noResElement);
                }
            })
            .catch((error) => console.log(error));
    }
});
document.addEventListener("DOMContentLoaded", function () {
    let gameID = ''
    if (window.location.pathname.includes("trainer_my_list.html")) {
        if (!localStorage.getItem("user_org_name")) {
            window.location.href = `../login/main.html`;
        }
        const wrapper = document.querySelector(".wrapper_body");
        const url = "https://sense-eye-backend.onrender.com/api/games";
        console.log(url);
        console.log(localStorage.getItem("user_org_name"))
        fetch(url)
            .then((response) => response.json())
            .then((data) => {

                for (let i = data.length - 1; i >= 0; i--) {
                    const game = data[i];
                    console.log(game)
                    console.log(localStorage.getItem("user_org_name"))
                    const jojoElement = document.getElementById("orgNameList");

                    if (jojoElement) {
                        // If the element exists, set its text content to a new value
                        jojoElement.textContent = "Organization name: " + game.orgName;

                    }
                    if (game.orgName == localStorage.getItem("user_org_name")) {
                        console.log(localStorage.getItem("user_org_name"))
                        const gameElement = document.createElement("div");
                        gameElement.classList.add("game");
                        gameElement.classList.add("game");
                        let game_mode = ""
                        if (game.mode == 1) {
                            game_mode = "Single Player"
                        }
                        if (game.mode == 2) {
                            game_mode = "Same Team"
                        }
                        if (game.mode == 3) {
                            game_mode = "Different Teams"
                        }
                        gameElement.innerHTML = `
                        <a>
                        <h2 id = "gameTitle">Game Mode: ${game_mode}</h2>
                        <p  id = "gameTitle">${convertDateString(game.timestamp)}</p>
                      </a>
                      <div class="buttons">
                        <a href="game_stat.html?gameID=${game.timestamp}">
                          <img id=gameCorellIcon src="/pictures/correlation.png" alt="Go to Page 1" />
                        </a>
                        <a href="game_rec.html?gameID=${game.timestamp}">
                          <img id=gameListIcon src="/pictures/vorx.png" alt="Go to Page 2" />
                        </a>
                      </div>
            `;
                        // gameElement.addEventListener("click", function () {
                        //     console.log("aaa")
                        //     gameID = game.timestamp;
                        //     openModal(game.timestamp);

                        // });
                        wrapper.appendChild(gameElement);
                    }
                };
            })
            .catch((error) => console.log(error));
    }

});
function goToPage1(gameID) {
    // Redirect to page1.html with the gameID parameter
    window.location.href = `game_rec.html?gameID=${gameID}`;
}

function goToPage2(gameID) {
    // Redirect to page2.html with the gameID parameter
    window.location.href = `game_stat.html?gameID=${gameID}`;
}
function openModal(gameID) {
    console.log(gameID);
    const url = `game_rec.html?gameID=${gameID}`;
    window.location.href = url;
}
document.addEventListener("DOMContentLoaded", function () {

    const wrapper = document.querySelector(".wrapper_body");
    const urlParams = new URLSearchParams(window.location.search);
    const gameID = urlParams.get('gameID');
    var appendedRecCounter = 0
    if (window.location.pathname.includes("main.html")) {
        console.log(localStorage.getItem("user_org_name"))
        if (!localStorage.getItem("user_org_name")) {
            window.location.href = `../login/main.html`;
        }
        const BASE_URL = 'https://sense-eye-backend.onrender.com/api/rec';
        const PAGE_SIZE = 1500;
        let successRecStatus = 0
        let wrongRecStatus = 0

        var ctx = document.getElementById('myChart').getContext('2d');

        function fetchAllRecs(page) {
            fetch(`${BASE_URL}?page=${page}&page_size=${PAGE_SIZE}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    console.log(data.results)
                    data.forEach(rec => { // Changed this line to use data.results instead of data
                        if (rec.orgName == localStorage.getItem("user_org_name")) {
                            if (rec.status === 1) {
                                successRecStatus++
                                console.log(`Rec ${rec._id} is in green`);
                            } else if (rec.status === -1) {
                                wrongRecStatus++
                                console.log(`Rec ${rec._id} is in red`);
                            }
                        }
                    });
                    console.log(data)
                    if (data.next) {
                        // There are more pages, recursively fetch the next page
                        fetchAllRecs(page + 1);
                    } else {
                        // All data has been fetched, create the chart
                        createChart();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        var myChart = null;

        function createChart() {
            console.log("charti")
            console.log(successRecStatus, wrongRecStatus)
            if (myChart) {
                myChart.destroy();
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [`Inaccurate ${Math.round((wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`, `Accurate ${Math.round(100 - (wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`],
                    datasets: [{
                        label: 'Accuracy Rate',
                        data: [wrongRecStatus, successRecStatus],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            stepSize: 1,
                            display: false


                        }
                    }
                }
            });
        }
        fetchAllRecs(1);
        function checkDateRange(dateString, startDateString, endDateString) {
            // Extract date parts from the dateString
            const dateParts = dateString.split('_')[0].split('-');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // Subtract 1 since months are zero-indexed
            const day = parseInt(dateParts[2]);

            // Extract date parts from the startDateString and endDateString
            const startDateParts = startDateString.split('-');
            const endDateParts = endDateString.split('-');

            // Create Date objects for comparison
            const dateToCheck = new Date(year, month, day);
            const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
            const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);

            return dateToCheck >= startDate && dateToCheck <= endDate;
        }

        // Start fetching from page 1
        function fetchAllRecsFilter(page) {
            console.log("here");
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            console.log("Start date:", startDate);
            console.log("End date:", endDate);
            console.log("==>" + startDate + " " + endDate)
            fetch(`${BASE_URL}?page=${page}&page_size=${PAGE_SIZE}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    console.log(data.results)
                    successRecStatus = 0
                    wrongRecStatus = 0
                    data.forEach(rec => { // Changed this line to use data.results instead of data
                        console.log(rec)
                        console.log(checkDateRange(rec.gameID, startDate, endDate))
                        if (rec.orgName == localStorage.getItem("user_org_name") && checkDateRange(rec.gameID, startDate, endDate)) {
                            console.log(checkDateRange(rec.gameID, startDate, endDate))
                            if (rec.status === 1) {
                                successRecStatus++
                                console.log(`Rec ${rec._id} is in green`);
                            } else if (rec.status === -1) {
                                wrongRecStatus++
                                console.log(`Rec ${rec._id} is in red`);
                            }
                        }
                    });
                    console.log(data)
                    if (data.next) {
                        // There are more pages, recursively fetch the next page
                        fetchAllRecs(page + 1);
                    } else {
                        // All data has been fetched, create the chart
                        createChart();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        // Add event listener to the Apply Filter button
        const applyFilterBtn = document.getElementById('apply-filter');
        applyFilterBtn.addEventListener('click', function () {
            fetchAllRecsFilter(1);
        });

    }
    if (window.location.pathname.includes("game_rec.html")) {
        if (!localStorage.getItem("user_org_name")) {
            window.location.href = `../login/main.html`;
        }
        const wrapper = document.querySelector(".wrapper_body");
        const url = `https://sense-eye-backend.onrender.com/api/rec/${gameID}`;
        console.log(url);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    const noResElement = document.createElement("div");
                    noResElement.className = "noRecommendations";
                    noResElement.className = "noRec";
                    noResElement.innerText = "No recommendations found";
                    wrapper.appendChild(noResElement);
                    throw new Error("No recommendations found");
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                appendedRecCounter = 0
                console.log(data)
                data.forEach((game) => {
                    const jojoElement = document.getElementById("gameRecTitle");
                    const dateTitle = document.getElementById("gameDateRecTitle")
                    if (jojoElement && dateTitle) {
                        // If the element exists, set its text content to a new value
                        jojoElement.textContent = "Organization name: " + game.orgName;
                        dateTitle.textContent = convertDateString(game.gameID);
                    }
                    console.log('---->' + game)
                    if (game.status == 0) {
                        console.log('++++++>' + gameID)
                        const recElement = document.createElement("div");
                        recElement.classList.add("game");
                        if (localStorage.getItem("user_role") == "trainer") {
                            console.log(localStorage.getItem("user_role"))
                            recElement.innerHTML = `
                        <div class="frame"><img class="recPic" id="myImage-${game.gameID}" src=${game.frame}></div>
                                <img class="buttonGreen" id=${game._id} src="/pictures/V.png">
                                <img class="buttonRed" id=${game._id} src="/pictures/X.png">
                            `;
                        }
                        else {
                            recElement.innerHTML = `
                        <div class="frame"><img class="recPic" id="myImage-${game.gameID}" src=${game.frame}></div>    `;
                        }
                        recElement.addEventListener("click", function () {
                            const imageElements = document.querySelectorAll(`[id^="myImage-${game.gameID}"]`);
                            imageElements.forEach((imageElement) => {
                                imageElement.addEventListener("click", function () {
                                    zoomImage(this);
                                });
                            });
                        });
                        wrapper.appendChild(recElement);
                        appendedRecCounter++;
                    }
                });
                if (appendedRecCounter == 0) {
                    const noResElement = document.createElement("div");
                    noResElement.className = "noRecommendations";
                    noResElement.innerText = "No recommendations found";
                    noResElement.className = "noRec";
                    wrapper.appendChild(noResElement);
                }
            })
            .catch((error) => console.log(error));
    }
    //if i press thr buttons bad or good
    wrapper.addEventListener("click", function (event) {
        if (event.target.classList.contains("buttonGreen")) {
            fetch('https://sense-eye-backend.onrender.com/api/rec/' + event.target.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 1
                })
            })
                .then(response => {
                    // Reload the current page
                    location.reload();
                    console.log(response.json());
                })
                .catch(error => {
                    console.error(error);
                });

            console.log(event.target.id);
        } else if (event.target.classList.contains("buttonRed")) {
            fetch('https://sense-eye-backend.onrender.com/api/rec/' + event.target.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: -1
                })
            })
                .then(response => {
                    // Reload the current page
                    location.reload();
                    console.log(response.json());
                })
                .catch(error => {
                    console.error(error);
                });

            console.log("hello " + event.target.id);
        }
    });
});
