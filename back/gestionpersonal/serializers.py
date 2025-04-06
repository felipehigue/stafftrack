from rest_framework import serializers
from .models import Empleado, Departamento, Cargo

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class CargoSerializer(serializers.ModelSerializer):
    departamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Departamento.objects.all(),
        source='departamento',
        write_only=True
    )
    
    class Meta:
        model = Cargo
        fields = ['id', 'nombre', 'departamento', 'departamento_id', 'nivel_jerarquico', 'descripcion']
        extra_kwargs = {
            'departamento': {'read_only': True}
        }
class EmpleadoSerializer(serializers.ModelSerializer):
    cargo = CargoSerializer(read_only=True)
    cargo_id = serializers.PrimaryKeyRelatedField(
        queryset=Cargo.objects.all(),
        source='cargo',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Empleado
        fields = '__all__'
        read_only_fields = ('codigo_empleado',)  # Hacemos el campo de solo lectura
    
    def create(self, validated_data):
        # Generamos el código automáticamente
        last_employee = Empleado.objects.order_by('-id').first()
        last_id = last_employee.id if last_employee else 0
        validated_data['codigo_empleado'] = f"EMP-{last_id + 1:04d}"
        
        return super().create(validated_data)