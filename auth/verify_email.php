<?php
/**
 * Email Verification Handler
 * Verifies user email addresses using tokens
 */

session_start();
require_once '../config/database.php';
require_once '../includes/functions.php';

$message = '';
$success = false;

if (isset($_GET['token']) && !empty($_GET['token'])) {
    $token = sanitizeInput($_GET['token']);
    
    $database = new Database();
    $pdo = $database->getConnection();

    // Find user with this verification token
    $stmt = $pdo->prepare("
        SELECT id, name, email, email_verified 
        FROM users 
        WHERE verification_token = ? AND email_verified = 0
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Verify the email
        $stmt = $pdo->prepare("
            UPDATE users 
            SET email_verified = 1, verification_token = NULL, email_verified_at = NOW() 
            WHERE id = ?
        ");
        
        if ($stmt->execute([$user['id']])) {
            $message = 'Email verified successfully! You can now login to your account.';
            $success = true;
        } else {
            $message = 'Verification failed. Please try again or contact support.';
        }
    } else {
        $message = 'Invalid or expired verification token.';
    }
} else {
    $message = 'No verification token provided.';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - MediSlot</title>
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
        
        .verification-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        
        .verification-header {
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 40px;
        }
        
        .verification-header.error {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
        }
        
        .verification-body {
            padding: 40px;
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
        <div class="verification-card mx-auto">
            <div class="verification-header <?php echo $success ? '' : 'error'; ?>">
                <i class="fas <?php echo $success ? 'fa-check-circle' : 'fa-times-circle'; ?> fa-4x mb-3"></i>
                <h2 class="mb-0">Email Verification</h2>
            </div>
            
            <div class="verification-body">
                <div class="alert alert-<?php echo $success ? 'success' : 'danger'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>

                <div class="mt-4">
                    <?php if ($success): ?>
                        <a href="../login.php" class="btn btn-primary btn-lg me-3">
                            <i class="fas fa-sign-in-alt me-2"></i>Login Now
                        </a>
                    <?php else: ?>
                        <a href="../register.php" class="btn btn-primary btn-lg me-3">
                            <i class="fas fa-user-plus me-2"></i>Register Again
                        </a>
                    <?php endif; ?>
                    
                    <a href="../index.php" class="btn btn-outline-secondary btn-lg">
                        <i class="fas fa-home me-2"></i>Go Home
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>