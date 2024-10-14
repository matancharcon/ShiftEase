from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
import random
random_number = random.randint(1, 10000)
options = webdriver.ChromeOptions()
chrome_options = Options()
# options = [
#     "--headless",
#     "--window-size=1920,1200",
#     "--no-sandbox",
# ]
# for option in options:
#   chrome_options.add_argument(option)
chrome_options.add_argument("--window-size=1920,1200")
chrome_options.add_argument("--no-sandbox")
url = "http://localhost:8080"
se = ChromeService(ChromeDriverManager().install())
driver = webdriver.Chrome(service=se, options=chrome_options)
driver.get(url)

def test_login_alerts():
    driver.find_element(By.ID, "email").send_keys("charconmatan@gmail.co")
    driver.find_element(By.ID, "password").send_keys("1511998")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    try:
        error = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#root > div > p"))
        )
        result = error.text
    except TimeoutException:
        exit(1)
    
    assert result == "Invalid credentials"

def test_login():
    driver.get(url)
    driver.find_element(By.ID, "email").send_keys("charconmatan@gmail.com")
    driver.find_element(By.ID, "password").send_keys("1511998")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    
    try:
        title = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#root > div > h1"))
        )
        result = title.text
    except TimeoutException:
        exit(1)
    
    assert result == "Weekly Work Arrangements", "Title is not correct"


def test_adding_new_user():
    driver.find_element(By.CSS_SELECTOR, "#navbarNav > ul > li:nth-child(7) > a").click()
    driver.find_element(By.ID, "full_name").send_keys(f"test user{random_number}")
    driver.find_element(By.ID, "email").send_keys(f"test{random_number}@gmail.com")
    driver.find_element(By.ID, "password1").send_keys("1511998")
    driver.find_element(By.ID, "password2").send_keys("1511998")
    driver.find_element(By.ID, "is_admin").click()
    driver.find_element(By.CLASS_NAME, "btn-primary").click()
    try:
        title = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "alert-success"))
        )
        result = title.text
    except TimeoutException:
        exit(1)
    
    assert result == "Sign up successful!"

def test_verify_user_in_list():
    driver.find_element(By.CSS_SELECTOR, "#navbarNav > ul > li:nth-child(6) > a").click()
    try: 
        WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, "//table")))   
        user_row = driver.find_element(By.XPATH, f"//tr[td[contains(text(), 'test user{random_number}')]]")

        # Get the table data cells in the row
        user_data = user_row.find_elements(By.TAG_NAME, "td")

        # Check each field (full name, email, role, admin status)
        assert user_data[0].text == f"test user{random_number}"
        assert user_data[1].text == f"test{random_number}@gmail.com"
        assert user_data[2].text == "waiter"
        assert user_data[3].text == "Yes"
    except TimeoutException:
        exit(1)       


def test_quit():
    driver.quit()
    