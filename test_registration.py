from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()  # Đảm bảo đã cài ChromeDriver

try:
    # 1. Truy cập trang đăng nhập
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

    # 3. Click vào checkbox
    checkbox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='checkbox']"))
    )
    if not checkbox.is_selected():
        checkbox.click()

    # 4. Click vào nút đăng nhập
    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Đăng nhập')]"))
    )
    login_button.click()

    # Đợi đăng nhập hoàn tất
    WebDriverWait(driver, 10).until(EC.url_contains("home.html"))

    # 5. Click vào People
    user_icon = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "user-icon"))
    )
    user_icon.click()

    # 6. Click vào Đăng xuất
    logout_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Đăng xuất"))
    )
    logout_link.click()

    # Đợi về lại trang đăng nhập
    WebDriverWait(driver, 10).until(EC.url_contains("index.html"))

    # 7. Click vào chữ Đăng ký
    register_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Đăng ký"))
    )
    register_link.click()

    # 8. Nhập email đăng ký
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    email_input.clear()
    email_input.send_keys("testuser@gmail.com")

    # 9. Nhập password
    password_input = driver.find_element(By.NAME, "password")
    password_input.clear()
    password_input.send_keys("password123")

    # 10. Nhập xác nhận password
    confirm_input = driver.find_element(By.NAME, "confirmPassword")
    confirm_input.clear()
    confirm_input.send_keys("password123")

    # 11. Click nút Đăng ký
    register_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Đăng ký')]")
    register_button.click()

    # 12. Kiểm tra chuyển hướng về trang đăng nhập và thông báo thành công
    WebDriverWait(driver, 10).until(
        EC.url_contains("index.html")
    )
    time.sleep(3)
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    assert "Đăng ký thành công" in alert.text or "Register successful" in alert.text
    alert.accept()
    print("Testcase TC_REG_001: PASSED")

finally:
    driver.quit() 