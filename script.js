// Giỏ hàng
let cartCount = 0;
const cartIcon = document.querySelector('.cart-icon');

// Tạo badge số lượng trên icon giỏ hàng
function updateCartBadge() {
    let badge = document.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartIcon.parentNode.appendChild(badge);
    }
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'inline-block' : 'none';
}

// Xử lý thêm vào giỏ hàng
function handleAddToCart() {
    cartCount++;
    updateCartBadge();
    alert('Đã thêm vào giỏ hàng!');
}

document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
});

// Tìm kiếm sản phẩm
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(keyword)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Đảm bảo badge hiển thị đúng khi tải lại trang
updateCartBadge();

// Nút "Mua ngay" scroll xuống sản phẩm
const buyNowBtn = document.getElementById('buyNowBtn');
buyNowBtn.addEventListener('click', function() {
    window.scrollTo({ top: document.querySelector('.products').offsetTop, behavior: 'smooth' });
});
const logo = document.querySelector('.logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}