from django.db.models import Avg
from rest_framework import serializers
from .models import *


class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = '__all__'


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    def validate_production_id(self, value):
        filter_id = Production.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Production does not exist")
        return value

    class Meta:
        model = Movie
        fields = '__all__'


class MovieSerializerAvgBudget(serializers.ModelSerializer):
    production_avg_budget = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['name', 'releaseYear', 'rating', 'genre', 'budget', 'production', 'production_avg_budget']

    def get_production_avg_budget(self, obj):
        return obj.production.movie_set.aggregate(avg_budget=Avg('budget'))['avg_budget']


class ContractSerializer(serializers.ModelSerializer):

    def validate_movie_id(self, value):
        filter_id = Movie.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Movie does not exist")
        return value

    def validate_actor_id(self, value):
        filter_id = Actor.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Actor does not exist")
        return value

    class Meta:
        model = Contract
        fields = '__all__'


class ProductionSerializerDetailed(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = Production
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['movies'] = MovieSerializer(instance.movie_set.all(), many=True).data
        return representation


class MovieSerializerDetailed(serializers.ModelSerializer):
    production = ProductionSerializer(read_only=True)
    actors = ActorSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = (
            'name',
            'releaseYear',
            'rating',
            'genre',
            'budget',
            'actors',
            'production'
        )

    def get_actors(self, obj):
        movie_actor_qs = Contract.objects.filter(movie=obj)
        serializer = ContractSerializer(movie_actor_qs, many=True)
        return serializer.data

    def add_actor(self, movie, actor_id, cast):
        actor = Actor.objects.get(pk=actor_id)
        contract = Contract.objects.create(movie=movie, actor=actor, cast=cast)
        return contract


class ActorSerializerDetailed(serializers.ModelSerializer):
    stars_in = ContractSerializer(many=True, read_only=True)
    movie_avg_rating = serializers.SerializerMethodField()

    class Meta:
        model = Actor
        fields = ['name', 'gender', 'age', 'experience', 'nationality', 'stars_in', 'movie_avg_rating']

    def get_movie_avg_rating(self, obj):
        avg_rating = obj.contract_set.aggregate(Avg('movie__rating'))['movie__rating__avg']
        return avg_rating if avg_rating else 0


class ContractSerializerDetailed(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    actor = ActorSerializer(read_only=True)

    class Meta:
        model = Contract
        fields = (
            'cast',
            'movie',
            'actor'
        )
