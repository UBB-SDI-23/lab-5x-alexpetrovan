from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from .models import Production, Actor, Movie, Contract
from .serializers import MovieSerializerAvgBudget, ActorSerializerDetailed


class TestMovieSerializerAvgBudget(TestCase):
    def setUp(self):
        self.production = Production.objects.create(
            companyName='Test Production',
            origin_country='USA',
            website='www.test.com',
            description='Test description')
        self.movie1 = Movie.objects.create(
            name='Test Movie 1',
            releaseYear=timezone.now().date(),
            rating=Decimal('8.5'),
            genre='Action',
            budget=Decimal('1000000'),
            production=self.production)
        self.movie2 = Movie.objects.create(
            name='Test Movie 2',
            releaseYear=timezone.now().date(),
            rating=Decimal('7.5'),
            genre='Comedy',
            budget=Decimal('2000000'),
            production=self.production)

    def test_get_production_avg_budget(self):
        serializer = MovieSerializerAvgBudget(instance=self.movie1)
        self.assertEqual(serializer.data['production_avg_budget'], Decimal('1500000'))
        serializer = MovieSerializerAvgBudget(instance=self.movie2)
        self.assertEqual(serializer.data['production_avg_budget'], Decimal('1500000'))


class TestActorSerializerDetailed(TestCase):
    def setUp(self):
        self.production = Production.objects.create(
            companyName='Test Production',
            origin_country='USA',
            website='www.test.com',
            description='Test description')
        self.actor = Actor.objects.create(
            name='Test Actor',
            gender='Male',
            age=30,
            experience=5,
            nationality='USA')
        self.movie1 = Movie.objects.create(
            name='Test Movie 1',
            releaseYear=timezone.now().date(),
            rating=Decimal('8.5'),
            genre='Action',
            budget=Decimal('1000000'),
            production=self.production
        )
        self.movie2 = Movie.objects.create(
            name='Test Movie 2',
            releaseYear=timezone.now().date(),
            rating=Decimal('7.5'),
            genre='Comedy',
            budget=Decimal('2000000'),
            production=self.production
        )
        self.contract1 = Contract.objects.create(movie=self.movie1, actor=self.actor, cast='Lead')
        self.contract2 = Contract.objects.create(movie=self.movie2, actor=self.actor, cast='Supporting')

    def test_get_movie_avg_rating(self):
        serializer = ActorSerializerDetailed(instance=self.actor)
        self.assertEqual(serializer.data['movie_avg_rating'], Decimal('8.0'))