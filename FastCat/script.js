document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password match
    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
    }
    
    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ!');
        return;
    }
    
    // Here you can add your registration logic
    console.log('Registration attempt:', {
        fullname,
        email,
        password
    });
    
    // Example of storing user data (in a real application, this would be sent to a server)
    const userData = {
        fullname,
        email,
        password
    };
    
    // Store in localStorage (for demo purposes only)
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Show success message
    alert('Đăng ký thành công!');
    
    // Redirect to login page
    window.location.href = 'login.html';
});