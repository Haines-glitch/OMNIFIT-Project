from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.trainers.models import Trainer
from apps.members.models import Member

User = get_user_model()

class AssignedMemberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Member
        fields = ['id', 'membership_no', 'full_name', 'email', 'phone', 'membership_plan', 'fitness_goal', 'status']

class TrainerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    user_status = serializers.CharField(source='user.status', read_only=True)
    assigned_members = serializers.SerializerMethodField()
    assigned_members_count = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = [
            'id', 'user_id', 'full_name', 'name', 'email', 'phone',
            'specialization', 'experience', 'experience_years',
            'qualification', 'certification', 'license_number', 'bio',
            'date_of_birth', 'gender', 'working_days', 'start_time', 'end_time',
            'rating', 'status', 'user_status', 'assigned_members', 'assigned_members_count',
            'created_at', 'updated_at'
        ]

    def get_assigned_members(self, obj):
        members = Member.objects.filter(assigned_trainer=obj.user)
        return AssignedMemberSerializer(members, many=True).data

    def get_assigned_members_count(self, obj):
        return Member.objects.filter(assigned_trainer=obj.user).count()


class TrainerCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True, default='Male')
    profile_image = serializers.ImageField(required=False, allow_null=True)
    
    specialization = serializers.CharField(required=True)
    experience = serializers.IntegerField(required=False, default=1, min_value=0, max_value=50)
    qualification = serializers.CharField(required=False, allow_blank=True, default='')
    certification = serializers.CharField(required=False, allow_blank=True, default='')
    license_number = serializers.CharField(required=False, allow_blank=True, default='')
    bio = serializers.CharField(required=False, allow_blank=True, default='')
    
    working_days = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    start_time = serializers.CharField(required=False, default='08:00 AM')
    end_time = serializers.CharField(required=False, default='05:00 PM')
    
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False)
    status = serializers.CharField(required=False, default='Active')

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return email

    def validate(self, attrs):
        if attrs.get('confirm_password') and attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        full_name = validated_data['full_name']
        phone = validated_data.get('phone', '')
        status_val = validated_data.get('status', 'Active')

        # Create user with role='trainer' (FORCED)
        user = User.objects.create_user(
            email=email,
            username=email,
            full_name=full_name,
            password=password,
            phone=phone,
            role='trainer',
            status=status_val
        )

        # Create Trainer profile
        working_days = validated_data.get('working_days', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
        trainer = Trainer.objects.create(
            user=user,
            specialization=validated_data.get('specialization', 'Strength Training'),
            experience=validated_data.get('experience', 1),
            qualification=validated_data.get('qualification', ''),
            certification=validated_data.get('certification', ''),
            license_number=validated_data.get('license_number', ''),
            bio=validated_data.get('bio', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender', 'Male'),
            working_days=working_days,
            start_time=validated_data.get('start_time', '08:00 AM'),
            end_time=validated_data.get('end_time', '05:00 PM'),
            status=status_val
        )

        return trainer
