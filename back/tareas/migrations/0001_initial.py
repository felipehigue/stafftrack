# Generated by Django 5.0.7 on 2025-04-08 03:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gestionpersonal', '0002_alter_cargo_options_alter_departamento_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tarea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('estado', models.CharField(choices=[('PENDIENTE', 'Pendiente'), ('EN_PROGRESO', 'En progreso'), ('COMPLETADA', 'Completada')], default='PENDIENTE', max_length=20)),
                ('prioridad', models.CharField(choices=[('BAJA', 'Baja'), ('MEDIA', 'Media'), ('ALTA', 'Alta')], default='MEDIA', max_length=20)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_vencimiento', models.DateTimeField(blank=True, null=True)),
                ('fecha_completada', models.DateTimeField(blank=True, null=True)),
                ('departamento', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tareas_departamento', to='gestionpersonal.departamento')),
                ('empleado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tareas_asignadas', to='gestionpersonal.empleado')),
            ],
            options={
                'verbose_name': 'Tarea',
                'verbose_name_plural': 'Tareas',
                'ordering': ['-fecha_creacion'],
            },
        ),
    ]
