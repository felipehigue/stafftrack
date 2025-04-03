from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Usuario(AbstractUser):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo_electronico = models.EmailField(unique=True)
    cargo = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    groups = models.ManyToManyField(
        Group,
        verbose_name=('groups'),
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="stafftrack_usuarios",  # Añade un related_name único
        related_query_name="stafftrack_usuario",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="stafftrack_usuario_permissions",  # Añade un related_name único
        related_query_name="stafftrack_usuario_permission",
    )

    USERNAME_FIELD = 'correo_electronico'
    REQUIRED_FIELDS = ['username', 'nombre', 'apellido']

    def __str__(self):
        return f'{self.nombre} {self.apellido}'