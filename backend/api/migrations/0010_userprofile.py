# Generated by Django 4.1.7 on 2023-05-10 20:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0009_rename_cast_contract_role'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(max_length=500)),
                ('location', models.CharField(max_length=50)),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], max_length=10)),
                ('marital', models.CharField(choices=[('single', 'Single'), ('married', 'Married')], max_length=20)),
                ('activation_code', models.CharField(max_length=36)),
                ('activation_expiry_date', models.DateTimeField()),
                ('active', models.BooleanField()),
                ('role', models.CharField(choices=[('regular', 'Regular'), ('moderator', 'Moderator'), ('admin', 'Admin')], default='regular', max_length=10)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL, to_field='username')),
            ],
        ),
    ]
