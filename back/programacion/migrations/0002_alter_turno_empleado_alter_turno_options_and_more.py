# Generated by Django 5.0.7 on 2025-04-06 16:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionpersonal', '0002_alter_cargo_options_alter_departamento_options_and_more'),
        ('programacion', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='turno',
            name='empleado',
            field=models.ForeignKey(db_column='empleado_codigo', on_delete=django.db.models.deletion.CASCADE, related_name='turnos', to='gestionpersonal.empleado', to_field='codigo_empleado'),
        ),
        migrations.AlterModelOptions(
            name='turno',
            options={'ordering': ['fecha', 'hora_inicio'], 'verbose_name': 'Turno', 'verbose_name_plural': 'Turnos'},
        ),
        migrations.DeleteModel(
            name='Empleado',
        ),
    ]
