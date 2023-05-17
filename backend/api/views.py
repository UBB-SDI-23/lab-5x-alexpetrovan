import uuid
import subprocess
from datetime import timedelta
from typing import Any

from django.db.models import Count
from django.http import Http404, HttpResponse
from django.utils import timezone
from django.views import View
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .pagination import CustomPagination
from .permission import HasEditPermissionOrReadOnly, IsAdminOrReadOnly
from .serializers import *


# Create your views here.

### Production Views

class ProductionList(generics.ListCreateAPIView):
    serializer_class = ProductionSerializer
    queryset = Production.objects.order_by('id')
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProductionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductionSerializerDetailed
    queryset = Production.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, HasEditPermissionOrReadOnly]


### Movie Views

class MovieListAvgBudget(generics.ListAPIView):
    serializer_class = MovieSerializerAvgBudget
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Movie.objects.all()
        return queryset.annotate(avg_budget=Avg('production__movie__budget')).order_by('-avg_budget', 'production')


class MovieList(generics.ListCreateAPIView):
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        return MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.order_by('id')
        rating = self.request.query_params.get('rating')
        genre = self.request.query_params.get('genre')
        if rating:
            queryset = queryset.filter(rating__gt=rating)
        if genre:
            queryset = queryset.filter(genre=genre)
        return queryset


class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MovieSerializerDetailed
    queryset = Movie.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, HasEditPermissionOrReadOnly]


### Actors Views

class ActorList(generics.ListCreateAPIView):
    serializer_class = ActorSerializer
    queryset = Actor.objects.order_by('id')
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]


class ActorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActorSerializerDetailed
    queryset = Actor.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, HasEditPermissionOrReadOnly]

    def get_queryset(self):
        pk = self.kwargs['pk']
        queryset = Actor.objects.filter(id=pk)
        return queryset.annotate(avg_age=Avg('contract__movie__rating'))


### Contract Views

class ContractList(generics.ListCreateAPIView):
    serializer_class = ContractSerializer
    queryset = Contract.objects.order_by('id')
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]


class ContractDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContractSerializerDetailed
    queryset = Contract.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, HasEditPermissionOrReadOnly]


" ############ Auth views ###########"


class UserRegistrationView(generics.CreateAPIView):
    """ Register a new user """

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def create(self, request: Request, *args: Any, **kwargs: Any):
        activation_expiry_date = str(timezone.now() + timedelta(minutes=10))
        activation_code = str(uuid.uuid4())
        data = request.data.copy()
        data["activation_code"] = activation_code
        data["activation_expiry_date"] = activation_expiry_date
        data["active"] = False

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"activation_code": activation_code},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UserActivationView(generics.GenericAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserActivationSerializer # Include 'GET' in the allowed methods

    def get(self, request: Request, confirmation_code) -> Response:
        try:
            user_profile: UserProfile = UserProfile.objects.get(
                activation_code=confirmation_code
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Activation code not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_profile.activation_expiry_date < timezone.now():
            return Response(
                {"error": "Activation code expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        if user_profile.active:
            return Response(
                {"success": "Account already active"}, status=status.HTTP_200_OK
            )

        user_profile.active = True
        user_profile.save()
        return Response(
            {"success": "User profile activated"}, status=status.HTTP_200_OK
        )


class UserList(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.order_by('id')
    pagination_class = CustomPagination


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "user_id"
    serializer_class = UserProfileSerializerDetailed
    queryset = UserProfile.objects.all().annotate(
        movie_count=Count("user__movie", distinct=True),
        actor_count=Count("user__actor", distinct=True),
        production_count=Count("user__production", distinct=True),
    )


class InsertionScriptView(APIView):
    permission_classes = IsAdminOrReadOnly

    def get(self, request, model_name):
        try:
            # Map model names to script names
            model_script_mapping = {
                'actor': 'populate_scripts/generate_actors.py',
                'movie': 'populate_scripts/generate_movies.py',
                'production': 'populate_scripts/generate_productions.py'
            }

            # Get the script name based on the provided model name
            script_name = model_script_mapping.get(model_name)

            if script_name:
                # Run the script using subprocess
                process = subprocess.Popen(['python', script_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                output, error = process.communicate()

                if process.returncode == 0:
                    # Script executed successfully
                    return HttpResponse(f"Script '{script_name}' executed for model: {model_name}")
                else:
                    # Script encountered an error
                    return HttpResponse(f"Error executing script: {error.decode()}")

            else:
                return HttpResponse(f"No script found for model: {model_name}")

        except Exception as e:
            return HttpResponse(f"Error executing script: {str(e)}")

