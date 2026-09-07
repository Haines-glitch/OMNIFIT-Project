from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, 
    RegisterView, 
    LogoutView, 
    UserProfileView,
    ChangePasswordView,
    UserProfileUpdateView,
    TrainerOverviewView,
    TrainerAssignRoutineView,
    MemberOverviewView,
    MemberTodayWorkoutView,
    NotificationsView,
    NotificationMarkReadView,
    AdminDashboardView
)

urlpatterns = [
    # Auth Endpoints
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('user-profile/', UserProfileView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='auth_profile_update'),

    # Trainer Endpoints
    path('trainer/overview/', TrainerOverviewView.as_view(), name='trainer_overview'),
    path('trainer/assign-routine/', TrainerAssignRoutineView.as_view(), name='trainer_assign_routine'),

    # Member Endpoints
    path('member/overview/', MemberOverviewView.as_view(), name='member_overview'),
    path('member/today-workout/', MemberTodayWorkoutView.as_view(), name='member_today_workout'),

    # Notifications Endpoints
    path('notifications/', NotificationsView.as_view(), name='notifications_list'),
    path('notifications/mark-read/', NotificationMarkReadView.as_view(), name='notifications_mark_read'),

    # Admin Endpoint
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]



