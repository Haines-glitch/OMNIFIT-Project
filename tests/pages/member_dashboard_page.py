from selenium.webdriver.common.by import By
from tests.pages.base_page import BasePage
import time

class MemberDashboardPage(BasePage):
    # Sidebar navigation links (assuming they use semantic text or icons) 
    # I'll rely on XPath with text for the tabs or icons if we know them from Sidebar.jsx
    # We can use the button texts from the Member Dashboard directly. 
    WORKOUT_TAB = (By.XPATH, "//span[text()='Workouts' or text()='Workout' or contains(text(), 'Workout')]/ancestor::button | //button[contains(., 'Workout')]")
    DIET_TAB = (By.XPATH, "//span[text()='Diet Plan' or text()='Diet' or contains(text(), 'Diet')]/ancestor::button | //button[contains(., 'Diet')]")
    PROFILE_TAB = (By.XPATH, "//span[text()='Profile' or contains(text(), 'Profile')]/ancestor::button | //button[contains(., 'Profile')]")
    LOGOUT_BTN = (By.CSS_SELECTOR, "[data-testid='logout-btn']")
    
    # On the dashboard page itself
    WORKOUT_ACTION_BTN = (By.XPATH, "//button[contains(., \"Log Today's Workout\")]")
    DIET_ACTION_BTN = (By.XPATH, "//button[contains(., 'View AI Diet Plan')]")

    # Member Info
    MEMBER_NAME_HEADER = (By.CSS_SELECTOR, "h1")

    def wait_for_load(self):
        self.wait.until(lambda d: "member-dashboard" in d.current_url)
        # Give a small moment for any animations/loading
        time.sleep(1)
        
    def click_workout_tab(self):
        try:
            self.click(self.WORKOUT_ACTION_BTN)
        except:
            self.click(self.WORKOUT_TAB)
            
    def click_diet_tab(self):
        try:
            self.click(self.DIET_ACTION_BTN)
        except:
            self.click(self.DIET_TAB)

    def logout(self):
        self.click(self.LOGOUT_BTN)
