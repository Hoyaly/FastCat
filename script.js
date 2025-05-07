// Đợi cho đến khi toàn bộ nội dung trang được tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử của form đăng nhập
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // Lấy thông tin email và mật khẩu đã lưu trong localStorage (nếu có)
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    // Nếu có thông tin đã lưu, tự động điền vào form và tích vào ô nhớ mật khẩu
    if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }

    // Lắng nghe sự kiện submit của form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn chặn hành vi submit mặc định (reload trang)

        // Lấy giá trị người dùng nhập vào
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Kiểm tra định dạng email phải là @gmail.com
        const gmailRegex = /^[^\s@]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            alert('Email không đúng định dạng, vui lòng nhập lại email có đuôi @gmail.com');
            return;
        }

        // Kiểm tra mật khẩu phải có ít nhất 6 ký tự
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        // Nếu người dùng chọn "Ghi nhớ đăng nhập", lưu thông tin vào localStorage
        if (remember) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
        } else {
            // Nếu không, xóa thông tin đã lưu (nếu có)
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }

        // Xử lý đăng nhập (ở đây chỉ hiển thị thông báo thành công)
        console.log('Đăng nhập với:', { email, password, remember });
        alert('Đăng nhập thành công!');
    });
}); 