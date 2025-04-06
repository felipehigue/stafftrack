from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator

class Departamento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.nombre

class Cargo(models.Model):
    nombre = models.CharField(max_length=100)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='cargos')
    descripcion = models.TextField(blank=True, null=True)
    nivel_jerarquico = models.PositiveSmallIntegerField(default=1)
    
    def __str__(self):
        return f"{self.nombre} ({self.departamento})"

class Empleado(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('LICENCIA', 'En licencia'),
    ]
    
    codigo_empleado = models.CharField(max_length=20, unique=True, validators=[MinLengthValidator(3)])
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    cargo = models.ForeignKey(Cargo, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_ingreso = models.DateField()
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVO')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.nombre_completo} - {self.codigo_empleado}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"
    
    def save(self, *args, **kwargs):
        if not self.codigo_empleado:  # Solo si no tiene código
            last_employee = Empleado.objects.order_by('-id').first()
            last_id = last_employee.id if last_employee else 0
            self.codigo_empleado = f"EMP-{last_id + 1:04d}"
        super().save(*args, **kwargs)