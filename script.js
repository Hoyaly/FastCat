// Đợi cho đến khi toàn bộ nội dung trang được tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    // Lấy đường dẫn hiện tại
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('index.html') || currentPath.endsWith('/');
    
    // Nếu không phải trang đăng nhập và chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!isLoginPage && (!savedEmail || !savedPassword)) {
        window.location.href = 'index.html';
        return;
    }

    // Lấy các phần tử của form đăng nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberCheckbox = document.getElementById('remember');
        
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

            // Kiểm tra tài khoản admin
            if (email === 'hoyaly123@gmail.com' && password === 'hoyaly') {
                if (remember) {
                    localStorage.setItem('savedEmail', email);
                    localStorage.setItem('savedPassword', password);
                } else {
                    localStorage.removeItem('savedEmail');
                    localStorage.removeItem('savedPassword');
                }
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({ email: email, isAdmin: true }));
                window.location.replace('home.html');
                return;
            }

            // Kiểm tra với các tài khoản đã đăng ký
            const registeredAccounts = JSON.parse(localStorage.getItem('registeredAccounts')) || [];
            const account = registeredAccounts.find(acc => acc.email === email && acc.password === password);

            if (!account) {
                alert('Email hoặc mật khẩu không đúng');
                return;
            }

            if (remember) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('savedPassword', password);
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('savedPassword');
            }
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ email: email, isAdmin: false }));
            window.location.replace('home.html');
        });
    }

    // Xử lý sự kiện đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Xóa thông tin đăng nhập đã lưu
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
            localStorage.removeItem('isLoggedIn');
            // Chuyển hướng về trang đăng nhập
            window.location.href = 'index.html';
        });
    }

    // Xử lý thêm vào giỏ hàng trên trang Home
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const productCards = document.querySelectorAll('.product-card');
    if (addToCartButtons.length && productCards.length) {
        addToCartButtons.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                // Kiểm tra đăng nhập
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) {
                    alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
                    window.location.href = 'index.html';
                    return;
                }

                // Lấy thông tin sản phẩm từ card
                const card = productCards[idx];
                const name = card.querySelector('h3').innerText;
                const price = card.querySelector('.price').innerText;
                const img = card.querySelector('img').getAttribute('src');

                // Tạo đối tượng sản phẩm
                const product = { name, price, img, quantity: 1 };

                // Lấy giỏ hàng của người dùng hiện tại
                const userCart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];

                // Kiểm tra sản phẩm đã có trong giỏ chưa
                const found = userCart.find(item => item.name === name);
                if (found) {
                    found.quantity += 1;
                } else {
                    userCart.push(product);
                }

                // Lưu lại giỏ hàng của người dùng
                localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(userCart));
                alert('Đã thêm vào giỏ hàng!');
            });
        });
    }

    // Hiển thị giỏ hàng trên trang cart.html
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    if (cartItemsContainer && cartSummary) {
        function renderCart() {
            // Lấy thông tin người dùng hiện tại
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }

            // Lấy giỏ hàng của người dùng
            let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
            cartItemsContainer.innerHTML = '';
            let subtotal = 0;
            cart.forEach((item, idx) => {
                subtotal += parseInt(item.price.replace(/\D/g, '')) * item.quantity;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-idx="${idx}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-idx="${idx}">+</button>
                    </div>
                    <button class="remove-item" data-idx="${idx}">Xóa</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            // Tính tổng
            const shipping = cart.length > 0 ? 50000 : 0;
            const total = subtotal + shipping;
            cartSummary.innerHTML = `
                <h2>Tổng cộng</h2>
                <div class="summary-item">
                    <span>Tạm tính:</span>
                    <span>${subtotal.toLocaleString()}đ</span>
                </div>
                <div class="summary-item">
                    <span>Phí vận chuyển:</span>
                    <span>${shipping.toLocaleString()}đ</span>
                </div>
                <div class="summary-item total">
                    <span>Thành tiền:</span>
                    <span>${total.toLocaleString()}đ</span>
                </div>
                <button class="checkout-btn" ${cart.length === 0 ? 'disabled' : ''}>Thanh toán</button>
            `;
        }

        // Sự kiện tăng/giảm/xóa sản phẩm
        cartItemsContainer.addEventListener('click', (e) => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }

            let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
            if (e.target.classList.contains('quantity-btn')) {
                const idx = +e.target.getAttribute('data-idx');
                const action = e.target.getAttribute('data-action');
                if (action === 'increase') cart[idx].quantity++;
                if (action === 'decrease' && cart[idx].quantity > 1) cart[idx].quantity--;
                localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
                renderCart();
            }
            if (e.target.classList.contains('remove-item')) {
                const idx = +e.target.getAttribute('data-idx');
                cart.splice(idx, 1);
                localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
                renderCart();
            }
        });

        renderCart();
    }

    // User menu handling
    function updateUserMenu() {
        const userDropdown = document.getElementById('userDropdown');
        const userIcon = document.querySelector('.user-icon');
        
        // Chỉ thực hiện nếu tìm thấy các phần tử
        if (userDropdown) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const isAdmin = currentUser && currentUser.email === 'hoyaly123@gmail.com';

            if (isLoggedIn && currentUser) {
                // Lấy thông tin avatar của người dùng
                const userInfo = JSON.parse(localStorage.getItem(`userInfo_${currentUser.email}`)) || {};
                
                // Nếu có avatar tùy chỉnh, thay thế icon mặc định
                if (userIcon && userInfo.avatar) {
                    userIcon.style.display = 'none';
                    // Tạo và thêm avatar tùy chỉnh
                    let customAvatar = document.querySelector('.custom-avatar');
                    if (!customAvatar) {
                        customAvatar = document.createElement('img');
                        customAvatar.className = 'custom-avatar';
                        userIcon.parentNode.insertBefore(customAvatar, userIcon);
                    }
                    customAvatar.src = userInfo.avatar;
                } else if (userIcon) {
                    // Nếu không có avatar tùy chỉnh, hiển thị icon mặc định
                    userIcon.style.display = 'block';
                    const customAvatar = document.querySelector('.custom-avatar');
                    if (customAvatar) {
                        customAvatar.remove();
                    }
                }

                let menuContent = '';
                if (isAdmin) {
                    menuContent = `
                        <a href="admin.html">Quản lý</a>
                        <a href="info.html">Thông tin cá nhân</a>
                        <a href="#" id="logoutBtn">Đăng xuất</a>
                    `;
                } else {
                    menuContent = `
                        <a href="info.html">Thông tin cá nhân</a>
                        <a href="#" id="logoutBtn">Đăng xuất</a>
                    `;
                }
                userDropdown.innerHTML = menuContent;
            } else {
                // Khi đăng xuất, hiển thị lại icon mặc định
                if (userIcon) {
                    userIcon.style.display = 'block';
                    const customAvatar = document.querySelector('.custom-avatar');
                    if (customAvatar) {
                        customAvatar.remove();
                    }
                }
                userDropdown.innerHTML = `
                    <a href="index.html">Đăng nhập</a>
                    <a href="register.html">Đăng ký</a>
                `;
            }
        }
    }

    // Call updateUserMenu when page loads
    updateUserMenu();

    // Handle logout
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            updateUserMenu();
            window.location.href = 'index.html';
        }
    });

    // Handle info form submission
    const infoForm = document.querySelector('.info-form');
    if (infoForm) {
        // Lấy thông tin người dùng hiện tại
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // Lấy thông tin đã lưu của người dùng
        const userInfo = JSON.parse(localStorage.getItem(`userInfo_${currentUser.email}`)) || {};
        
        // Điền thông tin đã lưu vào form
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');
        const avatarPreview = document.getElementById('avatar-preview');

        if (nameInput) nameInput.value = userInfo.name || '';
        if (phoneInput) phoneInput.value = userInfo.phone || '';
        if (addressInput) addressInput.value = userInfo.address || '';
        if (avatarPreview && userInfo.avatar) avatarPreview.src = userInfo.avatar;

        infoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy thông tin từ form
            const formData = {
                name: nameInput ? nameInput.value : '',
                phone: phoneInput ? phoneInput.value : '',
                address: addressInput ? addressInput.value : '',
                avatar: avatarPreview ? avatarPreview.src : ''
            };

            // Lưu thông tin vào localStorage với key riêng cho từng người dùng
            localStorage.setItem(`userInfo_${currentUser.email}`, JSON.stringify(formData));
            
            alert('Thông tin đã được lưu thành công!');
        });
    }

    // Handle avatar upload
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');

    if (avatarInput && avatarPreview) {
        // Lấy thông tin người dùng hiện tại
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Lấy thông tin đã lưu của người dùng
            const userInfo = JSON.parse(localStorage.getItem(`userInfo_${currentUser.email}`)) || {};
            if (userInfo.avatar) {
                avatarPreview.src = userInfo.avatar;
            }
        }

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Xử lý form đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Kiểm tra không cho phép đăng ký tài khoản admin
            if (email === 'hoyaly123@gmail.com') {
                alert('Không thể đăng ký tài khoản admin');
                return;
            }

            // Kiểm tra định dạng email
            const gmailRegex = /^[^\s@]+@gmail\.com$/;
            if (!gmailRegex.test(email)) {
                alert('Email không đúng định dạng, vui lòng nhập lại email có đuôi @gmail.com');
                return;
            }

            // Kiểm tra mật khẩu
            if (password.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự');
                return;
            }

            // Kiểm tra xác nhận mật khẩu
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp');
                return;
            }

            // Lấy danh sách tài khoản đã đăng ký
            const registeredAccounts = JSON.parse(localStorage.getItem('registeredAccounts')) || [];

            // Kiểm tra email đã tồn tại chưa
            if (registeredAccounts.some(acc => acc.email === email)) {
                alert('Email này đã được đăng ký. Vui lòng sử dụng email khác.');
                return;
            }

            // Thêm tài khoản mới vào danh sách
            registeredAccounts.push({
                email: email,
                password: password
            });

            // Lưu danh sách tài khoản
            localStorage.setItem('registeredAccounts', JSON.stringify(registeredAccounts));
            console.log('Account registered successfully');

            alert('Đăng ký thành công');
            window.location.href = 'index.html';
        });
    } else {
        console.log('Register form not found');
    }
}); 