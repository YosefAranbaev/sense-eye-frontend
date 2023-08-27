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

        fetch('https://sense-eye-backend.onrender.com/api/users/', requestData)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Email already exists");
                }
                return response.json();
            })
            .then(data => {
                console.log(data + " kkkk");
                signUpMessageP.style.color = "blue";
                signUpMessageP.textContent = 'Signup successful!';
                console.log(data)
                localStorage.setItem("user_token", data.accessToken);
                localStorage.setItem("user_org_name", data.orgName);
                localStorage.setItem("user_a", data.orgName);
                localStorage.setItem("user_name", data.name);
                localStorage.setItem("user_role", data.role);
                window.location.href = '../mentor/main.html';
                return data                // Do something with the response data
            })
            .catch(error => {
                console.error(error);
                signUpMessageP.style.color = "red";
                signUpMessageP.textContent = error.message
                // Handle the error
            });
    });

});