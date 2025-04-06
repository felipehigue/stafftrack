# serializers.py
from rest_framework import serializers
from .models import Turno
from gestionpersonal.models import Empleado  # Importa tu modelo Empleado

class TurnoSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.nombre_completo', read_only=True)
    codigo_empleado = serializers.SlugRelatedField(
        source='empleado',
        slug_field='codigo_empleado',
        queryset=Empleado.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = Turno
        fields = [
            'id',
            'codigo_empleado',
            'empleado_nombre',
            'fecha',
            'hora_inicio',
            'hora_fin',
            'creado_en'
        ]
        extra_kwargs = {
            'creado_en': {'read_only': True}
        }

    def validate(self, data):
        # Validación adicional para asegurar que hora_fin > hora_inicio
        if 'hora_inicio' in data and 'hora_fin' in data:
            if data['hora_fin'] <= data['hora_inicio']:
                raise serializers.ValidationError(
                    "La hora de fin debe ser posterior a la hora de inicio"
                )
        
        # Validar que el código de empleado existe
        if 'empleado' in data:
            if not Empleado.objects.filter(codigo_empleado=data['empleado'].codigo_empleado).exists():
                raise serializers.ValidationError(
                    {"codigo_empleado": "No existe un empleado con este código"}
                )
        return data