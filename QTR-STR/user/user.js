// DOM Elements
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignupLinks = document.querySelectorAll('.switch-to-signup');
const switchToLoginLinks = document.querySelectorAll('.switch-to-login');
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const loginPassword = document.getElementById('login-password');
const signupPassword = document.getElementById('signup-password');
const loginFormElement = document.getElementById('loginForm');
const signupFormElement = document.getElementById('signupForm');

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        tabs.forEach(t => t.classList.remove('active'));
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding form
        if (tab.dataset.tab === 'login') {
            loginForm.classList.add('active');
        } else {
            signupForm.classList.add('active');
        }
    });
});

// Switch to signup form
switchToSignupLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        tabs[1].click();
    });
});

// Switch to login form
switchToLoginLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        tabs[0].click();
    });
});

// Password toggle functionality
loginToggle.addEventListener('click', () => {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    loginToggle.classList.toggle('fa-eye');
    loginToggle.classList.toggle('fa-eye-slash');
});

signupToggle.addEventListener('click', () => {
    const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    signupPassword.setAttribute('type', type);
    signupToggle.classList.toggle('fa-eye');
    signupToggle.classList.toggle('fa-eye-slash');
});

// Form submission handling
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = loginPassword.value;

    // Simulate login process
    console.log('Login attempt with:', { email, password });

    // Show success message
    alert('Login successful! Welcome to Qatar Hypermarket.');
    // In a real application, you would redirect or update UI
});

signupFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = signupPassword.value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Simulate signup process
    console.log('Signup attempt with:', { firstName, lastName, email, phone, password });

    // Show success message
    alert(`Account created successfully! Welcome ${firstName} to Qatar Hypermarket.`);
    // Switch to login form
    tabs[0].click();

    // Clear form (optional)
    signupFormElement.reset();
});

// Add some interactive effects
document.querySelectorAll('.form-control').forEach(input => {
    // Add focus effect
    input.addEventListener('focus', function () {
        this.parentElement.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.parentElement.style.transform = 'translateY(0)';
    });
});

// Language selector toggle
document.querySelector('.language-selector').addEventListener('click', function () {
    alert('Language selection would open here. For demo, we only show English.');
});