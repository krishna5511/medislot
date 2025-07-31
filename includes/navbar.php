<?php
/**
 * Reusable Navigation Bar
 * Responsive navbar component included on all pages
 */

// Get current page for active navigation
$current_page = basename($_SERVER['PHP_SELF']);
$user = null;

// Get user data if logged in
if (isLoggedIn()) {
    require_once 'config/database.php';
    $database = new Database();
    $pdo = $database->getConnection();
    $user = getCurrentUser($pdo);
}
?>

<nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
        <!-- Brand -->
        <a class="navbar-brand fw-bold" href="index.php">
            <i class="fas fa-heartbeat me-2"></i>MEDISLOT
        </a>

        <!-- Mobile toggle button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation items -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <!-- Home -->
                <li class="nav-item">
                    <a class="nav-link <?php echo ($current_page == 'index.php') ? 'active' : ''; ?>" 
                       href="index.php">
                        <i class="fas fa-home me-1"></i>Home
                    </a>
                </li>

                <!-- Doctors -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle <?php echo ($current_page == 'doctors.php') ? 'active' : ''; ?>" 
                       href="#" id="doctorsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-md me-1"></i>Doctors
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="doctorsDropdown">
                        <li><a class="dropdown-item" href="doctors.php">
                            <i class="fas fa-list me-2"></i>All Doctors
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">By Specialization</h6></li>
                        <li><a class="dropdown-item" href="doctors.php?specialty=General">General Physician</a></li>
                        <li><a class="dropdown-item" href="doctors.php?specialty=Cardiology">Cardiologist</a></li>
                        <li><a class="dropdown-item" href="doctors.php?specialty=Dermatology">Dermatologist</a></li>
                        <li><a class="dropdown-item" href="doctors.php?specialty=Gynecology">Gynecologist</a></li>
                    </ul>
                </li>

                <!-- Appointments -->
                <?php if (isLoggedIn()): ?>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle <?php echo ($current_page == 'appointments.php') ? 'active' : ''; ?>" 
                       href="#" id="appointmentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-calendar-alt me-1"></i>Appointments
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="appointmentsDropdown">
                        <li><a class="dropdown-item" href="appointments.php">
                            <i class="fas fa-list me-2"></i>My Appointments
                        </a></li>
                        <li><a class="dropdown-item" href="book_appointment.php">
                            <i class="fas fa-plus me-2"></i>Book New
                        </a></li>
                    </ul>
                </li>
                <?php endif; ?>

                <!-- Contact -->
                <li class="nav-item">
                    <a class="nav-link <?php echo ($current_page == 'contact.php') ? 'active' : ''; ?>" 
                       href="contact.php">
                        <i class="fas fa-envelope me-1"></i>Contact
                    </a>
                </li>
            </ul>

            <!-- Search form -->
            <form class="d-flex me-3" role="search" action="search.php" method="GET">
                <div class="input-group">
                    <input class="form-control search-input" type="search" name="q" 
                           placeholder="Search doctors..." aria-label="Search">
                    <button class="btn btn-outline-primary" type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </form>

            <!-- User menu -->
            <ul class="navbar-nav">
                <?php if (isLoggedIn() && $user): ?>
                    <!-- Logged in user menu -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" 
                           id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <?php if (!empty($user['profile_picture'])): ?>
                                <img src="<?php echo htmlspecialchars($user['profile_picture']); ?>" 
                                     alt="Profile" class="rounded-circle me-2" width="32" height="32">
                            <?php else: ?>
                                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                     style="width: 32px; height: 32px;">
                                    <i class="fas fa-user text-white"></i>
                                </div>
                            <?php endif; ?>
                            <span class="d-none d-md-inline"><?php echo htmlspecialchars($user['name']); ?></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><h6 class="dropdown-header">
                                <?php echo htmlspecialchars($user['name']); ?>
                                <?php if (!$user['email_verified']): ?>
                                    <small class="text-warning d-block">
                                        <i class="fas fa-exclamation-triangle"></i> Email not verified
                                    </small>
                                <?php endif; ?>
                            </h6></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="profile.php">
                                <i class="fas fa-user me-2"></i>My Profile
                            </a></li>
                            <li><a class="dropdown-item" href="appointments.php">
                                <i class="fas fa-calendar me-2"></i>My Appointments
                            </a></li>
                            <li><a class="dropdown-item" href="settings.php">
                                <i class="fas fa-cog me-2"></i>Settings
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="logout.php">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </a></li>
                        </ul>
                    </li>
                <?php else: ?>
                    <!-- Not logged in -->
                    <li class="nav-item">
                        <a class="nav-link" href="login.php">
                            <i class="fas fa-sign-in-alt me-1"></i>Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-primary btn-sm ms-2" href="register.php">
                            <i class="fas fa-user-plus me-1"></i>Register
                        </a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</nav>

<!-- Add some top padding to body to account for fixed navbar -->
<style>
body {
    padding-top: 80px;
}

.navbar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.navbar-brand {
    font-size: 1.5rem;
    color: #1A1C22 !important;
}

.search-input {
    border-radius: 20px 0 0 20px;
    border-right: none;
}

.search-input:focus {
    box-shadow: none;
    border-color: #007bff;
}

.btn-outline-primary {
    border-radius: 0 20px 20px 0;
    border-left: none;
}

.dropdown-menu {
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.dropdown-item {
    padding: 10px 20px;
    transition: all 0.3s ease;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
}

@media (max-width: 768px) {
    body {
        padding-top: 70px;
    }
    
    .navbar-brand {
        font-size: 1.3rem;
    }
    
    .search-input {
        border-radius: 20px;
    }
    
    .btn-outline-primary {
        border-radius: 20px;
        margin-top: 5px;
    }
}
</style>