from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import SectionSerializer
from ..models import Section
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..utils import is_user_creator
from rest_framework.generics import ListCreateAPIView
from django.db.models import Max


class SectionView(ListCreateAPIView):
    # permission_classes = [AllowAny]
    serializer_class = SectionSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for GET
        return [IsAuthenticated()]  # Require authentication for POST

    def get_queryset(self):
        course_id = self.kwargs.get("course_id")
        return Section.objects.filter(course=course_id).order_by('position')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        course_id = self.kwargs.get("course_id")
        request.data['course'] = course_id
        max_position = Section.objects.filter(
            course=course_id).aggregate(Max('position'))['position__max']
        if max_position is not None:
            # Example: incrementing position for a new section
            request.data['position'] = max_position + 1
        else:
            request.data['position'] = 1
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SingleSectionView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Allow public access for POST
        return [IsAuthenticated()]  # Require authentication for GET

    def get(self, request, section_id, *args, **kwargs):
        try:
            section = Section.objects.get(id=section_id)
            serialized_section = SectionSerializer(section)
            return Response(serialized_section.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Failed to get section"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, course_id, section_id, *args, **kwargs):
        try:
            # Check if the user is the creator (assuming this is your custom logic)
            is_user_creator(request, course_id=course_id)

            # Get the section from the database
            section = Section.objects.get(id=section_id)
            request.data['course'] = course_id
            # Serialize the section with the new data
            serialized_section = SectionSerializer(section, data=request.data)

            # Validate and save the serialized data
            if serialized_section.is_valid():
                serialized_section.save()
                return Response(serialized_section.data, status=status.HTTP_202_ACCEPTED)
            else:
                # If the data is invalid, return a 400 error with validation errors
                return Response({"message": "Failed to update section", "errors": serialized_section.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Section.DoesNotExist:
            # Section not found
            return Response({"message": "No Section Found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Catch any unexpected errors
            print(f"Unexpected error: {e}")
            return Response({"message": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, course_id, section_id, *args, **kwargs):
        try:
            is_user_creator(request, course_id=course_id)
            sections_in_course = Section.objects.filter(course=course_id)
            section_to_change = Section.objects.get(id=section_id)
            # get the current position from the section to change
            old_position = int(SectionSerializer(
                section_to_change).data['position'])

            # get the new position to change to
            new_position = int(request.data['position'])
            # find the sections whos position need to be shifted based on whether its shifting up or down

            if (old_position == new_position):
                return Response(SectionSerializer(section_to_change).data, status=status.HTTP_200_OK)
            elif (old_position < new_position):
                sectionsToChange = sections_in_course.filter(
                    position__gt=old_position).filter(position__lte=new_position)
            elif (old_position > new_position):
                sectionsToChange = sections_in_course.filter(
                    position__gte=new_position).filter(position__lt=old_position)
            # iterate through those sections and change their old_position
            for section in sectionsToChange:
                # find the current position of the section being iterated on
                current_position = int(SectionSerializer(
                    section).data['position'])

                updated_position_section = SectionSerializer(
                    section, data={"position": f'{current_position - 1 if old_position < new_position else current_position + 1}'}, partial=True)
                if updated_position_section.is_valid():
                    updated_position_section.save()
            serializedSection = SectionSerializer(
                section_to_change, data=request.data, partial=True)
            if serializedSection.is_valid():
                serializedSection.save()
            return Response(serializedSection.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "No Section Found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, course_id, section_id, *args, **kwargs):
        try:
            is_user_creator(request, course_id=course_id)
            section_to_delete = Section.objects.get(id=section_id)

            sections_in_course = Section.objects.filter(course=course_id)
            section_position = int(SectionSerializer(
                section_to_delete).data['position'])
            sectionsToChange = sections_in_course.filter(
                position__gt=section_position)
            # adjust the positions of the sections after the one being deleted
            for section in sectionsToChange:
                # find the current position of the section being iterated on
                current_position = int(SectionSerializer(
                    section).data['position'])

                updated_position_section = SectionSerializer(
                    section, data={"position": f'{current_position - 1}'}, partial=True)
                if updated_position_section.is_valid():
                    updated_position_section.save()

            section_to_delete.delete()
            return Response(True, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(False, status=status.HTTP_404_NOT_FOUND)
