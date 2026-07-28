from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'profile_image', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    role = serializers.ChoiceField(choices=['member', 'trainer', 'admin'], default='member')

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'phone', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'member')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Verify role requirement if provided in request
        requested_role = self.context['request'].data.get('role')
        if requested_role and self.user.role != requested_role:
            raise serializers.ValidationError({"role": f"User is registered as '{self.user.role}', not '{requested_role}'."})

        data['user'] = {
            'id': self.user.id,
            'name': self.user.full_name or self.user.email.split('@')[0],
            'email': self.user.email,
            'role': self.user.role,
        }
        return data
