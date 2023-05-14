document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById('signup-form');
    const signUpMessageP = document.getElementById('signUpMessageP');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents the page from reloading on form submission

        const formData = new FormData(form);

        const requestData = {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch('http://localhost:8000/api/users/', requestData)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Email already exists");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                signUpMessageP.style.color = "blue";
                signUpMessageP.textContent = 'Signup successful!';
                window.location.href = '../login/main.html';
                // Do something with the response data
            })
            .catch(error => {
                console.error(error);
                signUpMessageP.style.color = "red";
                signUpMessageP.textContent = error.message
                // Handle the error
            });
    });

});