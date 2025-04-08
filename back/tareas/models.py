from django.db import models
from django.utils import timezone
from gestionpersonal.models import Empleado, Departamento  # Importamos los modelos existentes

class Tarea(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROGRESO', 'En progreso'),
        ('COMPLETADA', 'Completada'),
    ]

    PRIORIDAD_CHOICES = [
        ('BAJA', 'Baja'),
        ('MEDIA', 'Media'),
        ('ALTA', 'Alta'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    empleado = models.ForeignKey(
        Empleado,
        on_delete=models.CASCADE,
        related_name='tareas_asignadas'
    )
    departamento = models.ForeignKey(
        Departamento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tareas_departamento'
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE'
    )
    prioridad = models.CharField(
        max_length=20,
        choices=PRIORIDAD_CHOICES,
        default='MEDIA'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField(blank=True, null=True)
    fecha_completada = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = 'Tarea'
        verbose_name_plural = 'Tareas'

    def __str__(self):
        return self.titulo

    @property
    def completada(self):
        return self.estado == 'COMPLETADA'

    def save(self, *args, **kwargs):
        if self.estado == 'COMPLETADA' and not self.fecha_completada:
            self.fecha_completada = timezone.now()
        elif self.estado != 'COMPLETADA' and self.fecha_completada:
            self.fecha_completada = None
        super().save(*args, **kwargs)
