// Contact page functionality
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Real-time validation
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearValidation(field));
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        this.submitContactForm(formData);
    }

    validateForm() {
        const form = document.getElementById('contactForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Clear previous validation
        this.clearValidation(field);

        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        } else if (field.id === 'message' && value && value.length < 10) {
            this.showFieldError(field, 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearValidation(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    getFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };
    }

    submitContactForm(formData) {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (in production, send to server)
        setTimeout(() => {
            // Save to localStorage for demo purposes
            const contacts = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            contacts.push({
                id: this.generateId(),
                ...formData
            });
            localStorage.setItem('contactSubmissions', JSON.stringify(contacts));

            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        const successHTML = `
            <div class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 9999; min-width: 400px;">
                <h5><i class="fa-solid fa-check-circle me-2"></i>Message Sent Successfully!</h5>
                <p class="mb-0">Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
        
        setTimeout(() => {
            document.querySelector('.alert-success').remove();
        }, 5000);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});