document.addEventListener('DOMContentLoaded', function () {
    const subscribeForm = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('email');
    const loadingMessage = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const sentMessage = document.getElementById('sent-message');

    subscribeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loadingMessage.style.display = 'block';

        const email = emailInput.value;

        fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                loadingMessage.style.display = 'none';
                if (data.success) {
                    sentMessage.style.display = 'block';
                } else {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = data.message;
                }
            })
            .catch(error => {
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'An error occurred while subscribing.';
            });
    });
});