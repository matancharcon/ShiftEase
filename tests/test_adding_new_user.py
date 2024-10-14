from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService

options = webdriver.ChromeOptions()
chrome_options = Options()
options = [
    "--headless",
    "--window-size=1920,1200",
    "--no-sandbox",
]
for option in options:
  chrome_options.add_argument(option)

url = "http://localhost:8080"
se = ChromeService(ChromeDriverManager().install())
driver = webdriver.Chrome(service=se, options=chrome_options)
driver.get(url)