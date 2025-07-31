# medislot

MediSlot is a comprehensive medical appointment booking website with enhanced user profile management, email verification, and modern responsive design.

## Features

### User Management
- **User Registration & Login**: Secure authentication system with password hashing
- **Email Verification**: Automated email verification system for new registrations
- **Profile Management**: Complete user profile with picture upload, personal details, and bio
- **Secure Logout**: Proper session management and secure logout functionality

### Design & UI
- **Responsive Design**: Fully responsive using Bootstrap 5
- **Modern Interface**: Clean, user-friendly design with gradient backgrounds
- **Reusable Components**: Modular navbar component used across all pages
- **Mobile Optimized**: Optimized for mobile devices and tablets

### Technical Features
- **Modular Architecture**: Well-organized file structure with separate concerns
- **Database Integration**: MySQL database with proper relationships
- **Email System**: SMTP email functionality for notifications
- **Security**: Input sanitization, password hashing, and secure sessions
- **Error Handling**: Comprehensive error handling and user feedback

## File Structure

```
medislot/
├── config/
│   ├── database.php          # Database configuration
│   └── email.php            # Email/SMTP configuration
├── includes/
│   ├── functions.php        # Common utility functions
│   ├── email_functions.php  # Email sending functions
│   └── navbar.php          # Reusable navigation component
├── auth/
│   ├── register.php         # User registration
│   ├── login.php           # User login
│   ├── logout.php          # Secure logout handler
│   └── verify_email.php    # Email verification handler
├── uploads/
│   └── profiles/           # Profile picture uploads
├── database/
│   └── schema.sql          # Database schema
└── profile.php             # Enhanced user profile page
```

## Setup Instructions

### 1. Database Setup
```sql
-- Import the database schema
mysql -u root -p < database/schema.sql
```

### 2. Configuration
Update the configuration files:

**config/database.php**:
```php
private $host = 'localhost';
private $db_name = 'medislot_db';
private $username = 'your_db_username';
private $password = 'your_db_password';
```

**config/email.php**:
```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SITE_URL', 'http://your-domain.com');
```

### 3. File Permissions
```bash
chmod 755 uploads/profiles/
```

### 4. Email Setup (Gmail Example)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Use the App Password in the email configuration

## Key Features Explained

### Email Verification System
- Sends HTML-formatted verification emails upon registration
- Secure token-based verification
- Automatic account activation upon email verification
- Resend verification option for unverified accounts

### Profile Management
- Profile picture upload with image preview
- Complete personal information management
- Bio section for user description
- Real-time form validation
- Responsive design for all devices

### Security Features
- Password hashing using PHP's `password_hash()`
- Input sanitization for all user inputs
- Secure session management
- CSRF protection ready structure
- File upload validation and security

### Responsive Navigation
- Fixed-top navigation with backdrop blur effect
- User dropdown with profile picture
- Mobile-optimized hamburger menu
- Active page highlighting
- Search functionality integration

## Usage

### For Users
1. **Register**: Create account with email verification
2. **Login**: Access your account securely
3. **Profile**: Complete your profile with picture and details
4. **Appointments**: Book and manage medical appointments
5. **Logout**: Secure session termination

### For Developers
1. **Modular Design**: Easy to extend and maintain
2. **Clean Code**: Well-commented and organized
3. **Database Ready**: Proper schema with relationships
4. **Email Ready**: SMTP integration for notifications
5. **Responsive**: Bootstrap 5 integration

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.
