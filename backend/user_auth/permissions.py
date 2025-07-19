from rest_framework import permissions

class IsInGroup(permissions.BasePermission):
    """
    Allows access only to users in a specific group.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        required_groups = getattr(view, 'required_groups', [])
        return request.user.groups.filter(name__in=required_groups).exists()