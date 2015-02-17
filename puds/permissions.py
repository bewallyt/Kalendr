from rest_framework import permissions


class IsAuthorOfPud(permissions.BasePermission):
    def has_object_permission(self, request, view, post):
        if request.user:
            return post.author == request.user
        return False
