// Doctors page functionality
class DoctorsPage {
    constructor() {
        this.doctors = this.getDoctorsData();
        this.filteredDoctors = [...this.doctors];
        this.init();
    }

    init() {
        this.setupFilters();
        this.loadDoctors();
        this.handleURLParams();
    }

    setupFilters() {
        const specialtyFilter = document.getElementById('specialtyFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => this.filterDoctors());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.sortDoctors());
        }

        // Search functionality
        const searchForm = document.querySelector('form[role="search"]');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.searchDoctors();
            });

            const searchInput = searchForm.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.searchDoctors());
            }
        }
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const specialty = urlParams.get('specialty');
        const search = urlParams.get('search');

        if (specialty) {
            const specialtyFilter = document.getElementById('specialtyFilter');
            if (specialtyFilter) {
                specialtyFilter.value = specialty;
                this.filterDoctors();
            }
        }

        if (search) {
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.value = search;
                this.searchDoctors();
            }
        }
    }

    filterDoctors() {
        const specialtyFilter = document.getElementById('specialtyFilter');
        const selectedSpecialty = specialtyFilter.value;

        if (selectedSpecialty) {
            this.filteredDoctors = this.doctors.filter(doctor => 
                doctor.specialty === selectedSpecialty
            );
        } else {
            this.filteredDoctors = [...this.doctors];
        }

        this.sortDoctors();
    }

    searchDoctors() {
        const searchInput = document.querySelector('input[type="search"]');
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm) {
            this.filteredDoctors = this.doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm) ||
                doctor.specialty.toLowerCase().includes(searchTerm) ||
                doctor.location.toLowerCase().includes(searchTerm)
            );
        } else {
            this.filteredDoctors = [...this.doctors];
        }

        this.sortDoctors();
    }

    sortDoctors() {
        const sortFilter = document.getElementById('sortFilter');
        const sortBy = sortFilter.value;

        switch (sortBy) {
            case 'name':
                this.filteredDoctors.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                this.filteredDoctors.sort((a, b) => b.rating - a.rating);
                break;
            case 'experience':
                this.filteredDoctors.sort((a, b) => 
                    parseInt(b.experience) - parseInt(a.experience)
                );
                break;
            case 'fee':
                this.filteredDoctors.sort((a, b) => a.fee - b.fee);
                break;
        }

        this.renderDoctors();
    }

    loadDoctors() {
        this.renderDoctors();
    }

    renderDoctors() {
        const doctorsGrid = document.getElementById('doctorsGrid');
        if (!doctorsGrid) return;

        if (this.filteredDoctors.length === 0) {
            doctorsGrid.innerHTML = `
                <div class="col-12">
                    <div class="no-doctors">
                        <i class="fa-solid fa-user-doctor fa-3x mb-3"></i>
                        <h3>No doctors found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            `;
            return;
        }

        const doctorsHTML = this.filteredDoctors.map(doctor => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="doctor-card">
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image" 
                         onerror="this.src='https://via.placeholder.com/300x250?text=Doctor+Image'">
                    <div class="doctor-info">
                        <h3 class="doctor-name">${doctor.name}</h3>
                        <p class="doctor-specialty">${doctor.specialty}</p>
                        
                        <div class="doctor-details">
                            <div class="mb-2">
                                <i class="fa-solid fa-graduation-cap"></i>
                                ${doctor.qualification}
                            </div>
                            <div class="mb-2">
                                <i class="fa-solid fa-location-dot"></i>
                                ${doctor.location}
                            </div>
                            <div class="mb-2">
                                <i class="fa-solid fa-clock"></i>
                                ${doctor.timing}
                            </div>
                            <div class="mb-2">
                                <i class="fa-solid fa-briefcase"></i>
                                ${doctor.experience} experience
                            </div>
                        </div>

                        <div class="rating">
                            <div class="stars">
                                ${this.generateStars(doctor.rating)}
                            </div>
                            <span class="rating-text">${doctor.rating} (${Math.floor(Math.random() * 100) + 50} reviews)</span>
                        </div>

                        <div class="fee-section">
                            <div class="fee">₹${doctor.fee}</div>
                            <button class="btn book-btn" onclick="doctorsPage.bookAppointment(${doctor.id})">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        doctorsGrid.innerHTML = doctorsHTML;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fa-solid fa-star"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="fa-regular fa-star"></i>';
        }

        return starsHTML;
    }

    bookAppointment(doctorId) {
        const doctor = this.doctors.find(d => d.id === doctorId);
        if (doctor) {
            const params = new URLSearchParams({
                doctorId: doctor.id,
                doctor: doctor.name,
                specialty: doctor.specialty,
                fee: doctor.fee
            });
            window.location.href = `appointment.html?${params.toString()}`;
        }
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

// Initialize doctors page
document.addEventListener('DOMContentLoaded', () => {
    window.doctorsPage = new DoctorsPage();
});