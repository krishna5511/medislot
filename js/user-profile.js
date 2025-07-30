// User profile management
class UserProfile {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.setupProfileForm();
        this.loadUserData();
        this.setupProfilePicture();
        this.loadAppointments();
        this.setupLogout();
    }

    setupProfileForm() {
        const form = document.querySelector('.patient-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Bio textarea
        const bioTextarea = document.getElementById('userBio');
        if (bioTextarea) {
            bioTextarea.addEventListener('blur', () => this.saveBio());
        }
    }

    loadUserData() {
        const profile = this.currentUser.profile || {};
        
        // Fill form fields
        const fields = {
            'fullName': this.currentUser.name,
            'email': this.currentUser.email,
            'contact': profile.phone,
            'age': profile.age,
            'address': profile.address,
            'weight': profile.weight,
            'height': profile.height
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field && value) {
                field.value = value;
            }
        });

        // Set gender radio button
        if (profile.gender) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${profile.gender}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
            }
        }

        // Set bio
        const bioTextarea = document.getElementById('userBio');
        if (bioTextarea && profile.bio) {
            bioTextarea.value = profile.bio;
        }
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedProfile = {
            phone: document.getElementById('contact').value,
            age: document.getElementById('age').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            address: document.getElementById('address').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            bio: document.getElementById('userBio').value
        };

        // Update current user
        this.currentUser.name = document.getElementById('fullName').value;
        this.currentUser.email = document.getElementById('email').value;
        this.currentUser.profile = { ...this.currentUser.profile, ...updatedProfile };

        // Update in localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...this.currentUser, password: users[userIndex].password };
            localStorage.setItem('users', JSON.stringify(users));
        }

        this.showMessage('Profile updated successfully!', 'success');
    }

    setupProfilePicture() {
        const profilePicInput = document.getElementById('profilePicInput');
        const profilePreview = document.getElementById('profilePreview');

        if (profilePicInput && profilePreview) {
            profilePicInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profilePreview.src = e.target.result;
                        // Save to localStorage (in production, upload to server)
                        this.currentUser.profilePicture = e.target.result;
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Load existing profile picture
            if (this.currentUser.profilePicture) {
                profilePreview.src = this.currentUser.profilePicture;
            }
        }
    }

    loadAppointments() {
        const appointmentsList = document.querySelector('.appointments-list');
        if (!appointmentsList) return;

        const userAppointments = this.appointments.filter(apt => apt.userId === this.currentUser.id);
        
        if (userAppointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments scheduled yet.</p>';
            return;
        }

        const appointmentsHTML = userAppointments.map(appointment => `
            <div class="appointment-card mb-3 p-3 border rounded">
                <div class="row">
                    <div class="col-md-8">
                        <h5>${appointment.doctorName}</h5>
                        <p class="mb-1"><strong>Specialty:</strong> ${appointment.specialty}</p>
                        <p class="mb-1"><strong>Date:</strong> ${appointment.date}</p>
                        <p class="mb-1"><strong>Time:</strong> ${appointment.time}</p>
                        <p class="mb-1"><strong>Status:</strong> 
                            <span class="badge bg-${this.getStatusColor(appointment.status)}">${appointment.status}</span>
                        </p>
                    </div>
                    <div class="col-md-4 text-end">
                        <p class="mb-2"><strong>Fee:</strong> ₹${appointment.fee}</p>
                        ${appointment.status === 'Scheduled' ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="userProfile.cancelAppointment('${appointment.id}')">
                                Cancel
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        appointmentsList.innerHTML = appointmentsHTML;
    }

    cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const appointmentIndex = this.appointments.findIndex(apt => apt.id === appointmentId);
            if (appointmentIndex !== -1) {
                this.appointments[appointmentIndex].status = 'Cancelled';
                localStorage.setItem('appointments', JSON.stringify(this.appointments));
                this.loadAppointments();
                this.showMessage('Appointment cancelled successfully', 'success');
            }
        }
    }

    getStatusColor(status) {
        switch (status) {
            case 'Scheduled': return 'primary';
            case 'Completed': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'secondary';
        }
    }

    saveBio() {
        const bioTextarea = document.getElementById('userBio');
        if (bioTextarea) {
            this.currentUser.profile = this.currentUser.profile || {};
            this.currentUser.profile.bio = bioTextarea.value;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    setupLogout() {
        // Add logout functionality to user menu
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-sm btn-outline-light ms-2';
            logoutBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i>';
            logoutBtn.title = 'Logout';
            logoutBtn.onclick = () => {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }
            };
            userIcon.appendChild(logoutBtn);
        }
    }

    showMessage(message, type) {
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

// Initialize user profile
document.addEventListener('DOMContentLoaded', () => {
    window.userProfile = new UserProfile();
});