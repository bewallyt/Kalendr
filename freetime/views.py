from rest_framework import viewsets
from rest_framework.response import Response
from freetime.serializers import *


class FreeTimeViewSet(viewsets.ModelViewSet):
    serializer_class = FreeTimeRequestSerializer

    def create(self, request):
        return None
