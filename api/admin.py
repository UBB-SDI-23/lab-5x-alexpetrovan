from django.contrib import admin
from .models import Production, Movie, Actor, Contract

# Register your models here.

admin.site.register(Production)
admin.site.register(Movie)
admin.site.register(Actor)
admin.site.register(Contract)
