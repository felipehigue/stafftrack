from argparse import Action
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Empleado, Departamento, Cargo
from .serializers import EmpleadoSerializer, DepartamentoSerializer, CargoSerializer
from rest_framework.decorators import action

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']

class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['departamento']

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['cargo', 'estado']
    search_fields = ['nombre', 'apellido', 'email', 'codigo_empleado']
    
    @action(detail=False, methods=['get'])
    def exportar(self, request):
        from django.http import HttpResponse
        import csv
        
        empleados = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="empleados.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Código', 'Nombre', 'Email', 'Cargo', 'Estado'])
        
        for empleado in empleados:
            writer.writerow([
                empleado.codigo_empleado,
                empleado.nombre_completo,
                empleado.email,
                str(empleado.cargo),
                empleado.get_estado_display()
            ])
        
        return response