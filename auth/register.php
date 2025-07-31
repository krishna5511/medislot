<?php
/**
 * User Registration Page
 * Handles user registration with email verification
 */

session_start();
require_once '../config/database.php';
require_once '../includes/functions.php';
require_once '../includes/email_functions.php';

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: ../profile.php');
    exit();
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get and sanitize input
    $name = sanitizeInput($_POST['name']);
    $email = sanitizeInput($_POST['email']);
    $phone = sanitizeInput($_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (empty($email) || !isValidEmail($email)) {
        $errors[] = 'Valid email is required';
    }

    if (empty($phone)) {
        $errors[] = 'Phone number is required';
    }

    if (empty($password)) {
        $errors[] = 'Password is required';
    } elseif (strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters long';
    }

    if ($password !== $confirm_password) {
        $errors[] = 'Passwords do not match';
    }

    // Check if email already exists
    if (empty($errors)) {
        $database = new Database();
        $pdo = $database->getConnection();

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            $errors[] = 'Email already registered';
        }
    }

    // Register user if no errors
    if (empty($errors)) {
        try {
            $hashed_password = hashPassword($password);
            $verification_token = generateToken();
            
            $stmt = $pdo->prepare("
                INSERT INTO users (name, email, phone, password, verification_token, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([$name, $email, $phone, $hashed_password, $verification_token]);

            // Send verification email
            if (sendVerificationEmail($email, $name, $verification_token)) {
                $success = 'Registration successful! Please check your email to verify your account.';
            } else {
                $success = 'Registration successful! However, we couldn\'t send the verification email. Please contact support.';
            }

        } catch (PDOException $e) {
            $errors[] = 'Registration failed. Please try again.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - MediSlot</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #1A1C22, #5A5C6A, #A7A8B2);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 0;
        }
        
        .register-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
        }
        
        .register-header {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .register-body {
            padding: 40px;
        }
        
        .form-control {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
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
    </style>
</head>
<body>
    <div class="container">
        <div class="register-card mx-auto">
            <div class="register-header">
                <h2 class="mb-0"><i class="fas fa-user-plus me-2"></i>Create Account</h2>
                <p class="mb-0 mt-2">Join MediSlot today</p>
            </div>
            
            <div class="register-body">
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            <?php foreach ($errors as $error): ?>
                                <li><?php echo htmlspecialchars($error); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="alert alert-success">
                        <?php echo htmlspecialchars($success); ?>
                    </div>
                    <div class="text-center">
                        <a href="../login.php" class="btn btn-primary">Go to Login</a>
                    </div>
                <?php else: ?>
                    <form method="POST" action="">
                        <div class="mb-3">
                            <label for="name" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="name" name="name" 
                                   value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>" required>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="email" name="email" 
                                   value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" required>
                        </div>

                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" class="form-control" id="phone" name="phone" 
                                   value="<?php echo isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; ?>" required>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                            <div class="form-text">Password must be at least 6 characters long</div>
                        </div>

                        <div class="mb-4">
                            <label for="confirm_password" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-user-plus me-2"></i>Create Account
                            </button>
                        </div>
                    </form>

                    <div class="text-center mt-4">
                        <p>Already have an account? <a href="../login.php" class="text-primary">Login here</a></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>