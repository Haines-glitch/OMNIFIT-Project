from django.urls import path
from .views import (
    TrainerListCreateView,
    TrainerDetailView,
    AssignMemberToTrainerView,
    MembersForTrainerAssignmentView
)

urlpatterns = [
    path('', TrainerListCreateView.as_view(), name='trainer_list_create'),
    path('available-members/', MembersForTrainerAssignmentView.as_view(), name='available_members'),
    path('assign-member/', AssignMemberToTrainerView.as_view(), name='trainer_assign_member_alt'),
    path('<int:pk>/', TrainerDetailView.as_view(), name='trainer_detail'),
    path('<int:pk>/assign-member/', AssignMemberToTrainerView.as_view(), name='trainer_assign_member'),
]
