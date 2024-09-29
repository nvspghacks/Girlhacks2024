// Function to create bubbles for the disco effect
function createBubble() {
    const bubble = document.createElement('div');
    const size = Math.random() * 100 + 20; // Bubble size between 20px and 120px
    const leftPosition = Math.random() * (100 - (size / window.innerWidth * 100)); // Adjusted left position

    // Generate random bubble color
    const bubbleColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color using HSL

    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${leftPosition}vw`; // Use vw for better responsiveness
    bubble.style.backgroundColor = bubbleColor;

    document.body.appendChild(bubble);

    // Remove the bubble after the animation ends to free up resources
    setTimeout(() => {
        bubble.remove();
    }, 7000); // Match with animation duration
}

// Create bubbles at intervals
setInterval(createBubble, 250); // Adjust the frequency of bubbles

// Toggle between Sign-Up and Sign-In forms
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Add event listener for toggling the panel
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function showAlert(message, isSuccess) {
    const msg = document.getElementById('msg'); // Make sure this matches the ID in index.html
    msg.style.display = "block"; // Show the alert
    msg.className = "alert"; // Reset className
    msg.className += isSuccess ? " alert-success" : " alert-danger"; // Add appropriate class
    msg.innerHTML = message;

    // Hide alert after 2 seconds
    setTimeout(() => {
        msg.style.display = "none";
    }, 2000);
}

// Sign-up function to handle the signup form submission
async function signup(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get user input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    // Basic validation
    if (name === '' || email === '' || password === '' || password2 === '') {
        showAlert('Please fill out all fields', false);
        return;
    }

    if (password !== password2) {
        showAlert('Passwords do not match', false);
        return;
    }

    // Prepare the data to send to the backend
    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        // API call to backend for user registration
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(`${name} is registered with email: ${email}`, true);
            
            // Clear the form after successful registration
            document.getElementById('registerForm').reset();
        } else {
            showAlert(result.message || "Sign up failed. Please try again.", false);
        }
    } catch (error) {
        showAlert("An error occurred. Please try again later.", false);
    }
}

// Sign-in function to handle the signin form submission
async function signin(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get user input values
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    // Prepare the data to send to the backend
    const userData = {
        email: email,
        password: password
    };

    try {
        // API call to backend for user login
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert('Sign in successful! Redirecting...', true);
            
            // Clear the form after successful sign-in
            document.getElementById('loginForm').reset();
            
            // Redirect to your desired URL after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000); // Redirect after 1 second
        } else {
            showAlert(result.message || 'Invalid email or password', false);
        }
    } catch (error) {
        showAlert("An error occurred. Please try again later.", false);
    }
}
