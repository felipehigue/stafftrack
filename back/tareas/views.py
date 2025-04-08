from rest_framework import viewsets, filters
from .models import Tarea
from .serializers import TareaSerializer
from django_filters.rest_framework import DjangoFilterBackend

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all().select_related('empleado', 'departamento')
    serializer_class = TareaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'estado': ['exact'],
        'prioridad': ['exact'],
        'empleado': ['exact'],
        'departamento': ['exact'],
        'fecha_vencimiento': ['gte', 'lte', 'exact'],
        'fecha_creacion': ['gte', 'lte', 'exact'],
    }
    search_fields = ['titulo', 'descripcion']
    ordering_fields = ['fecha_creacion', 'fecha_vencimiento', 'prioridad']
    ordering = ['-fecha_creacion']

    def perform_create(self, serializer):
    # Asignar automáticamente el departamento del empleado si no se especifica
        if 'departamento' not in serializer.validated_data:
            empleado = serializer.validated_data['empleado']
        if empleado.cargo and empleado.cargo.departamento:
            serializer.validated_data['departamento'] = empleado.cargo.departamento
        serializer.save()