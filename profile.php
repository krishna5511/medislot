<?php
/**
 * Modern User Profile Page
 * Enhanced profile management with responsive design
 */

session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Require login
requireLogin();

$database = new Database();
$pdo = $database->getConnection();
$user = getCurrentUser($pdo);

$errors = [];
$success = '';

// Handle profile update
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = sanitizeInput($_POST['name']);
    $phone = sanitizeInput($_POST['phone']);
    $address = sanitizeInput($_POST['address']);
    $date_of_birth = sanitizeInput($_POST['date_of_birth']);
    $gender = sanitizeInput($_POST['gender']);
    $bio = sanitizeInput($_POST['bio']);

    // Validation
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (empty($phone)) {
        $errors[] = 'Phone number is required';
    }

    // Handle profile picture upload
    $profile_picture = $user['profile_picture'];
    if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] == 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $filename = $_FILES['profile_picture']['name'];
        $filetype = pathinfo($filename, PATHINFO_EXTENSION);

        if (in_array(strtolower($filetype), $allowed)) {
            $upload_dir = 'uploads/profiles/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $new_filename = 'profile_' . $user['id'] . '_' . time() . '.' . $filetype;
            $upload_path = $upload_dir . $new_filename;

            if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $upload_path)) {
                // Delete old profile picture
                if ($profile_picture && file_exists($profile_picture)) {
                    unlink($profile_picture);
                }
                $profile_picture = $upload_path;
            } else {
                $errors[] = 'Failed to upload profile picture';
            }
        } else {
            $errors[] = 'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.';
        }
    }

    // Update profile if no errors
    if (empty($errors)) {
        try {
            $stmt = $pdo->prepare("
                UPDATE users 
                SET name = ?, phone = ?, address = ?, date_of_birth = ?, gender = ?, bio = ?, profile_picture = ?, updated_at = NOW()
                WHERE id = ?
            ");
            
            $stmt->execute([$name, $phone, $address, $date_of_birth, $gender, $bio, $profile_picture, $user['id']]);
            
            $success = 'Profile updated successfully!';
            $user = getCurrentUser($pdo); // Refresh user data
            
        } catch (PDOException $e) {
            $errors[] = 'Failed to update profile. Please try again.';
        }
    }
}

