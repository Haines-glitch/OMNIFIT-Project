import time
from tests.pages.login_page import LoginPage
from tests.config import Config

class TestRoleAccess:

    def test_tc_role_001_member_access(self, driver):
        """MEMBER: Cannot access admin or trainer dashboards"""
        login_page = LoginPage(driver)
        login_page.login(Config.TEST_MEMBER_EMAIL, Config.TEST_MEMBER_PASSWORD)
        time.sleep(1)

        # Attempt to access admin dashboard
        driver.get(f"{Config.FRONTEND_URL}/admin-dashboard")
        time.sleep(1)
        assert "admin" not in driver.current_url.lower()

        # Attempt to access trainer dashboard
        driver.get(f"{Config.FRONTEND_URL}/trainer-dashboard")
        time.sleep(1)
        assert "trainer" not in driver.current_url.lower()

    def test_tc_role_004_unauth_access(self, driver):
        """UNAUTHENTICATED: Cannot access protected dashboards"""
        driver.get(f"{Config.FRONTEND_URL}/member-dashboard")
        time.sleep(1)
        assert "member-dashboard" not in driver.current_url.lower()

        driver.get(f"{Config.FRONTEND_URL}/admin-dashboard")
        time.sleep(1)
        assert "admin-dashboard" not in driver.current_url.lower()
