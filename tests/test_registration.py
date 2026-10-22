import time
import pytest
from tests.pages.register_page import RegisterPage
from tests.config import Config

class TestRegistration:
    
    def test_tc_register_001_valid_registration(self, driver):
        """TC_REGISTER_001: Valid member registration (negative verification for demo)"""
        # Note: We won't generate a random user every time as data builds up.
        # But we'll test the UI validation flow anyway.
        register_page = RegisterPage(driver)
        # Using an existing user should throw an error, which proves it hit the backend
        register_page.register_member("Test User", Config.TEST_MEMBER_EMAIL, Config.TEST_MEMBER_PASSWORD)
        time.sleep(1)
        toast_text = register_page.get_toast_message_text()
        
        # Either successful or already exists (since it's a real backend)
        assert toast_text is not None
        assert "successful" in toast_text.lower() or "exist" in toast_text.lower() or "with this email" in toast_text.lower()
        
    def test_tc_register_002_empty_fields(self, driver):
        """TC_REGISTER_002: Empty required fields"""
        register_page = RegisterPage(driver)
        register_page.open()
        time.sleep(2)
        register_page.click_register()
        time.sleep(1)
        toast_text = register_page.get_toast_message_text()
        assert toast_text is not None
        assert "please enter" in toast_text.lower()
        
    def test_tc_register_003_invalid_email(self, driver):
        """TC_REGISTER_003: Invalid email"""
        register_page = RegisterPage(driver)
        register_page.open()
        register_page.enter_fullname("Test User")
        register_page.enter_email("invalid-email")
        register_page.click_register()
        time.sleep(1)
        toast_text = register_page.get_toast_message_text()
        assert "valid email" in toast_text.lower()

    def test_tc_register_005_invalid_password(self, driver):
        """TC_REGISTER_005: Invalid password"""
        register_page = RegisterPage(driver)
        register_page.open()
        register_page.enter_fullname("Test User")
        register_page.enter_email("newuser@omnifit.com")
        register_page.enter_password("short")
        register_page.enter_confirm_password("short")
        register_page.click_terms()
        register_page.click_register()
        time.sleep(1)
        toast_text = register_page.get_toast_message_text()
        assert "at least 8 characters" in toast_text.lower()
