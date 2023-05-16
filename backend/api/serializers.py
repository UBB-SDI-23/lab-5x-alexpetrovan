from django.db.models import Avg
from rest_framework import serializers
from .models import *

"""  Authentication serializer  """


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = (
            "user",
            "bio",
            "location",
            "gender",
            "marital",
            "activation_code",
            "activation_expiry_date",
            "active",
        )

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create_user(**user_data)
        user_profile = UserProfile.objects.create(user=user, **validated_data)
        return user_profile


class UserProfileSerializerDetailed(serializers.ModelSerializer):
    user = UserSerializer()
    movie_count = serializers.IntegerField()
    actor_count = serializers.IntegerField()
    production_count = serializers.IntegerField()

    class Meta:
        model = UserProfile
        fields = ("user",
                  "bio",
                  "location",
                  "gender",
                  "marital",
                  "role",
                  "movie_count",
                  "actor_count",
                  "production_count",
                  "page_size",
                  )


class UserActivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['activation_code']


""" Other models serializers """


class ProductionSerializer(serializers.ModelSerializer):
    added_by = serializers.CharField(write_only=True)

    class Meta:
        model = Production
        fields = '__all__'

    def create(self, validated_data):
        username = validated_data.pop('added_by')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid username')
        validated_data['added_by'] = user
        return super().create(validated_data)


class ActorSerializer(serializers.ModelSerializer):
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    def validate_experience(self, experience):
        if experience < 0:
            raise serializers.ValidationError("Invalid experience value")
        return experience

    class Meta:
        model = Actor
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    production = ProductionSerializer()
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    def validate_production_id(self, value):
        filter_id = Production.objects.filter(id=value)
        if not filter_id.exists():
            raise serializers.ValidationError("Production does not exist")
        return value

    def validate_rating(self, rating):
        if rating < 0 or rating > 10.0:
            raise serializers.ValidationError("Rating should be between 0 and 10.")
        return rating

    def validate_budget(self, budget):
        if budget < 0 or budget > 10.0:
            raise serializers.ValidationError("Budget should be between 0 and 10000000.00")
        return budget

    class Meta:
        model = Movie
        fields = '__all__'


class MovieSerializerAvgBudget(serializers.ModelSerializer):
    production_avg_budget = serializers.SerializerMethodField()
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    def get_production_avg_budget(self, obj):
        return obj.production.movie_set.aggregate(avg_budget=Avg('budget'))['avg_budget']

    class Meta:
        model = Movie
        fields = ['name', 'releaseYear', 'rating', 'genre', 'budget', 'production', 'production_avg_budget',
                  'added_by_username']


class ContractSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()
    actor = ActorSerializer()

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


""" Other models serializers for a detailed view """


class ProductionSerializerDetailed(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

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
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = Movie
        fields = (
            'name',
            'releaseYear',
            'rating',
            'genre',
            'budget',
            'actors',
            'production',
            'added_by_username'
        )

    def get_actors(self, obj):
        movie_actor_qs = Contract.objects.filter(movie=obj)
        serializer = ContractSerializer(movie_actor_qs, many=True)
        return serializer.data

    def add_actor(self, movie, actor_id, role):
        actor = Actor.objects.get(pk=actor_id)
        contract = Contract.objects.create(movie=movie, actor=actor, role=role)
        return contract


class ActorSerializerDetailed(serializers.ModelSerializer):
    stars_in = ContractSerializer(many=True, read_only=True)
    movie_avg_rating = serializers.SerializerMethodField()
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = Actor
        fields = ['name', 'gender', 'age', 'experience', 'nationality', 'stars_in', 'movie_avg_rating',
                  'added_by_username']

    def get_movie_avg_rating(self, obj):
        avg_rating = obj.contract_set.aggregate(Avg('movie__rating'))['movie__rating__avg']
        return avg_rating if avg_rating else 0


class ContractSerializerDetailed(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    actor = ActorSerializer(read_only=True)

    class Meta:
        model = Contract
        fields = (
            'role',
            'movie',
            'actor'
        )
