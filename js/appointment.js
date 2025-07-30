// Appointment booking functionality
class AppointmentBooking {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.doctors = this.getDoctorsData();
        this.selectedDoctor = null;
        this.init();
    }

    init() {
        if (!this.currentUser) {
            alert('Please login first to book an appointment');
            window.location.href = 'login.html';
            return;
        }

        this.loadDoctorInfo();
        this.setupForm();
        this.setMinDate();
        this.prefillUserData();
    }

    loadDoctorInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const doctorId = urlParams.get('doctorId');
        const doctorName = urlParams.get('doctor');
        const specialty = urlParams.get('specialty');
        const fee = urlParams.get('fee');

        if (doctorId) {
            this.selectedDoctor = this.doctors.find(d => d.id == doctorId);
        } else if (doctorName) {
            this.selectedDoctor = this.doctors.find(d => d.name === doctorName) || {
                name: doctorName,
                specialty: specialty || 'General',
                fee: parseInt(fee) || 199,
                qualification: 'MBBS',
                location: 'Medical Center',
                timing: '9:00 AM to 5:00 PM'
            };
        }

        if (this.selectedDoctor) {
            this.renderDoctorInfo();
            this.updateFees();
        }
    }

    renderDoctorInfo() {
        const doctorInfoSection = document.getElementById('doctorInfo');
        if (!doctorInfoSection || !this.selectedDoctor) return;

        doctorInfoSection.innerHTML = `
            <div class="doctor-info">
                <h4>${this.selectedDoctor.name}</h4>
                <p class="doctor-specialty">${this.selectedDoctor.specialty}</p>
                <div class="doctor-details">
                    <div>
                        <i class="fa-solid fa-graduation-cap"></i>
                        ${this.selectedDoctor.qualification}
                    </div>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        ${this.selectedDoctor.location}
                    </div>
                    <div>
                        <i class="fa-solid fa-clock"></i>
                        ${this.selectedDoctor.timing}
                    </div>
                    <div>
                        <i class="fa-solid fa-rupee-sign"></i>
                        Consultation Fee: ₹${this.selectedDoctor.fee}
                    </div>
                </div>
            </div>
        `;
    }

    updateFees() {
        if (!this.selectedDoctor) return;

        const consultationFee = this.selectedDoctor.fee;
        const platformFee = 29;
        const totalFee = consultationFee + platformFee;

        document.getElementById('consultationFee').textContent = `₹${consultationFee}`;
        document.getElementById('totalFee').textContent = `₹${totalFee}`;
    }

    setupForm() {
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearValidation(field));
        });
    }

    setMinDate() {
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const minDate = tomorrow.toISOString().split('T')[0];
            dateInput.min = minDate;
            
            // Set max date to 30 days from now
            const maxDate = new Date(today);
            maxDate.setDate(maxDate.getDate() + 30);
            dateInput.max = maxDate.toISOString().split('T')[0];
        }
    }

    prefillUserData() {
        if (this.currentUser && this.currentUser.profile) {
            const profile = this.currentUser.profile;
            
            document.getElementById('patientName').value = this.currentUser.name || '';
            document.getElementById('patientEmail').value = this.currentUser.email || '';
            document.getElementById('patientPhone').value = profile.phone || '';
            document.getElementById('patientAge').value = profile.age || '';
            
            if (profile.gender) {
                const genderRadio = document.querySelector(`input[name="gender"][value="${profile.gender}"]`);
                if (genderRadio) {
                    genderRadio.checked = true;
                }
            }
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        const appointment = this.createAppointment(formData);
        
        this.saveAppointment(appointment);
        this.showSuccessMessage(appointment);
        
        setTimeout(() => {
            window.location.href = 'user.html';
        }, 3000);
    }

    validateForm() {
        const form = document.getElementById('appointmentForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Additional validations
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        
        if (appointmentDate && appointmentTime) {
            if (!this.isTimeSlotAvailable(appointmentDate, appointmentTime)) {
                this.showError('Selected time slot is not available. Please choose another time.');
                isValid = false;
            }
        }

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
        } else if (field.type === 'number' && value) {
            const num = parseInt(value);
            if (field.id === 'patientAge' && (num < 1 || num > 120)) {
                this.showFieldError(field, 'Please enter a valid age (1-120)');
                isValid = false;
            }
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

    isTimeSlotAvailable(date, time) {
        // Check if the time slot is already booked for this doctor
        const existingAppointment = this.appointments.find(apt => 
            apt.doctorId === this.selectedDoctor.id &&
            apt.date === date &&
            apt.time === time &&
            apt.status === 'Scheduled'
        );
        
        return !existingAppointment;
    }

    getFormData() {
        return {
            patientName: document.getElementById('patientName').value.trim(),
            patientPhone: document.getElementById('patientPhone').value.trim(),
            patientEmail: document.getElementById('patientEmail').value.trim(),
            patientAge: document.getElementById('patientAge').value,
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            symptoms: document.getElementById('symptoms').value.trim(),
            medicalHistory: document.getElementById('medicalHistory').value.trim()
        };
    }

    createAppointment(formData) {
        return {
            id: this.generateId(),
            userId: this.currentUser.id,
            doctorId: this.selectedDoctor.id,
            doctorName: this.selectedDoctor.name,
            specialty: this.selectedDoctor.specialty,
            patientName: formData.patientName,
            patientPhone: formData.patientPhone,
            patientEmail: formData.patientEmail,
            patientAge: formData.patientAge,
            gender: formData.gender,
            date: formData.appointmentDate,
            time: formData.appointmentTime,
            symptoms: formData.symptoms,
            medicalHistory: formData.medicalHistory,
            fee: this.selectedDoctor.fee,
            platformFee: 29,
            totalFee: this.selectedDoctor.fee + 29,
            status: 'Scheduled',
            createdAt: new Date().toISOString(),
            appointmentNumber: this.generateAppointmentNumber()
        };
    }

    saveAppointment(appointment) {
        this.appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }

    showSuccessMessage(appointment) {
        const successHTML = `
            <div class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 9999; min-width: 400px;">
                <h5><i class="fa-solid fa-check-circle me-2"></i>Appointment Booked Successfully!</h5>
                <p class="mb-1"><strong>Appointment Number:</strong> ${appointment.appointmentNumber}</p>
                <p class="mb-1"><strong>Doctor:</strong> ${appointment.doctorName}</p>
                <p class="mb-1"><strong>Date & Time:</strong> ${appointment.date} at ${appointment.time}</p>
                <p class="mb-0">Redirecting to your appointments...</p>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed';
        errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateAppointmentNumber() {
        const prefix = 'APT';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `${prefix}${timestamp}${random}`;
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
                image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300",
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
                image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300",
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
                image: "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=300",
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
                image: "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=300",
                rating: 4.9,
                experience: "14 years"
            }
        ];
    }
}

// Initialize appointment booking
document.addEventListener('DOMContentLoaded', () => {
    window.appointmentBooking = new AppointmentBooking();
});