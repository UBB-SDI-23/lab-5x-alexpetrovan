from typing import cast

from django.db import models

from django.contrib.auth.models import User


# Create your models here.

class Production(models.Model):
    companyName = models.CharField(max_length=100, unique=True)
    origin_country = models.CharField(max_length=100)
    website = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=100)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.companyName


class Actor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    gender = models.CharField(max_length=100)
    age = models.DecimalField(max_digits=2, decimal_places=0)
    experience = models.DecimalField(max_digits=2, decimal_places=0)
    nationality = models.CharField(max_length=100)
    movies = models.ManyToManyField('Movie', through='Contract')
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

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
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __gt__(self, other):
        return self.rating > other

    def __str__(self):
        return self.name


class Contract(models.Model):
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)

    class Meta:
        unique_together = [['actor', 'movie']]
        ordering = ['movie']


### UserProfile Model

class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile", to_field="username"
    )
    bio = models.TextField(max_length=500)
    location = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=(("male", "Male"), ("female", "Female"), ("other", "Other")))
    marital = models.CharField(max_length=20, choices=(("single", "Single"), ("married", "Married")))
    activation_code = models.CharField(max_length=36)
    activation_expiry_date = models.DateTimeField()
    active = models.BooleanField()
    role = models.CharField(max_length=10, choices=(
        ("regular", "Regular"), ("moderator", "Moderator"), ("admin", "Admin")),
                            default="regular")
    page_size = models.IntegerField(choices=((25, 25), (50, 50), (100, 100)), default=100, )

    def __str__(self):
        return cast(str, self.user.username)
