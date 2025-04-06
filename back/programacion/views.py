# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from datetime import date, timedelta
from .models import Turno
from .serializers import TurnoSerializer

class TurnoViewSet(viewsets.ModelViewSet):
    queryset = Turno.objects.all().select_related('empleado')
    serializer_class = TurnoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por código de empleado si se proporciona
        codigo_empleado = self.request.query_params.get('codigo_empleado')
        if codigo_empleado:
            queryset = queryset.filter(empleado__codigo_empleado=codigo_empleado)
            
        return queryset

    @action(detail=False, methods=['get'])
    def por_rango(self, request):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        if not fecha_inicio or not fecha_fin:
            return Response(
                {"error": "Los parámetros 'fecha_inicio' y 'fecha_fin' son requeridos (YYYY-MM-DD)"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            fecha_inicio = date.fromisoformat(fecha_inicio)
            fecha_fin = date.fromisoformat(fecha_fin)
            
            turnos = self.get_queryset().filter(
                fecha__gte=fecha_inicio,
                fecha__lte=fecha_fin
            )
            
            serializer = self.get_serializer(turnos, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def por_semana(self, request):
        fecha_str = request.query_params.get('fecha')
        
        if not fecha_str:
            return Response(
                {"error": "El parámetro 'fecha' es requerido (YYYY-MM-DD)"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            fecha = date.fromisoformat(fecha_str)
            semana_inicio = fecha - timedelta(days=fecha.weekday())
            semana_fin = semana_inicio + timedelta(days=6)
            
            turnos = self.get_queryset().filter(
                fecha__gte=semana_inicio,
                fecha__lte=semana_fin
            )
            
            serializer = self.get_serializer(turnos, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )