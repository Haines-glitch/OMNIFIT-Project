from django.urls import path
from .views import (
    TrainerListCreateView,
    TrainerDetailView,
    AssignMemberToTrainerView,
    MembersForTrainerAssignmentView,
    PendingMembersView,
    ApproveMemberView,
    RejectMemberView
)

urlpatterns = [
    path('', TrainerListCreateView.as_view(), name='trainer_list_create'),
    path('available-members/', MembersForTrainerAssignmentView.as_view(), name='available_members'),
    path('pending-members/', PendingMembersView.as_view(), name='trainer_pending_members'),
    path('approve-member/', ApproveMemberView.as_view(), name='trainer_approve_member'),
    path('reject-member/', RejectMemberView.as_view(), name='trainer_reject_member'),
    path('assign-member/', AssignMemberToTrainerView.as_view(), name='trainer_assign_member_alt'),
    path('<int:pk>/', TrainerDetailView.as_view(), name='trainer_detail'),
    path('<int:pk>/assign-member/', AssignMemberToTrainerView.as_view(), name='trainer_assign_member'),
]

