from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    """
    Allows access only to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsTrainerUserRole(BasePermission):
    """
    Allows access only to users with the 'trainer' or 'admin' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['trainer', 'admin'])

class IsMemberUserRole(BasePermission):
    """
    Allows access to authenticated members, trainers, and admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
