from rest_framework import serializers
from .models import Course, Section, SectionContent, Review, CustomUser, UserCourse, Cart, Chat
from django.db.models import Avg
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    # Add password field with write-only restriction
    # password = serializers.CharField(write_only=True)
    courses_taught = serializers.PrimaryKeyRelatedField(
        read_only=True, many=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'id', 'email', "password",
                  "courses_taught", "bio", "profile_picture", "status")
        # fields = "__all__"
        extra_kwargs = {
            # Ensure the password is write-only
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)  # Create the user instance
        # Set the password properly
        user.set_password(validated_data['password'])
        user.save()  # Save the user to the database
        return user


class CourseSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all())
    sections = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    reviews = serializers.PrimaryKeyRelatedField(
        read_only=True, many=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def to_representation(self, instance):
        # Get the base representation first (like the usual serializer output)
        representation = super().to_representation(instance)

        # Replace creator field with the username instead of the id
        if instance.creator:
            representation['creator'] = {
                "id": instance.creator.id, "username": instance.creator.username}

        return representation

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(average_rating=Avg('rating'))['average_rating']


class UserCourseSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all())


    class Meta:
        model = UserCourse
        fields = ('id', 'course', 'student', 'joined_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Replace the course ID with the serialized course object
        representation['course'] = CourseSerializer(instance.course).data
        representation['student'] = UserSerializer(instance.student).data

        return representation


class CartSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all())

    class Meta:
        model = Cart
        fields = ('id', 'course', 'student')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Replace the course ID with the serialized course object
        representation['course'] = CourseSerializer(instance.course).data
        return representation


class ReviewSerializer(serializers.ModelSerializer):
    reviewed_by = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all())

    class Meta:
        model = Review
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Replace the course ID with the serialized course object
        representation['reviewed_by'] = UserSerializer(
            instance.reviewed_by).data
        return representation


class SectionSerializer(serializers.ModelSerializer):
    contents = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = Section
        fields = '__all__'


class SectionContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = SectionContent
        fields = '__all__'

    def validate(self, data):
        content_type = data.get('contentType')
        media = data.get('media')

        if content_type == 'image' and not media.name.lower().endswith(('jpg', 'jpeg', 'png', "pdf")):
            raise serializers.ValidationError(
                "Invalid file type for images. Allowed types: jpg, jpeg, png., pdf")
        elif content_type == 'video' and not media.name.lower().endswith(('mp4', 'mov')):
            raise serializers.ValidationError(
                "Invalid file type for videos. Allowed types: mp4, mov.")

        return data


class NumOfCoursesPublishedSerializer(serializers.Serializer):
    published_count = serializers.IntegerField()
    unpublished_count = serializers.IntegerField()
    total = serializers.IntegerField()


class CourseRevenueSerializer(serializers.ModelSerializer):
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_students = serializers.IntegerField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'price', 'revenue', 'total_students']


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        # Customize this based on your model
        fields = ['sent_by', 'message', 'sent_at']
User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # DRF SimpleJWT expects "username" by default
        password = attrs.get("password")

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("No active account found with this email.")

            if not user.check_password(password):
                raise serializers.ValidationError("Incorrect credentials.")

            attrs["username"] = user.username  # SimpleJWT expects a username field
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        return super().validate(attrs)