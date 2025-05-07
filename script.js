// Khi trang đã load xong toàn bộ DOM
// Sử dụng để đảm bảo các phần tử đã sẵn sàng cho thao tác JS

// Lắng nghe sự kiện DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admin-form'); // Lấy form thông tin admin
    const imageUpload = document.getElementById('image-upload'); // Lấy input file ảnh
    const profilePreview = document.getElementById('profile-preview'); // Lấy thẻ img hiển thị ảnh đại diện

    // Xử lý upload ảnh đại diện khi người dùng chọn file mới
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0]; // Lấy file đầu tiên được chọn
        if (file) {
            const reader = new FileReader(); // Tạo đối tượng FileReader để đọc file
            reader.onload = function(e) {
                profilePreview.src = e.target.result; // Hiển thị ảnh vừa chọn lên giao diện
            }
            reader.readAsDataURL(file); // Đọc file dưới dạng base64
        }
    });

    // Xử lý khi người dùng submit form
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn reload trang mặc định của form

        // Lấy giá trị từ các trường trong form
        const formData = {
            fullname: document.getElementById('fullname').value, // Họ và tên
            gender: document.getElementById('gender').value, // Giới tính
            birthdate: document.getElementById('birthdate').value, // Ngày sinh
            phone: document.getElementById('phone').value, // Số điện thoại
            email: document.getElementById('email').value, // Email
            profileImage: profilePreview.src // Ảnh đại diện (base64 hoặc link)
        };

        // Kiểm tra dữ liệu hợp lệ trước khi lưu
        if (!validateForm(formData)) {
            return;
        }

        // Lưu dữ liệu vào localStorage của trình duyệt
        localStorage.setItem('adminProfile', JSON.stringify(formData));

        // Thông báo thành công cho người dùng
        alert('Thông tin đã được lưu thành công!');
    });

    // Khi load trang, tự động lấy dữ liệu đã lưu (nếu có)
    loadSavedData();
});

// Hàm kiểm tra dữ liệu hợp lệ trước khi lưu
// Trả về true nếu hợp lệ, false nếu có lỗi và hiển thị thông báo
function validateForm(data) {
    // Kiểm tra họ tên
    if (!data.fullname || data.fullname.trim().length < 2) {
        alert('Vui lòng nhập họ và tên hợp lệ');
        return false;
    }
    // Kiểm tra giới tính
    if (!data.gender) {
        alert('Vui lòng chọn giới tính');
        return false;
    }
    // Kiểm tra ngày sinh
    if (!data.birthdate) {
        alert('Vui lòng nhập ngày sinh');
        return false;
    }
    // Kiểm tra số điện thoại (10 số)
    if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
        alert('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
        return false;
    }
    // Kiểm tra định dạng email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        alert('Vui lòng nhập email hợp lệ');
        return false;
    }
    return true;
}

// Hàm load dữ liệu đã lưu từ localStorage và hiển thị lên form
// Nếu có dữ liệu, sẽ tự động điền vào các trường của form và hiển thị ảnh đại diện
function loadSavedData() {
    const savedData = localStorage.getItem('adminProfile'); // Lấy dữ liệu từ localStorage
    if (savedData) {
        const data = JSON.parse(savedData); // Chuyển từ JSON sang object
        document.getElementById('fullname').value = data.fullname || '';
        document.getElementById('gender').value = data.gender;
        document.getElementById('birthdate').value = data.birthdate;
        document.getElementById('phone').value = data.phone;
        document.getElementById('email').value = data.email;
        if (data.profileImage) {
            document.getElementById('profile-preview').src = data.profileImage; // Hiển thị lại ảnh đại diện đã lưu
        }
    }
} 