from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Person, Role

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff"]

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["role_id", "role_name"]

class PersonSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    role = RoleSerializer(source="role_id", read_only=True)

    class Meta:
        model = Person
        fields = [
            "employee_id",
            "user_username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "role",
        ]
