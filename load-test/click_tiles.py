import time
import sys


from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

from config import config

def start_webdriver():
    """Starts the webdriver (headless chrome browser)

    Parameters
    ----------
    
    Returns
    -------
    driver : webdriver instance
        headless chrome browser instancee
    """
    chrome_options = webdriver.ChromeOptions()
    #chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu") 
    driver = webdriver.Chrome(executable_path="./chromedriver", options=chrome_options)
    return driver


def check_login(driver, username, password):
    """Logs into the Microsoft Portal in order to have the correct authorization to the SharePoint site
    
    Parameters
    ----------
    driver : webdriver instance
        headless chrome browser instance

    Returns
    ---------
    true
        if the login was successful
    false
        if the login was not successful
    
    """
    time.sleep(1)

    username_elem = driver.find_element_by_name("loginfmt")
    if username_elem is None:
        #No login is required
        return
    username_elem.send_keys(username)

    next_btn = driver.find_element_by_id("idSIButton9")
    driver.execute_script("arguments[0].click();", next_btn)
    time.sleep(2)

    password_elem = driver.find_element_by_id("i0118")
    if password_elem is None:
        return
    password_elem.send_keys(password)

    submit_btn = driver.find_element_by_id("idSIButton9")
    driver.execute_script("arguments[0].click();", submit_btn)

    time.sleep(2)

    stay_logged_in = driver.find_element_by_id("idSIButton9")
    if stay_logged_in is not None:
        driver.execute_script("arguments[0].click();", stay_logged_in)
    time.sleep(1)


def click_tiles(driver):
    tile_elements = driver.find_elements_by_class_name("col_c037d329")
    for i in range(5):
        element = tile_elements[i]
        element.click()
        time.sleep(0.5)
    time.sleep(2)
    ActionChains(driver).send_keys(Keys.ESCAPE).perform()
    for i in range(5, 10):
        element = tile_elements[i]
        element.click()
        time.sleep(0.5)
    process_nbr = sys.argv[3]
    print("Process Id: " + str(process_nbr) + ". Tiles Clicked. Exiting")
    time.sleep(2)
    driver.quit()
            
def main(username, password):
    driver = start_webdriver()
    site = "https://devdomainer.sharepoint.com/sites/anton-test-site"
    site1 = "https://devdomainer.sharepoint.com/sites/anton-test-site/SitePages/BingoBangoBongo.aspx"
    driver.get(site)
    check_login(driver, username, password)
    driver.get(site1)
    time.sleep(10)
    click_tiles(driver)

if __name__ == '__main__': 
    username = sys.argv[1]
    password = sys.argv[2]
    driver = start_webdriver()
    site = "https://devdomainer.sharepoint.com/sites/anton-test-site"
    site1 = "https://devdomainer.sharepoint.com/sites/anton-test-site/SitePages/BingoBangoBongo.aspx"
    driver.get(site)
    check_login(driver, username, password)
    driver.get(site1)
    time.sleep(10)
    click_tiles(driver)