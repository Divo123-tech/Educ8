import mimetypes
from django.forms import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, ListAPIView
from ..serializers import SectionContentSerializer
from ..models import SectionContent, Course, UserCourse
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..utils import is_user_creator
from rest_framework.parsers import MultiPartParser, FormParser


class SectionContentView(ListCreateAPIView):
    queryset = SectionContent.objects.all()
    serializer_class = SectionContentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for GET
        return [IsAuthenticated()]  # Require authentication for POST

    def get_queryset(self):
        section_id = self.kwargs.get("section_id")
        return SectionContent.objects.filter(section=section_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Filter to only include selected fields
        filtered_data = [
            {"id": item["id"], "title": item["title"],
             "contentType": item["contentType"]}
            for item in serializer.data
        ]
        return Response(filtered_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        section_id = self.kwargs.get("section_id")
        request.data['section'] = section_id

        # Proceed to serialize and save the object
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailedSectionContentsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SectionContentSerializer

    def get_queryset(self):
        section_id = self.kwargs.get("section_id")
        return SectionContent.objects.filter(section=section_id)


class SingleSectionContentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def is_user_registered_to_course(self, request, course_id):
        userRegistered = UserCourse.objects.filter(
            student=str(request.user), course=course_id)

        if userRegistered is None:
            return Response(
                {"message": "You are not authorized to see this content."},
                status=status.HTTP_403_FORBIDDEN
            )
        return True

    def get(self, request, course_id, content_id, *args, **kwargs):
        try:
            if is_user_creator(request, course_id) or self.is_user_registered_to_course(request, course_id):
                section_content = SectionContent.objects.get(id=content_id)
                serialized_section_content = SectionContentSerializer(
                    section_content)
                return Response(serialized_section_content.data, status=status.HTTP_200_OK)
            return Response(
                {"message": "You are not authorized to see this content."},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(serialized_section_content.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, course_id, content_id, *args, **kwargs):
        try:
            is_user_creator(request, course_id)
            section_content = SectionContent.objects.get(id=content_id)
            serialized_section_content = SectionContentSerializer(
                section_content, data=request.data, partial=True)
            if serialized_section_content.is_valid():
                serialized_section_content.save()
                return Response(serialized_section_content.data)
            return Response(serialized_section_content.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(serialized_section_content.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, course_id, content_id, *args, **kwargs):
        try:
            is_user_creator(request, course_id)
            section_content = SectionContent.objects.get(id=content_id)
            section_content.delete()
            return Response(True, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(False, status=status.HTTP_400_BAD_REQUEST)
