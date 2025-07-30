// Main JavaScript functionality for MediSlot
class MediSlot {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.doctors = this.getDoctorsData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserInterface();
    }

    setupEventListeners() {
        // Search functionality
        const searchForm = document.querySelector('form[role="search"]');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Book appointment buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary') && e.target.textContent.includes('Book')) {
                this.handleBookAppointment(e);
            }
        });

        // Navigation updates
        this.updateNavigation();
    }

    handleSearch(e) {
        e.preventDefault();
        const searchTerm = e.target.querySelector('input[type="search"]').value.toLowerCase();
        
        if (searchTerm) {
            // Redirect to doctors page with search parameter
            window.location.href = `doctors.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    handleBookAppointment(e) {
        e.preventDefault();
        
        if (!this.currentUser) {
            alert('Please login first to book an appointment');
            window.location.href = 'login.html';
            return;
        }

        // Get doctor info from the page
        const doctorCard = e.target.closest('.card') || e.target.closest('.doctor-card');
        if (doctorCard) {
            const doctorName = doctorCard.querySelector('h5, .card-title')?.textContent || 'Unknown Doctor';
            const specialty = doctorCard.querySelector('.text-muted, p')?.textContent || 'General';
            
            // Redirect to appointment booking page
            const params = new URLSearchParams({
                doctor: doctorName,
                specialty: specialty
            });
            window.location.href = `appointment.html?${params.toString()}`;
        }
    }

    updateNavigation() {
        const userIcon = document.querySelector('.user-icon a');
        if (userIcon && this.currentUser) {
            userIcon.innerHTML = '<i class="fa-solid fa-user-check"></i>';
            userIcon.href = 'user.html';
            userIcon.title = `Welcome, ${this.currentUser.name}`;
        }
    }

    updateUserInterface() {
        // Update appointment count in navigation
        const appointmentLinks = document.querySelectorAll('a[href*="user.html"]');
        appointmentLinks.forEach(link => {
            if (this.currentUser && this.appointments.length > 0) {
                const userAppointments = this.appointments.filter(apt => apt.userId === this.currentUser.id);
                if (userAppointments.length > 0) {
                    link.innerHTML += ` <span class="badge bg-primary">${userAppointments.length}</span>`;
                }
            }
        });
    }

    getDoctorsData() {
        return [
            {
                id: 1,
                name: "Dr. Ananya Sharma",
                specialty: "Dermatologist",
                qualification: "MBBS (AIMS Delhi), PG",
                location: "123, Shashtri Nagar",
                phone: "+91 12345 67890",
                email: "ananya.sharma@medislot.com",
                timing: "10:00 AM to 5:00 PM",
                fee: 199,
                image: "images/derma.PNG",
                rating: 4.8,
                experience: "8 years"
            },
            {
                id: 2,
                name: "Dr. Rajesh Kumar",
                specialty: "Cardiologist",
                qualification: "MBBS, MD (Cardiology)",
                location: "456, Medical Center",
                phone: "+91 98765 43210",
                email: "rajesh.kumar@medislot.com",
                timing: "9:00 AM to 6:00 PM",
                fee: 299,
                image: "images/cardio.jpg",
                rating: 4.9,
                experience: "12 years"
            },
            {
                id: 3,
                name: "Dr. Priya Patel",
                specialty: "Gynecologist",
                qualification: "MBBS, MS (Gynecology)",
                location: "789, Women's Clinic",
                phone: "+91 87654 32109",
                email: "priya.patel@medislot.com",
                timing: "10:00 AM to 4:00 PM",
                fee: 249,
                image: "images/gyni.png",
                rating: 4.7,
                experience: "10 years"
            },
            {
                id: 4,
                name: "Dr. Amit Singh",
                specialty: "General Physician",
                qualification: "MBBS, MD (Internal Medicine)",
                location: "321, Health Center",
                phone: "+91 76543 21098",
                email: "amit.singh@medislot.com",
                timing: "8:00 AM to 8:00 PM",
                fee: 149,
                image: "images/general.jpg",
                rating: 4.6,
                experience: "15 years"
            },
            {
                id: 5,
                name: "Dr. Sunita Verma",
                specialty: "Pediatrician",
                qualification: "MBBS, MD (Pediatrics)",
                location: "654, Children's Hospital",
                phone: "+91 65432 10987",
                email: "sunita.verma@medislot.com",
                timing: "9:00 AM to 5:00 PM",
                fee: 179,
                image: "images/pediatric.jpg",
                rating: 4.8,
                experience: "9 years"
            },
            {
                id: 6,
                name: "Dr. Vikram Joshi",
                specialty: "Neurologist",
                qualification: "MBBS, DM (Neurology)",
                location: "987, Neuro Center",
                phone: "+91 54321 09876",
                email: "vikram.joshi@medislot.com",
                timing: "10:00 AM to 3:00 PM",
                fee: 399,
                image: "images/neuro.jpg",
                rating: 4.9,
                experience: "14 years"
            }
        ];
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.mediSlot = new MediSlot();
});