from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Custom DRF permission that allows access only to users with role == 'admin' (case-insensitive).
    Returns 401 Unauthorized for unauthenticated requests, and 403 Forbidden for authenticated non-admin users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', '').lower() == 'admin'
        )

class IsTrainerRole(BasePermission):
    """
    Custom DRF permission that allows access to users with role == 'trainer' or 'admin'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', '').lower() in ['trainer', 'admin']
        )

class IsMemberRole(BasePermission):
    """
    Custom DRF permission that allows access to users with role == 'member' or 'admin'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', '').lower() in ['member', 'admin']
        )
