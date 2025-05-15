from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# TC_INFO_001: Verify successful update of user information with valid data
# Preconditions: User is on the login page

driver = webdriver.Chrome()

try:
    # 1. Open login page
    driver.get("https://hoyaly.github.io/FastCat/index.html")
    driver.maximize_window()

    # 2. Enter email and password
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

    # 3. Click on the checkbox
    checkbox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='checkbox']"))
    )
    if not checkbox.is_selected():
        checkbox.click()

    # 4. Click on the login button
    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Đăng nhập')]"))
    )
    login_button.click()
    
    # Wait for login to complete
    WebDriverWait(driver, 10).until(EC.url_contains("home.html"))

    # 5. Click on the 'Person' button
    user_icon = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "user-icon"))
    )
    user_icon.click()

    # 6. Click on "Personal information"
    personal_info_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Thông tin cá nhân"))
    )
    personal_info_link.click()
    
    # Wait for info page to load
    WebDriverWait(driver, 10).until(EC.url_contains("info.html"))

    # 7. Update name
    name_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "name"))
    )
    name_input.clear()
    name_input.send_keys("Ngoc Nhi")

    # 8. Update phone number
    phone_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "phone"))
    )
    phone_input.clear()
    phone_input.send_keys("0123456789")

    # 9. Update address
    address_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "address"))
    )
    address_input.clear()
    address_input.send_keys("Sao Hoa")

    # 10. Click on the 'Lưu thông tin' button
    save_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Lưu thông tin')]"))
    )
    save_btn.click()

    # Verify success message
    success = False
    try:
        # First try to find alert
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert_text = alert.text.lower()
        if "thành công" in alert_text or "success" in alert_text:
            success = True
            alert.accept()
    except:
        try:
            # If no alert, look for success message on page
            success_msg = WebDriverWait(driver, 5).until(
                EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'thành công') or contains(text(), 'success')]"))
            )
            if success_msg.is_displayed():
                success = True
        except:
            success = False

    # Verify updated information
    name_val = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "name"))
    ).get_attribute("value")
    
    phone_val = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "phone"))
    ).get_attribute("value")
    
    address_val = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "address"))
    ).get_attribute("value")

    # Verify all assertions
    assert name_val == "Ngoc Nhi", f"Expected name 'Ngoc Nhi', got '{name_val}'"
    assert phone_val == "0123456789", f"Expected phone '0123456789', got '{phone_val}'"
    assert address_val == "Sao Hoa", f"Expected address 'Sao Hoa', got '{address_val}'"
    assert success, "Success message not found!"

    print("TC_INFO_001: Verify successful update of user information with valid data: PASSED")

except Exception as e:
    print(f"Test failed: {str(e)}")
    raise

finally:
    driver.quit() 