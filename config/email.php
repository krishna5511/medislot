<?php
/**
 * Email Configuration
 * SMTP settings for sending verification emails
 */

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com'); // Replace with your email
define('SMTP_PASSWORD', 'your-app-password'); // Replace with your app password
define('SMTP_FROM_EMAIL', 'your-email@gmail.com');
define('SMTP_FROM_NAME', 'MediSlot');

// Site configuration
define('SITE_URL', 'http://localhost:3000'); // Replace with your site URL
define('SITE_NAME', 'MediSlot');
?>