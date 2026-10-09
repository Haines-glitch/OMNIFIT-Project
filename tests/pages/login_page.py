from selenium.webdriver.common.by import By
from tests.pages.base_page import BasePage
from tests.config import Config

class LoginPage(BasePage):
    # Locators mapped to data-testids
    EMAIL_INPUT = (By.CSS_SELECTOR, "[data-testid='login-email-input']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "[data-testid='login-password-input']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "[data-testid='login-submit-button']")
    HOME_BUTTON = (By.CSS_SELECTOR, "[data-testid='login-home-btn']")

    # Toast Notifications
    TOAST_MESSAGE = (By.CLASS_NAME, 'toast-message')

    # Logged In State Elements
    GOTO_DASHBOARD_BTN = (By.CSS_SELECTOR, "[data-testid='goto-dashboard-btn']")
    LOGOUT_BTN = (By.CSS_SELECTOR, "[data-testid='logout-btn']")

    def open(self):
        self.driver.get(f"{Config.FRONTEND_URL}/login")

    def enter_email(self, email):
        self.enter_text(self.EMAIL_INPUT, email)

    def enter_password(self, password):
        self.enter_text(self.PASSWORD_INPUT, password)

    def click_login(self):
        self.click(self.LOGIN_BUTTON)
    
    def click_logout(self):
        self.click(self.LOGOUT_BTN)

    def login(self, email, password):
        self.open()
        
        # Check if already logged in, if so, logout first
        if self.is_visible(self.LOGOUT_BTN):
            self.click_logout()
            self.open()
            
        self.enter_email(email)
        self.enter_password(password)
        self.click_login()
        
    def get_toast_message_text(self):
        if self.is_visible(self.TOAST_MESSAGE):
            return self.get_text(self.TOAST_MESSAGE)
        return None
