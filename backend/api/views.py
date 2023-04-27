from django.http import Http404
from rest_framework import generics, status
from rest_framework.response import Response

from .models import *
from .serializers import *


# Create your views here.
class ProductionList(generics.ListCreateAPIView):
    serializer_class = ProductionSerializer
    queryset = Production.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProductionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductionSerializerDetailed
    queryset = Production.objects.all()


class MovieListAvgBudget(generics.ListAPIView):
    serializer_class = MovieSerializerAvgBudget

    def get_queryset(self):
        queryset = Movie.objects.all()
        return queryset.annotate(avg_budget=Avg('production__movie__budget')).order_by('-avg_budget', 'production')


class MovieList(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
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


class ActorList(generics.ListCreateAPIView):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all()


class ActorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActorSerializerDetailed
    queryset = Actor.objects.all()

    def get_queryset(self):
        pk = self.kwargs['pk']
        queryset = Actor.objects.filter(id=pk)
        return queryset.annotate(avg_age=Avg('contract__movie__rating'))


class ContractList(generics.ListCreateAPIView):
    serializer_class = ContractSerializer
    queryset = Contract.objects.all()


class ContractDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContractSerializerDetailed
    queryset = Contract.objects.all()


