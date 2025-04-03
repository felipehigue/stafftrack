from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegistroForm(UserCreationForm):
    firstname = forms.CharField(max_length=30, required=True, label="Nombre")
    lastname = forms.CharField(max_length=30, required=True, label="Apellido")
    email = forms.EmailField(required=True, label="Correo electrónico")
    position = forms.CharField(max_length=100, required=True, label="Cargo")
    department = forms.CharField(max_length=100, required=True, label="Área")

    class Meta:
        model = User
        fields = ['username', 'firstname', 'lastname', 'email', 'position', 'department', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Genera username automáticamente si no está presente
        if 'email' in self.data and 'username' not in self.data:
            self.data = self.data.copy()
            self.data['username'] = self.data['email'].split('@')[0]