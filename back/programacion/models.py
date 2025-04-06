# models.py en tu app de programación
from django.db import models
from django.core.exceptions import ValidationError
from gestionpersonal.models import Empleado # Importa tu modelo Empleado

class Turno(models.Model):
    empleado = models.ForeignKey(
        Empleado,
        to_field='codigo_empleado',  # Relación por código_empleado
        on_delete=models.CASCADE,
        related_name='turnos',
        db_column='empleado_codigo'  # Nombre de columna en la BD
    )
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['fecha', 'hora_inicio']
        unique_together = ['empleado', 'fecha']  # Un empleado solo un turno por día
        verbose_name = 'Turno'
        verbose_name_plural = 'Turnos'

    def clean(self):
        # Validar que la hora de fin sea mayor que la hora de inicio
        if self.hora_fin <= self.hora_inicio:
            raise ValidationError("La hora de fin debe ser posterior a la hora de inicio")
        
        # Validar que no haya solapamiento de turnos para el mismo empleado
        turnos_existentes = Turno.objects.filter(
            empleado=self.empleado,
            fecha=self.fecha
        ).exclude(pk=self.pk if self.pk else None)
        
        if turnos_existentes.exists():
            raise ValidationError("Este empleado ya tiene un turno asignado para esta fecha")

    def __str__(self):
        return f"{self.empleado.nombre} - {self.fecha} ({self.hora_inicio} a {self.hora_fin})"