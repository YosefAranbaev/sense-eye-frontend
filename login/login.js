
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;
        console.log(email, password);
        // You can use the email and password here to send to the server
        // using fetch or another method to authenticate the user
        // For example:
        fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        }).then(response => {
            // handle the response from the server
            console.log(response)
        });

    });

});
