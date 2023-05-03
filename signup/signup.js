document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById('signup-form');

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
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Do something with the response data
            })
            .catch(error => {
                console.error(error);
                // Handle the error
            });
    });

});