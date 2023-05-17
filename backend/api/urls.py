from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from .views import *

urlpatterns = [
    path('Production/', ProductionList.as_view(), name='production-list'),
    path('Production/<int:pk>/', ProductionDetail.as_view(), name='production-detail'),

    path('Movie/', MovieList.as_view(), name='movie-list'),
    path('Movie/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),
    path('Movie/avg-budget/', MovieListAvgBudget.as_view(), name='movie-list-avg-budget'),

    path('Actor/', ActorList.as_view(), name='actor-list'),
    path('Actor/<int:pk>/', ActorDetail.as_view(), name='actor-detail'),

    path('Contract/', ContractList.as_view(), name='contract-list'),
    path('Contract/<int:pk>/', ContractDetail.as_view(), name='contract-detail'),

    #path('Movie/<int:movie_id>/Actor/', MovieActorView.as_view(), name='movie_actor'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('Register/', UserRegistrationView.as_view(), name='register'),
    path('Register/Confirm/<str:confirmation_code>/', UserActivationView.as_view(), name='activate-user'),

    path('User/', UserList.as_view(), name='user-list'),
    path('User/<str:user_id>/', UserDetail.as_view(), name='user-detail'),

    path('insert/<str:model_name>/', InsertionScriptView.as_view(), name='insert-script')
]
