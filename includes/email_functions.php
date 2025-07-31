<?php
/**
 * Email Functions
 * Functions for sending verification and notification emails
 */

require_once 'config/email.php';

/**
 * Send email using PHP mail function (basic implementation)
 * For production, consider using PHPMailer or similar library
 * 
 * @param string $to
 * @param string $subject
 * @param string $message
 * @param array $headers
 * @return bool
 */
function sendEmail($to, $subject, $message, $headers = []) {
    // Default headers
    $defaultHeaders = [
        'From: ' . SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
        'Reply-To: ' . SMTP_FROM_EMAIL,
        'Content-Type: text/html; charset=UTF-8',
        'MIME-Version: 1.0'
    ];
    
    $allHeaders = array_merge($defaultHeaders, $headers);
    $headerString = implode("\r\n", $allHeaders);
    
    return mail($to, $subject, $message, $headerString);
}

/**
 * Send email verification
 * @param string $email
 * @param string $name
 * @param string $token
 * @return bool
 */
function sendVerificationEmail($email, $name, $token) {
    $subject = 'Verify Your Email - ' . SITE_NAME;
    $verificationUrl = SITE_URL . '/verify_email.php?token=' . $token;
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1A1C22, #5A5C6A); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>' . SITE_NAME . '</h1>
                <p>Email Verification Required</p>
            </div>
            <div class="content">
                <h2>Hello ' . htmlspecialchars($name) . ',</h2>
                <p>Thank you for registering with ' . SITE_NAME . '. To complete your registration, please verify your email address by clicking the button below:</p>
                <p style="text-align: center;">
                    <a href="' . $verificationUrl . '" class="button">Verify Email Address</a>
                </p>
                <p>If the button doesn\'t work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">' . $verificationUrl . '</p>
                <p>This verification link will expire in 24 hours for security reasons.</p>
                <p>If you didn\'t create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ' . date('Y') . ' ' . SITE_NAME . '. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';
    
    return sendEmail($email, $subject, $message);
}

/**
 * Send password reset email
 * @param string $email
 * @param string $name
 * @param string $token
 * @return bool
 */
function sendPasswordResetEmail($email, $name, $token) {
    $subject = 'Password Reset Request - ' . SITE_NAME;
    $resetUrl = SITE_URL . '/reset_password.php?token=' . $token;
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1A1C22, #5A5C6A); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>' . SITE_NAME . '</h1>
                <p>Password Reset Request</p>
            </div>
            <div class="content">
                <h2>Hello ' . htmlspecialchars($name) . ',</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <p style="text-align: center;">
                    <a href="' . $resetUrl . '" class="button">Reset Password</a>
                </p>
                <p>If the button doesn\'t work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #dc3545;">' . $resetUrl . '</p>
                <p>This reset link will expire in 1 hour for security reasons.</p>
                <p>If you didn\'t request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ' . date('Y') . ' ' . SITE_NAME . '. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';
    
    return sendEmail($email, $subject, $message);
}
?>