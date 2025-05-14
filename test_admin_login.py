from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Khởi tạo trình duyệt (ở đây dùng Chrome, bạn có thể thay bằng Firefox nếu muốn)
driver = webdriver.Chrome()  # Cần cài đặt ChromeDriver

try:
    # 1. Truy cập trang đăng nhập
    driver.get("https://hoyaly.github.io/FastCat/index.html")

    # 2. Nhập email admin
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    email_input.clear()
    email_input.send_keys("hoyaly123@gmail.com")

    # 3. Nhập mật khẩu admin
    password_input = driver.find_element(By.NAME, "password")
    password_input.clear()
    password_input.send_keys("hoyaly")

    # 4. Chọn checkbox (nếu có)
    checkbox = driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
    if not checkbox.is_selected():
        checkbox.click()

    # 5. Click nút 'Đăng nhập'
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Đăng nhập')]")
    login_button.click()

    # 6. Kiểm tra chuyển hướng sang home.html
    WebDriverWait(driver, 10).until(
        EC.url_contains("home.html")
    )
    print("Redirected to home.html: PASSED")

    # 7. Kiểm tra quyền admin (ví dụ: kiểm tra menu admin xuất hiện)
    user_menu = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "user-menu"))
    )
    user_menu.click()
    dropdown = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "userDropdown"))
    )
    assert "Quản lý" in dropdown.text
    assert "Thông tin cá nhân" in dropdown.text
    assert "Đăng xuất" in dropdown.text
    print("Admin menu options: PASSED")

    print("Testcase: Verify successful login with valid admin credentials: PASSED")

finally:
    driver.quit() 