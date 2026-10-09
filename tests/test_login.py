import time
import pytest
from tests.pages.login_page import LoginPage
from tests.pages.member_dashboard_page import MemberDashboardPage
from tests.config import Config

class TestLogin:
    
    def test_tc_login_001_valid_login(self, driver):
        """TC_LOGIN_001: Valid login"""
        login_page = LoginPage(driver)
        login_page.login(Config.TEST_MEMBER_EMAIL, Config.TEST_MEMBER_PASSWORD)
        
        # Verify successful authentication toast
        assert "successful" in login_page.get_toast_message_text().lower()
        
        # Verify correct dashboard is displayed
        dashboard = MemberDashboardPage(driver)
        dashboard.wait_for_load()
        assert "member-dashboard" in dashboard.get_current_url()

    def test_tc_login_002_invalid_password(self, driver):
        """TC_LOGIN_002: Invalid password"""
        login_page = LoginPage(driver)
        login_page.login(Config.TEST_MEMBER_EMAIL, "WrongPass123!")
        time.sleep(1) # wait for toast
        error_text = login_page.get_toast_message_text()
        assert error_text is not None
        assert "invalid" in error_text.lower() or "mismatch" in error_text.lower()
        assert "member-dashboard" not in login_page.get_current_url()

    def test_tc_login_003_invalid_email(self, driver):
        """TC_LOGIN_003: Invalid email"""
        login_page = LoginPage(driver)
        login_page.login("nonexistent@omnifit.com", Config.TEST_MEMBER_PASSWORD)
        time.sleep(1)
        error_text = login_page.get_toast_message_text()
        assert error_text is not None
        assert "invalid" in error_text.lower()

    def test_tc_login_004_empty_credentials(self, driver):
        """TC_LOGIN_004: Empty credentials"""
        login_page = LoginPage(driver)
        login_page.open()
        login_page.click_login()
        time.sleep(1)
        error_text = login_page.get_toast_message_text()
        assert "enter both" in error_text.lower()

    def test_tc_login_005_logout(self, driver):
        """TC_LOGIN_005: Logout"""
        login_page = LoginPage(driver)
        login_page.login(Config.TEST_MEMBER_EMAIL, Config.TEST_MEMBER_PASSWORD)
        
        dashboard = MemberDashboardPage(driver)
        dashboard.wait_for_load()
        dashboard.logout()
        
        time.sleep(1)
        assert "login" in login_page.get_current_url() or "member-dashboard" not in login_page.get_current_url()
