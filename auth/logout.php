<?php
/**
 * Logout Handler
 * Securely destroys user session and redirects to login
 */

session_start();

// Destroy all session data
$_SESSION = array();

// Delete the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// Set a flash message for the login page
session_start();
setFlashMessage('success', 'You have been successfully logged out.');

// Redirect to login page
header('Location: ../login.php');
exit();
?>