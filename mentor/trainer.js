Imagecounter = 0;
document.addEventListener("DOMContentLoaded", function () {
    gameID = ''
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
      
    if (window.location.pathname.includes("trainer_my_list.html")) {

        const wrapper = document.querySelector(".wrapper_body");
        const url = "https://sense-eye-backend.onrender.com/api/games";
        console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((game) => {
                    const gameElement = document.createElement("div");
                    gameElement.classList.add("game");
                    gameElement.innerHTML = `
            <a><h2>${game.mode}</h2>
            <p>Org name: ${game.orgName}</p>
            <p>Timestamp: ${game.timestamp}</p></a>
          `;
                    gameElement.addEventListener("click", function () {
                        console.log("aaa")
                        gameID = game.timestamp;
                        openModal(game.timestamp);

                    });
                    wrapper.appendChild(gameElement);
                });
            })
            .catch((error) => console.log(error));
    }
    if (window.location.pathname.includes("game_rec.html")) {
        const wrapper = document.querySelector(".wrapper_body");
        const url = `https://sense-eye-backend.onrender.com/api/rec/${gameID}`;
        console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((game) => {
                    if (game.status == 0) {
                        const recElement = document.createElement("div");
                        recElement.classList.add("game");
                        recElement.innerHTML = `
            <a><h2>Organization: ${game.orgName}</h2>
            <p>game ID: ${game.gameID}</p></a>
            <button class = "buttonGreen">Good</button>
            <button class = "buttonRed">Bad</button>
            <div><img class = "recPic" id="myImage-${game.gameID}"></div>
          `;
                        console.log(game.frame)
                        // gameElement.addEventListener("click", function () {
                        //     openModal(game.timestamp);
                        // });
                        var img = new Image();
                        img.src = 'data:image/jpeg;base64,' + game.frame;
                        img.onload = function () {
                            const imageElements = document.querySelectorAll(`[id^="myImage-${game.gameID}"]`);
                            imageElements.forEach((imageElement) => {
                                imageElement.src = img.src;
                                imageElement.addEventListener("click", function () {
                                    zoomImage(this);
                                });
                            });
                        };
                        wrapper.appendChild(recElement);
                    }
                });
            })
            .catch((error) => console.log(error));
    }
});
function openModal(gameID) {
    console.log(gameID);
    window.location.href = 'game_rec.html';
    console.log("hello")
}
