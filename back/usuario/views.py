from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  # Importa csrf_exempt
from django.contrib.auth import login, authenticate  # Importa login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
import json
from .forms import RegistroForm
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie



@csrf_exempt
def registro(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos:", data)
            
            form = RegistroForm(data)
            
            if form.is_valid():
                user = form.save()
                # Actualiza campos adicionales
                user.first_name = form.cleaned_data['firstname']
                user.last_name = form.cleaned_data['lastname']
                user.save()
                
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'message': 'Registro exitoso',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                }, status=201)
            else:
                print("Errores:", form.errors)
                return JsonResponse({
                    'success': False,
                    'errors': form.errors
                }, status=400)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()  # Cambiado de username a email
            password = data.get('password', '').strip()
            
            if not email or not password:
                return JsonResponse({'error': 'Email y contraseña requeridos'}, status=400)
            
            # Autenticar usando el backend personalizado
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return JsonResponse({
                        'success': True,
                        'user': {
                            'id': user.id,
                            'email': user.email
                        }
                    }, status=200)
                return JsonResponse({'error': 'Cuenta inactiva'}, status=403)
            
            # Verificar si el email existe
            if User.objects.filter(email__iexact=email).exists():
                return JsonResponse({'error': 'Contraseña incorrecta'}, status=401)
            return JsonResponse({'error': 'Email no registrado'}, status=404)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def get_csrf(request):
    if request.method == 'GET':
        return JsonResponse({'csrfToken': get_token(request)})
    return JsonResponse({'error': 'Método no permitido'}, status=405)



@ensure_csrf_cookie
def get_csrf_token(request):
    if request.method == 'GET':
        return JsonResponse({'csrfToken': get_token(request)})
    return JsonResponse({'error': 'Método no permitido'}, status=405)