
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const loginMessageP = document.getElementById('login_message');
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;
        // You can use the email and password here to send to the server
        // using fetch or another method to authenticate the user
        // For example:
        fetch('https://sense-eye-backend.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        }).then(response => {
            if (response.ok) {
                // Extract the JSON data from the response
                // Display the success message in the UI
                loginMessageP.textContent = 'Login successful';
                return response.json();
            } else if (response.status === 401) {
                // Login failed due to unauthorized access
                throw new Error('Unable to access user');
            } else {
                // Other error occurred
                throw new Error('Login failed');
            }
        }).then(data => {
            // Use the JSON data
            console.log(data)
            localStorage.setItem("user_token", data.accessToken);
            localStorage.setItem("user_org_name", data.orgName);
            localStorage.setItem("user_a", data.orgName);
            localStorage.setItem("user_name", data.name);
            localStorage.setItem("user_role", data.role);
            // window.location.href = '../login.html';
            if (data.role == "trainer") {
                window.location.href = '../mentor/main.html';
            }
            if (data.role == "trainee") {
                window.location.href = '../player_interface/main.html';
            }
            return data
        }).catch(error => {
            // Handle the error
            console.error(error);
            // Display the error message in the UI
            // const errorMessage = document.createElement('p');
            // document.body.form.appendChild(errorMessage);
            loginMessageP.style.color = "red";
            loginMessageP.textContent = error.message;
        });

    });
});
function forgotPassword() {
    // Redirect the user to the forgot password page
    window.location.href = ".forgot_password.html";
}

function signup() {
    // Redirect the user to the signup page
    window.location.href = "../signup/signup.html";
}