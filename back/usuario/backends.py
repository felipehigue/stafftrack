# usuario/backends.py
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()

class EmailAuthBackend(ModelBackend):
    """Autenticación por email"""
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(
                Q(email__iexact=username) | 
                Q(username__iexact=username)
            )
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None