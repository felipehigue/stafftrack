from rest_framework import serializers
from .models import Tarea
from gestionpersonal.models import Empleado, Departamento
from django.utils import timezone

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = ['id', 'nombre', 'apellido', 'email']

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'nombre']

class TareaSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(read_only=True)
    empleado_id = serializers.PrimaryKeyRelatedField(
        queryset=Empleado.objects.all(),
        source='empleado',
        write_only=True
    )
    departamento = DepartamentoSerializer(read_only=True)
    departamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Departamento.objects.all(),
        source='departamento',
        write_only=True,
        required=False,
        allow_null=True
    )
    dias_restantes = serializers.SerializerMethodField()
    completada = serializers.BooleanField(read_only=True)

    class Meta:
        model = Tarea
        fields = [
            'id',
            'titulo',
            'descripcion',
            'empleado',
            'empleado_id',
            'departamento',
            'departamento_id',
            'estado',
            'prioridad',
            'fecha_creacion',
            'fecha_vencimiento',
            'fecha_completada',
            'dias_restantes',
            'completada'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_completada']

    def get_dias_restantes(self, obj):
        if obj.fecha_vencimiento and not obj.completada:
            delta = obj.fecha_vencimiento - timezone.now()
            return delta.days
        return None

    def validate(self, data):
        if 'estado' in data and data['estado'] == 'COMPLETADA':
            data['fecha_completada'] = timezone.now()
        return data

   