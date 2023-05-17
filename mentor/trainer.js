function openStat(gameID) {
    console.log(gameID);
    const url = `game_stat.html?gameID=${gameID}`;
    window.location.href = url;
}
function zoomImage(img) {
    img.style.transform = "scale(2)"; // increase the image size by 2 times
    img.style.transition = "transform 0.5s"; // add a smooth transition effect
    document.addEventListener("wheel", resetImageSize); // add a listener for scrolling
}
function resetImageSize() {
    const images = document.querySelectorAll(".recPic");
    images.forEach((image) => {
        image.style.transform = "scale(1)"; // reset the image size to its original size
        image.removeEventListener("click", resetImageSize); // remove the click listener
    });
    document.removeEventListener("wheel", resetImageSize); // remove the scroll listener
}
document.addEventListener("DOMContentLoaded", function () {
    let gameID = ''
    if (window.location.pathname.includes("trainer_results.html")) {

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
                        jojoElement.textContent =game.orgName;

                    }
                    console.log(game)
                    console.log(localStorage.getItem("user_org_name"))

                    if (game.orgName == localStorage.getItem("user_org_name")) {
                        console.log(localStorage.getItem("user_org_name"))
                        const gameElement = document.createElement("div");
                        gameElement.classList.add("game");
                        gameElement.innerHTML = `
            <a><h2>Game Mode: ${game.mode}</h2>
            <p>Date: ${game.timestamp}</p></a>
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
        const wrapper = document.querySelector(".wrapper_body");
        const url = `https://sense-eye-backend.onrender.com/api/statistics/${gameID}`;
        console.log(url);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    const noResElement = document.createElement("div");
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
                    console.log('---->' + game)
                    console.log('++++++>' + gameID)
                    const recElement = document.createElement("div");
                    recElement.classList.add("game");
                    recElement.innerHTML = `
                                <a><h2>Organization: ${game.orgName}</h2>
                                <p>game ID: ${game.gameID}</p></a>
                                <div><img class="recPic" id="myImage-${game.gameID}" src=${game.frame}></div>
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
                });
                if (appendedRecCounter == 0) {
                    const noResElement = document.createElement("div");
                    noResElement.innerText = "No recommendations found";
                    wrapper.appendChild(noResElement);
                }
            })
            .catch((error) => console.log(error));
    }
});
document.addEventListener("DOMContentLoaded", function () {
    let gameID = ''
    if (window.location.pathname.includes("trainer_my_list.html")) {

        const wrapper = document.querySelector(".wrapper_body");
        const url = "https://sense-eye-backend.onrender.com/api/games";
        console.log(url);
        console.log(localStorage.getItem("user_org_name"))
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((game) => {
                    console.log(game)
                    console.log(localStorage.getItem("user_org_name"))
                    const jojoElement = document.getElementById("orgNameList");

                    if (jojoElement) {
                        // If the element exists, set its text content to a new value
                        jojoElement.textContent =game.orgName;

                    }
                    if (game.orgName == localStorage.getItem("user_org_name")) {
                        console.log(localStorage.getItem("user_org_name"))
                        const gameElement = document.createElement("div");
                        gameElement.classList.add("game");
                        gameElement.innerHTML = `
            <a><h2>Game Mode: ${game.mode}</h2>
            <p>Date: ${game.timestamp}</p></a>
          `;
                        gameElement.addEventListener("click", function () {
                            console.log("aaa")
                            gameID = game.timestamp;
                            openModal(game.timestamp);

                        });
                        wrapper.appendChild(gameElement);
                    }
                });
            })
            .catch((error) => console.log(error));
    }
});
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
        const BASE_URL = 'https://sense-eye-backend.onrender.com/api/rec';
        const PAGE_SIZE = 100;
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
                                console.log(`Rec ${rec.id} is in green`);
                            } else if (rec.status === -1) {
                                wrongRecStatus++
                                console.log(`Rec ${rec.id} is in red`);
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


        function createChart() {
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [`WRONG ${Math.round((wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`, `GOOD ${Math.round(100 - (wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`],
                    datasets: [{
                        label: 'Marking Number',
                        data: [wrongRecStatus / PAGE_SIZE * 100, successRecStatus / PAGE_SIZE * 100],
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

        // Start fetching from page 1
        fetchAllRecs(1);

    }
    if (window.location.pathname.includes("game_rec.html")) {
        const wrapper = document.querySelector(".wrapper_body");
        const url = `https://sense-eye-backend.onrender.com/api/rec/${gameID}`;
        console.log(url);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    const noResElement = document.createElement("div");
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
                    if (jojoElement&&dateTitle) {
                        // If the element exists, set its text content to a new value
                        jojoElement.textContent =game.orgName;
                        dateTitle.textContent = game.gameID;
                    }
                    console.log('---->' + game)
                    if (game.status == 0) {
                        console.log('++++++>' + gameID)
                        const recElement = document.createElement("div");
                        recElement.classList.add("game");
                        recElement.innerHTML = `
                                <a>
                                <button class="buttonGreen" id=${game._id}>Good</button>
                                <button class="buttonRed" id=${game._id}>Bad</button>
                                <div><img class="recPic" id="myImage-${game.gameID}" src=${game.frame}></div>
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
                if (appendedRecCounter == 0) {
                    const noResElement = document.createElement("div");
                    noResElement.innerText = "No recommendations found";
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
            fetch('http://localhost:8000/api/rec/' + event.target.id, {
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
