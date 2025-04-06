from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpleadoViewSet, DepartamentoViewSet, CargoViewSet

router = DefaultRouter()
router.register(r'empleados', EmpleadoViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'cargos', CargoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]