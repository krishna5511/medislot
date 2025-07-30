// Authentication functionality
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.setupAuthForms();
        this.checkAuthStatus();
    }

    setupAuthForms() {
        // Sign up form
        const signUpForm = document.querySelector('.sign-up-container form');
        if (signUpForm) {
            signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
        }

        // Sign in form
        const signInForm = document.querySelector('.sign-in-container form');
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        }

        // Toggle between sign in and sign up
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        if (signUpButton && signInButton && container) {
            signUpButton.addEventListener('click', () => 
                container.classList.add('right-panel-active'));

            signInButton.addEventListener('click', () => 
                container.classList.remove('right-panel-active'));
        }
    }

    handleSignUp(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = e.target.querySelector('input[placeholder="Name"]').value;
        const email = e.target.querySelector('input[placeholder="Email"]').value;
        const password = e.target.querySelector('input[placeholder="Password"]').value;

        // Validation
        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            this.showMessage('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.generateId(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            profile: {
                phone: '',
                age: '',
                gender: '',
                address: '',
                weight: '',
                height: '',
                bio: ''
            }
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login after signup
        this.loginUser(newUser);
        this.showMessage('Account created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'user.html';
        }, 1500);
    }

    handleSignIn(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[placeholder="Email"]').value;
        const password = e.target.querySelector('input[placeholder="Password"]').value;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const user = this.users.find(u => u.email === email);
        
        if (!user || !this.verifyPassword(password, user.password)) {
            this.showMessage('Invalid email or password', 'error');
            return;
        }

        this.loginUser(user);
        this.showMessage('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'user.html';
        }, 1500);
    }

    loginUser(user) {
        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in current user
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    checkAuthStatus() {
        // Redirect to login if accessing protected pages without authentication
        const protectedPages = ['user.html', 'appointment.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'login.html';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hashPassword(password) {
        // Simple hash function (in production, use proper hashing like bcrypt)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showMessage(message, type) {
        // Create and show message
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
        messageDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});