from django.db import models


# Create your models here.

class Production(models.Model):
    companyName = models.CharField(max_length=100, unique=True)
    origin_country = models.CharField(max_length=100)
    website = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=100)

    def __str__(self):
        return self.companyName

class Actor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    gender = models.CharField(max_length=100)
    age = models.DecimalField(max_digits=2, decimal_places=0)
    experience = models.DecimalField(max_digits=2, decimal_places=0)
    nationality = models.CharField(max_length=100)
    movies = models.ManyToManyField('Movie', through='Contract')

    def __str__(self):
        return self.name


class Movie(models.Model):
    name = models.CharField(max_length=100, unique=True)
    releaseYear = models.DateField()
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    genre = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    production = models.ForeignKey(Production, on_delete=models.CASCADE)
    actors = models.ManyToManyField(Actor, through='Contract')

    def __gt__(self, other):
        return self.rating > other


    def __str__(self):
        return self.name


class Contract(models.Model):
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    cast = models.CharField(max_length=50)

    class Meta:
        unique_together = [['actor', 'movie']]
        ordering = ['movie']

