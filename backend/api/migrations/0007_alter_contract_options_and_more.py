# Generated by Django 4.1.7 on 2023-04-04 18:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_contract_contractamount_movie_actors'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='contract',
            options={'ordering': ['movie']},
        ),
        migrations.AlterUniqueTogether(
            name='contract',
            unique_together={('actor', 'movie')},
        ),
    ]
