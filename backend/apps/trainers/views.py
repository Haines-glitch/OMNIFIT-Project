from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from apps.authentication.permissions import IsAdminRole
from apps.trainers.models import Trainer
from apps.members.models import Member
from apps.trainers.serializers import (
    TrainerSerializer, 
    TrainerCreateSerializer,
    AssignedMemberSerializer
)

User = get_user_model()

def standard_response(success=True, message="", data=None, errors=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": success,
        "message": message,
        "data": data,
        "errors": errors
    }, status=status_code)


class TrainerListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        trainers = Trainer.objects.select_related('user').all().order_by('-created_at')
        serializer = TrainerSerializer(trainers, many=True)
        return standard_response(
            success=True,
            message="Trainers retrieved successfully.",
            data=serializer.data
        )

    def post(self, request):
        serializer = TrainerCreateSerializer(data=request.data)
        if not serializer.is_valid():
            errors = serializer.errors
            err_msg = "Validation failed."
            if "email" in errors:
                err_msg = errors["email"][0]
            elif "password" in errors:
                err_msg = errors["password"][0]
            return standard_response(
                success=False,
                message=err_msg,
                errors=errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        trainer = serializer.save()
        return standard_response(
            success=True,
            message="Trainer account created successfully.",
            data=TrainerSerializer(trainer).data,
            status_code=status.HTTP_201_CREATED
        )


class TrainerDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_object(self, pk):
        try:
            return Trainer.objects.select_related('user').get(pk=pk)
        except Trainer.DoesNotExist:
            return None

    def get(self, request, pk):
        trainer = self.get_object(pk)
        if not trainer:
            return standard_response(
                success=False,
                message="Trainer not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        serializer = TrainerSerializer(trainer)
        return standard_response(
            success=True,
            message="Trainer details retrieved successfully.",
            data=serializer.data
        )

    def put(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        trainer = self.get_object(pk)
        if not trainer:
            return standard_response(
                success=False,
                message="Trainer not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Update User fields if provided
        user = trainer.user
        if 'full_name' in request.data:
            user.full_name = request.data['full_name']
        if 'phone' in request.data:
            user.phone = request.data['phone']
        if 'status' in request.data:
            user.status = request.data['status']
            trainer.status = request.data['status']
        user.save()

        # Update Trainer fields
        for field in ['specialization', 'experience', 'qualification', 'certification', 'license_number', 'bio', 'working_days', 'start_time', 'end_time', 'date_of_birth', 'gender']:
            if field in request.data:
                setattr(trainer, field, request.data[field])
        trainer.save()

        return standard_response(
            success=True,
            message="Trainer updated successfully.",
            data=TrainerSerializer(trainer).data
        )

    def delete(self, request, pk):
        trainer = self.get_object(pk)
        if not trainer:
            return standard_response(
                success=False,
                message="Trainer not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        user = trainer.user
        trainer.delete()
        user.delete()
        return standard_response(
            success=True,
            message="Trainer deleted successfully."
        )


class AssignMemberToTrainerView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk=None):
        trainer_id = pk or request.data.get('trainer_id')
        member_id = request.data.get('member_id') or request.data.get('user_id')

        if not trainer_id or not member_id:
            return standard_response(
                success=False,
                message="Both trainer_id and member_id are required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            trainer = Trainer.objects.get(pk=trainer_id)
        except Trainer.DoesNotExist:
            try:
                trainer = Trainer.objects.get(user_id=trainer_id)
            except Trainer.DoesNotExist:
                return standard_response(
                    success=False,
                    message="Trainer not found.",
                    status_code=status.HTTP_404_NOT_FOUND
                )

        try:
            member = Member.objects.get(pk=member_id)
        except Member.DoesNotExist:
            try:
                member = Member.objects.get(user_id=member_id)
            except Member.DoesNotExist:
                return standard_response(
                    success=False,
                    message="Member not found.",
                    status_code=status.HTTP_404_NOT_FOUND
                )

        member.assigned_trainer = trainer.user
        member.save()

        return standard_response(
            success=True,
            message=f"Member {member.user.full_name or member.user.email} assigned to Trainer {trainer.user.full_name or trainer.user.email} successfully.",
            data={
                "trainer_id": trainer.id,
                "member_id": member.id,
                "assigned_member": AssignedMemberSerializer(member).data
            }
        )


class MembersForTrainerAssignmentView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        members = Member.objects.select_related('user', 'assigned_trainer').all().order_by('-created_at')
        serialized = []
        for m in members:
            trainer_name = m.assigned_trainer.full_name if m.assigned_trainer else 'Unassigned'
            serialized.append({
                'id': m.id,
                'user_id': m.user.id,
                'membership_no': m.membership_no,
                'full_name': m.user.full_name or m.user.email,
                'email': m.user.email,
                'phone': m.user.phone,
                'membership_plan': m.membership_plan,
                'fitness_goal': m.fitness_goal,
                'assigned_trainer_id': m.assigned_trainer_id,
                'assigned_trainer_name': trainer_name,
                'status': m.status
            })

        return standard_response(
            success=True,
            message="Members list retrieved.",
            data=serialized
        )
