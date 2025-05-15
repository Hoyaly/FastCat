from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# TC_CART_001: Xác minh thêm sản phẩm vào giỏ hàng trống
# Preconditions: Người dùng đã đăng nhập và giỏ hàng trống

driver = webdriver.Chrome()

try:
    # 1. Mở trang đăng nhập
    driver.get("https://hoyaly.github.io/FastCat/index.html")
    driver.maximize_window()

    # 2. Nhập email và mật khẩu
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    email_input.clear()
    email_input.send_keys("hoyaly123@gmail.com")
    
    password_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    password_input.clear()
    password_input.send_keys("hoyaly")

    # 3. Nhấp vào hộp kiểm
    checkbox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='checkbox']"))
    )
    if not checkbox.is_selected():
        checkbox.click()

    # 4. Nhấp vào hộp đăng nhập
    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Đăng nhập')]"))
    )
    login_button.click()
    
    # Đợi đăng nhập hoàn tất
    WebDriverWait(driver, 10).until(EC.url_contains("home.html"))

    # 5. Nhấp vào nút 'Thêm vào giỏ hàng' cho 'Hạt cho chó'
    product_card = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'product-card')]//h3[contains(text(), 'Hạt cho chó')]/ancestor::div[contains(@class, 'product-card')]"))
    )
    
    add_to_cart_btn = product_card.find_element(By.XPATH, ".//button[contains(text(), 'Thêm vào giỏ')]")
    add_to_cart_btn.click()

    # Đợi 3 giây sau khi thêm vào giỏ hàng
    time.sleep(3)

    # 6. Nhấn vào "Giỏ hàng" trên thanh điều hướng
    cart_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Giỏ hàng')]"))
    )
    cart_link.click()
    
    # Đợi chuyển đến trang giỏ hàng
    WebDriverWait(driver, 10).until(EC.url_to_be("https://hoyaly.github.io/FastCat/cart.html"))

    # Xác minh sản phẩm đã được thêm vào giỏ hàng
    product_name = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'cart-item')]//h3[contains(text(), 'Hạt cho chó')]"))
    )
    assert product_name.is_displayed(), "Sản phẩm chưa được thêm vào giỏ hàng"
    time.sleep(3)
    print("TC_CART_001: Xác minh thêm sản phẩm vào giỏ hàng trống: PASSED")

except Exception as e:
    print(f"Test thất bại: {str(e)}")
    raise

finally:
    driver.quit() 