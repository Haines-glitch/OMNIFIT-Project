import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()

PHONE_REGEX = re.compile(r'^\+?[0-9]{10,15}$')

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', read_only=True)
    phone_no = serializers.CharField(source='phone', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'name', 'phone', 'phone_no', 'role', 'status', 'profile_image', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True)
    full_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'phone']

    def validate_email(self, value):
        email = value.lower().strip()
        try:
            validate_email(email)
        except DjangoValidationError:
            raise serializers.ValidationError("Invalid email address format.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

    def validate_phone(self, value):
        if value:
            clean_phone = value.replace(' ', '').replace('-', '')
            if not PHONE_REGEX.match(clean_phone):
                raise serializers.ValidationError("Phone number must be a valid 10-15 digit number (e.g. +1234567890).")
            return clean_phone
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[@$!%*#?&_\-\+\=\<\>\[\]\{\}\(\)]', value):
            raise serializers.ValidationError("Password must contain at least one special symbol (@$!%*#?&_+-=).")
        return value

    def create(self, validated_data):
        # SECURITY REQUIREMENT: Server MUST ALWAYS force role = member for public registration
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            role='member',
            status='Active'
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check active status
        if self.user.status != 'Active' or not self.user.is_active:
            raise serializers.ValidationError({
                "account": "Your account is suspended or inactive. Please contact system administrator."
            })

        user_display_name = self.user.full_name
        if not user_display_name:
            prefix = self.user.email.split('@')[0] if '@' in self.user.email else self.user.email
            user_display_name = ' '.join([p.upper() if len(p) <= 2 else p.capitalize() for p in prefix.replace('.', ' ').replace('_', ' ').replace('-', ' ').split()])

        # Dynamic redirect URL based on authoritative database role
        db_role = (self.user.role or 'member').lower()
        role_redirect_map = {
            'member': '/member-dashboard',
            'trainer': '/trainer-dashboard',
            'admin': '/admin-dashboard'
        }
        redirect_url = role_redirect_map.get(db_role, '/member-dashboard')

        data['user'] = {
            'id': self.user.id,
            'user_id': self.user.id,
            'name': user_display_name,
            'email': self.user.email,
            'role': self.user.role.upper(),
            'status': self.user.status,
            'redirect_url': redirect_url
        }
        return data

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[@$!%*#?&_\-\+\=\<\>\[\]\{\}\(\)]', value):
            raise serializers.ValidationError("Password must contain at least one special symbol (@$!%*#?&_+-=).")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New password and confirmation password do not match."})
        return attrs

