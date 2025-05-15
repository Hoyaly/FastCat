from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# TC_ADM_PROD_001: Verify product addition is successful with valid data
# Preconditions: Admin is logged in and on admin product management page

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

    # 5. Nhấp vào nút 'People'
    user_icon = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "user-icon"))
    )
    user_icon.click()

    # 6. Nhấp vào "Quản lý"
    manage_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Quản lý"))
    )
    manage_link.click()
    
    # Đợi trang quản lý tải xong
    WebDriverWait(driver, 10).until(EC.url_contains("admin.html"))

    # 7. Nhấp vào nút 'Thêm sản phẩm'
    add_product_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Thêm sản phẩm')]"))
    )
    add_product_btn.click()

    # 8. Nhập tên sản phẩm vào ô "Tên sản phẩm"
    name_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "productName"))
    )
    name_input.clear()
    name_input.send_keys("Test test")

    # 9. Nhập giá vào ô "Giá"
    price_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "productPrice"))
    )
    price_input.clear()
    price_input.send_keys("250000")

    # 10. Nhấp vào nút "Chọn tệp" và chọn ảnh
    file_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "productImage"))
    )
    file_input.send_keys(r"D:\Picture\Tùm lum\Mèow.jpg")
    time.sleep(2)  # Đợi preview ảnh

    # 11. Nhấp vào nút 'Thêm'
    try:
        # Thử tìm nút bằng nhiều cách khác nhau
        add_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
    except:
        try:
            add_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
            )
        except:
            add_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Thêm')]"))
            )
    
    # Đảm bảo nút hiển thị và có thể click
    driver.execute_script("arguments[0].scrollIntoView(true);", add_btn)
    time.sleep(1)  # Đợi scroll hoàn tất
    add_btn.click()

    # Đợi thêm sản phẩm hoàn tất
    time.sleep(3)

    # Kiểm tra thông báo thành công
    success_message = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'thành công') or contains(text(), 'success')]"))
    )
    assert success_message.is_displayed(), "Không thấy thông báo thành công"

    # 12. Quay lại trang chủ
    home_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Home')]"))
    )
    home_link.click()

    # 13. Cuộn xuống để kiểm tra sản phẩm mới
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)

    # Xác minh sản phẩm mới đã được thêm vào danh sách
    new_product = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'product-card')]//h3[contains(text(), 'Test test')]"))
    )
    assert new_product.is_displayed(), "Sản phẩm mới chưa xuất hiện trong danh sách"

    print("TC_ADM_PROD_001: Verify product addition is successful with valid data: PASSED")

except Exception as e:
    print(f"Test thất bại: {str(e)}")
    raise

finally:
    driver.quit() 