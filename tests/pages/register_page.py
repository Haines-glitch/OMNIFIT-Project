from selenium.webdriver.common.by import By
from tests.pages.base_page import BasePage
from tests.config import Config

class RegisterPage(BasePage):
    # Locators
    FULLNAME_INPUT = (By.CSS_SELECTOR, "[data-testid='register-fullname-input']")
    EMAIL_INPUT = (By.CSS_SELECTOR, "[data-testid='register-email-input']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "[data-testid='register-password-input']")
    CONFIRM_PASSWORD_INPUT = (By.CSS_SELECTOR, "[data-testid='register-confirm-password-input']")
    TERMS_CHECKBOX = (By.CSS_SELECTOR, "[data-testid='register-terms-checkbox']")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "[data-testid='register-submit-button']")
    
    TOAST_MESSAGE = (By.CSS_SELECTOR, "[data-testid='toast-message']")

    def get_toast_message_text(self):
        if self.is_visible(self.TOAST_MESSAGE, timeout=5):
            return self.get_text(self.TOAST_MESSAGE)
        return None

    def open(self):
        self.driver.get(f"{Config.FRONTEND_URL}/register")

    def enter_fullname(self, name):
        self.enter_text(self.FULLNAME_INPUT, name)

    def enter_email(self, email):
        self.enter_text(self.EMAIL_INPUT, email)

    def enter_password(self, password):
        self.enter_text(self.PASSWORD_INPUT, password)

    def enter_confirm_password(self, password):
        self.enter_text(self.CONFIRM_PASSWORD_INPUT, password)
        
    def check_terms(self):
        # Only click if not already checked
        checkbox = self.find_element(self.TERMS_CHECKBOX)
        if not checkbox.is_selected():
            self.click(self.TERMS_CHECKBOX)

    def click_terms(self):
        self.check_terms()

    def click_register(self):
        self.click(self.SUBMIT_BUTTON)
    
    def register_member(self, name, email, password):
        self.open()
        self.enter_fullname(name)
        self.enter_email(email)
        self.enter_password(password)
        self.enter_confirm_password(password)
        self.check_terms()
        self.click_register()
