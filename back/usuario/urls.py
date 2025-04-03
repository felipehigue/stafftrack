from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.registro, name='registro'),
     path('login/', views.login_view, name='login_api'),
      path('csrf/', views.get_csrf_token, name='get_csrf'),
]