// Get flash message
$flash = getFlashMessage();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - MediSlot</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #1A1C22, #5A5C6A, #A7A8B2);
            min-height: 100vh;
        }

        .profile-container {
            padding: 30px 0;
        }

        .profile-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            overflow: hidden;
            margin-bottom: 30px;
        }

        .profile-header {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }

        .profile-picture-container {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
        }

        .profile-picture {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid white;
            object-fit: cover;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .profile-picture-placeholder {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid white;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .upload-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        }

        .profile-picture-container:hover .upload-overlay {
            opacity: 1;
        }

        .profile-body {
            padding: 40px;
        }

        .form-control, .form-select {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            transition: all 0.3s ease;
        }

        .form-control:focus, .form-select:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
        }

        .btn-primary {
            background: linear-gradient(45deg, #3498db, #2980b9);
            border: none;
            border-radius: 15px;
            padding: 15px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background: linear-gradient(45deg, #2980b9, #3498db);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
        }

        .verification-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .verified {
            background: rgba(39, 174, 96, 0.2);
            color: #27ae60;
            border: 2px solid rgba(39, 174, 96, 0.3);
        }

        .unverified {
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
            border: 2px solid rgba(231, 76, 60, 0.3);
        }

        .stats-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .stats-card:hover {
            transform: translateY(-5px);
        }

        .stats-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 1.5rem;
            color: white;
        }

        @media (max-width: 768px) {
            .profile-header {
                padding: 30px 20px;
            }

            .profile-body {
                padding: 30px 20px;
            }

            .profile-picture, .profile-picture-placeholder {
                width: 120px;
                height: 120px;
            }
        }
    </style>
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <div class="container profile-container">
        <!-- Flash Messages -->
        <?php if ($flash): ?>
            <div class="alert alert-<?php echo $flash['type'] == 'error' ? 'danger' : 'success'; ?> alert-dismissible fade show">
                <?php echo htmlspecialchars($flash['message']); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Error Messages -->
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger alert-dismissible fade show">
                <ul class="mb-0">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Success Message -->
        <?php if ($success): ?>
            <div class="alert alert-success alert-dismissible fade show">
                <?php echo htmlspecialchars($success); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="row">
            <!-- Profile Card -->
            <div class="col-lg-8">
                <div class="profile-card">
                    <div class="profile-header">
                        <!-- Verification Badge -->
                        <div class="verification-badge <?php echo $user['email_verified'] ? 'verified' : 'unverified'; ?>">
                            <i class="fas <?php echo $user['email_verified'] ? 'fa-check-circle' : 'fa-exclamation-triangle'; ?> me-1"></i>
                            <?php echo $user['email_verified'] ? 'Verified' : 'Unverified'; ?>
                        </div>

                        <!-- Profile Picture -->
                        <div class="profile-picture-container">
                            <?php if (!empty($user['profile_picture']) && file_exists($user['profile_picture'])): ?>
                                <img src="<?php echo htmlspecialchars($user['profile_picture']); ?>" 
                                     alt="Profile Picture" class="profile-picture" id="profilePreview">
                            <?php else: ?>
                                <div class="profile-picture-placeholder" id="profilePreview">
                                    <i class="fas fa-user"></i>
                                </div>
                            <?php endif; ?>
                            
                            <div class="upload-overlay" onclick="document.getElementById('profilePictureInput').click()">
                                <i class="fas fa-camera fa-2x text-white"></i>
                            </div>
                        </div>

                        <h2 class="mb-2"><?php echo htmlspecialchars($user['name']); ?></h2>
                        <p class="mb-0 opacity-75">
                            <i class="fas fa-envelope me-2"></i><?php echo htmlspecialchars($user['email']); ?>
                        </p>
                        <?php if (!empty($user['phone'])): ?>
                            <p class="mb-0 opacity-75">
                                <i class="fas fa-phone me-2"></i><?php echo htmlspecialchars($user['phone']); ?>
                            </p>
                        <?php endif; ?>
                    </div>

                    <div class="profile-body">
                        <form method="POST" enctype="multipart/form-data">
                            <!-- Hidden file input -->
                            <input type="file" id="profilePictureInput" name="profile_picture" 
                                   accept="image/*" style="display: none;" onchange="previewImage(this)">

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="name" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="name" name="name" 
                                           value="<?php echo htmlspecialchars($user['name']); ?>" required>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="phone" class="form-label">Phone Number</label>
                                    <input type="tel" class="form-control" id="phone" name="phone" 
                                           value="<?php echo htmlspecialchars($user['phone']); ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="date_of_birth" class="form-label">Date of Birth</label>
                                    <input type="date" class="form-control" id="date_of_birth" name="date_of_birth" 
                                           value="<?php echo htmlspecialchars($user['date_of_birth']); ?>">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="gender" class="form-label">Gender</label>
                                    <select class="form-select" id="gender" name="gender">
                                        <option value="">Select Gender</option>
                                        <option value="male" <?php echo ($user['gender'] == 'male') ? 'selected' : ''; ?>>Male</option>
                                        <option value="female" <?php echo ($user['gender'] == 'female') ? 'selected' : ''; ?>>Female</option>
                                        <option value="other" <?php echo ($user['gender'] == 'other') ? 'selected' : ''; ?>>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <textarea class="form-control" id="address" name="address" rows="3"><?php echo htmlspecialchars($user['address']); ?></textarea>
                            </div>

                            <div class="mb-4">
                                <label for="bio" class="form-label">Bio</label>
                                <textarea class="form-control" id="bio" name="bio" rows="4" 
                                          placeholder="Tell us about yourself..."><?php echo htmlspecialchars($user['bio']); ?></textarea>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="fas fa-save me-2"></i>Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Stats Sidebar -->
            <div class="col-lg-4">
                <div class="row">
                    <div class="col-12 mb-4">
                        <div class="stats-card">
                            <div class="stats-icon" style="background: linear-gradient(45deg, #3498db, #2980b9);">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <h4 class="mb-1">0</h4>
                            <p class="text-muted mb-0">Appointments</p>
                        </div>
                    </div>

                    <div class="col-12 mb-4">
                        <div class="stats-card">
                            <div class="stats-icon" style="background: linear-gradient(45deg, #27ae60, #2ecc71);">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <h4 class="mb-1">0</h4>
                            <p class="text-muted mb-0">Doctors Visited</p>
                        </div>
                    </div>

                    <div class="col-12 mb-4">
                        <div class="stats-card">
                            <div class="stats-icon" style="background: linear-gradient(45deg, #f39c12, #e67e22);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <h4 class="mb-1"><?php echo date('M Y', strtotime($user['created_at'])); ?></h4>
                            <p class="text-muted mb-0">Member Since</p>
                        </div>
                    </div>

                    <?php if (!$user['email_verified']): ?>
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <h6><i class="fas fa-exclamation-triangle me-2"></i>Email Not Verified</h6>
                            <p class="mb-2">Please verify your email to access all features.</p>
                            <a href="resend_verification.php" class="btn btn-warning btn-sm">
                                <i class="fas fa-envelope me-1"></i>Resend Verification
                            </a>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function previewImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.getElementById('profilePreview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture" class="profile-picture">`;
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>