import time
from tests.pages.login_page import LoginPage
from tests.pages.member_dashboard_page import MemberDashboardPage
from tests.config import Config

class TestMemberDashboard:
    
    def test_tc_member_001_dashboard_loads(self, driver):
        """Verify dashboard loads and essential elements are accessible"""
        login_page = LoginPage(driver)
        login_page.login(Config.TEST_MEMBER_EMAIL, Config.TEST_MEMBER_PASSWORD)
        
        dashboard = MemberDashboardPage(driver)
        dashboard.wait_for_load()
        
        # Verify navigating to Workout
        dashboard.click_workout_tab()
        time.sleep(1) # wait for render
        assert dashboard.is_visible(MemberDashboardPage.WORKOUT_TAB)
        
        # Verify navigating to Diet
        dashboard.click_diet_tab()
        time.sleep(1)
        assert dashboard.is_visible(MemberDashboardPage.DIET_TAB)

        # Logout
        dashboard.logout()
