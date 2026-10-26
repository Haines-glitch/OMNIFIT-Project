from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models
from django.core.mail import send_mail, EmailMultiAlternatives, get_connection
from django.conf import settings
from django.contrib.auth import get_user_model
from apps.authentication.permissions import IsAdminRole
from apps.authentication.models import Notification
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        trainers = Trainer.objects.select_related('user').all().order_by('-created_at')
        serializer = TrainerSerializer(trainers, many=True, context={'request': request})
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
            for field, field_errs in errors.items():
                if isinstance(field_errs, list) and len(field_errs) > 0:
                    err_msg = str(field_errs[0]) if field in ('non_field_errors', '__all__') else f"{field}: {field_errs[0]}"
                    break
                elif isinstance(field_errs, str):
                    err_msg = field_errs
                    break
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
            data=TrainerSerializer(trainer, context={'request': request}).data,
            status_code=status.HTTP_201_CREATED
        )


class TrainerDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

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
        serializer = TrainerSerializer(trainer, context={'request': request})
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

        if 'experience_certificate' in request.FILES:
            trainer.experience_certificate = request.FILES['experience_certificate']

        trainer.save()

        return standard_response(
            success=True,
            message="Trainer updated successfully.",
            data=TrainerSerializer(trainer, context={'request': request}).data
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


class PendingMembersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pending_members = Member.objects.select_related('user', 'assigned_trainer').filter(
            models.Q(user__status__in=['Pending', 'Pending Approval']) | 
            models.Q(status__in=['Pending', 'Pending Approval'])
        ).order_by('-created_at')

        serialized = []
        for m in pending_members:
            trainer_name = m.assigned_trainer.full_name if m.assigned_trainer else 'Unassigned'
            serialized.append({
                'id': m.id,
                'user_id': m.user.id,
                'membership_no': m.membership_no,
                'name': m.user.full_name or m.user.email,
                'full_name': m.user.full_name or m.user.email,
                'email': m.user.email,
                'phone': m.user.phone or '+91 98765 43210',
                'membership_plan': m.membership_plan or 'Platinum VIP',
                'fitness_goal': m.fitness_goal or 'Hypertrophy & Fat Loss',
                'height_cm': m.height_cm,
                'weight_kg': m.weight_kg,
                'bmi': m.bmi,
                'join_date': str(m.join_date),
                'created_at': m.created_at.strftime('%Y-%m-%d %H:%M') if m.created_at else '',
                'assigned_trainer': trainer_name,
                'status': 'Pending Approval'
            })

        return standard_response(
            success=True,
            message="Pending members list retrieved.",
            data=serialized
        )


def dispatch_approval_email(user_email, athlete_name, trainer_name):
    subject = "Welcome to OMNIFIT — Your Athlete Account Has Been Approved!"
    text_content = (
        f"Hello {athlete_name},\n\n"
        f"Great news! Your OMNIFIT athlete membership has been verified and APPROVED by Trainer {trainer_name}.\n\n"
        f"Your athlete account is now ACTIVE. You can log into your dashboard at:\n"
        f"https://omnifit.hainesjosepaulson.dev/login\n\n"
        f"Account Email: {user_email}\n\n"
        f"Welcome to the team!\n"
        f"Best regards,\n"
        f"The OMNIFIT Coaching Staff\n"
    )
    html_content = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#0d0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;">
  <div style="max-width:560px;margin:0 auto;background:#181820;border:1px solid #272733;border-radius:16px;padding:32px;">
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;padding:6px 14px;background:#e50914;color:#fff;font-weight:900;border-radius:6px;font-size:14px;letter-spacing:1.5px;">OMNIFIT</span>
    </div>
    <h2 style="color:#ffffff;margin-top:0;font-size:22px;font-weight:800;">Account Approved!</h2>
    <p style="font-size:15px;line-height:1.6;color:#a1a1aa;">Hello <strong>{athlete_name}</strong>,</p>
    <p style="font-size:15px;line-height:1.6;color:#a1a1aa;">Great news! Your OMNIFIT athlete membership has been verified and approved by <strong>Coach {trainer_name}</strong>.</p>
    <div style="margin:24px 0;padding:18px;background:#121217;border:1px solid #272733;border-radius:12px;">
      <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Account Email</div>
      <div style="font-size:15px;color:#ffffff;font-weight:bold;">{user_email}</div>
      <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;margin-top:12px;margin-bottom:4px;">Clearance Status</div>
      <div style="font-size:14px;color:#10b981;font-weight:bold;">Active &bull; Cleared for Training</div>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://omnifit.hainesjosepaulson.dev/login" style="display:inline-block;background:#e50914;color:#ffffff;padding:14px 32px;font-weight:bold;text-decoration:none;border-radius:10px;font-size:14px;letter-spacing:0.5px;">LOG IN TO ATHLETE COMMAND CENTER &rarr;</a>
    </div>
    <p style="font-size:13px;color:#71717a;margin-bottom:0;">The OMNIFIT High-Performance Coaching Staff</p>
  </div>
</body>
</html>"""

    host_user = getattr(settings, 'EMAIL_HOST_USER', None) or 'hainesjosepaulson123@gmail.com'
    host_pass = getattr(settings, 'EMAIL_HOST_PASSWORD', None) or 'wgcflgwsfdeoyupa'
    from_email = f"OMNIFIT Coaching Team <{host_user}>"

    # Attempt 1: Port 587 (TLS)
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [user_email])
        msg.attach_alternative(html_content, "text/html")
        sent = msg.send(fail_silently=False)
        print(f"[OMNIFIT Email] Sent via Port 587 TLS to {user_email}. Result: {sent}")
        return True, None
    except Exception as e1:
        print(f"[OMNIFIT Email Warning] Port 587 TLS failed: {e1}. Trying fallback Port 465 (SSL)...")

    # Attempt 2: Fallback to Port 465 (Direct SSL)
    try:
        fallback_conn = get_connection(
            host=settings.EMAIL_HOST,
            port=465,
            username=host_user,
            password=host_pass,
            use_ssl=True,
            use_tls=False,
            timeout=10
        )
        msg = EmailMultiAlternatives(subject, text_content, from_email, [user_email], connection=fallback_conn)
        msg.attach_alternative(html_content, "text/html")
        sent = msg.send(fail_silently=False)
        print(f"[OMNIFIT Email] Sent via Port 465 SSL to {user_email}. Result: {sent}")
        return True, None
    except Exception as e2:
        err_msg = f"Port 587 failed: {e1}; Port 465 failed: {e2}"
        print(f"[OMNIFIT Email ERROR] All SMTP attempts failed for {user_email}: {err_msg}")
        return False, err_msg


class ApproveMemberView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        member_id = request.data.get('member_id')
        email = request.data.get('email')
        trainer_name = request.data.get('trainer_name') or 'Anandhu pradeep'

        member = None
        if member_id:
            member = Member.objects.select_related('user', 'assigned_trainer').filter(id=member_id).first()
        if not member and user_id:
            member = Member.objects.select_related('user', 'assigned_trainer').filter(user_id=user_id).first()
        if not member and email:
            member = Member.objects.select_related('user', 'assigned_trainer').filter(user__email__iexact=email).first()

        if not member:
            user = None
            if user_id:
                user = User.objects.filter(id=user_id).first()
            elif email:
                user = User.objects.filter(email__iexact=email).first()

            if not user:
                return standard_response(
                    success=False,
                    message="Member or user account not found.",
                    status_code=status.HTTP_404_NOT_FOUND
                )
            member, _ = Member.objects.get_or_create(user=user)

        user = member.user

        # 1. Update user & member status to Active and assign trainer
        trainer_user = None
        if trainer_name and trainer_name != 'Unassigned':
            trainer_user = User.objects.filter(role='trainer', full_name__icontains=trainer_name).first()
        if not trainer_user and request.user and getattr(request.user, 'role', '') == 'trainer':
            trainer_user = request.user
        if not trainer_user:
            trainer_user = User.objects.filter(role='trainer').first()

        effective_trainer_name = trainer_user.full_name if trainer_user else trainer_name

        user.status = 'Active'
        user.is_active = True
        user.save()

        member.status = 'Active'
        member.is_active = True
        if trainer_user:
            member.assigned_trainer = trainer_user
        member.save()

        # 2. Send official verification approval email
        athlete_name = user.full_name or user.email.split('@')[0]
        email_sent, email_err = dispatch_approval_email(user.email, athlete_name, effective_trainer_name)

        # 3. Create in-app Notification for member
        Notification.objects.create(
            user=user,
            notification_type="Account Approved",
            title="Account Verified by Trainer!",
            message=f"Trainer {effective_trainer_name} has approved your athlete account. You now have full access to OMNIFIT."
        )

        msg = f"Athlete {athlete_name} approved successfully by Trainer {effective_trainer_name}."
        if email_sent:
            msg += f" Verification email dispatched to {user.email}."
        elif email_err:
            msg += f" Note: Email dispatch notice: {email_err}."

        return standard_response(
            success=True,
            message=msg,
            data={
                "user_id": user.id,
                "member_id": member.id,
                "email": user.email,
                "name": athlete_name,
                "status": "Active",
                "assigned_trainer": effective_trainer_name,
                "email_sent": email_sent,
                "email_error": email_err
            }
        )


class RejectMemberView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').lower().strip()
        user_id = request.data.get('user_id')
        member_id = request.data.get('member_id')

        member = None
        if member_id:
            member = Member.objects.filter(id=member_id).first()
        if not member and user_id:
            member = Member.objects.filter(user_id=user_id).first()
        if not member and email:
            member = Member.objects.filter(user__email__iexact=email).first()

        user = member.user if member else User.objects.filter(email__iexact=email).first()
        if not user:
            return standard_response(
                success=False,
                message="User or member not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if user.role in ['admin', 'trainer']:
            return standard_response(
                success=False,
                message="Cannot delete staff or administrator accounts.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        target_email = user.email
        if member:
            member.delete()
        user.delete()

        return standard_response(
            success=True,
            message=f"Member account '{target_email}' has been successfully removed.",
            data={"email": target_email}
        )


class TestSmtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        target = (request.data.get('email') or 'gouthamsreekumar2027@mca.ajce.in').lower().strip()
        trainer = request.data.get('trainer_name') or 'Anandhu pradeep'
        sent, err = dispatch_approval_email(target, target.split('@')[0], trainer)
        return standard_response(
            success=sent,
            message=f"Email dispatch to {target} was successful!" if sent else f"Email dispatch failed: {err}",
            data={
                "target": target,
                "email_sent": sent,
                "email_error": err,
                "host_user": settings.EMAIL_HOST_USER,
                "has_password": bool(settings.EMAIL_HOST_PASSWORD)
            },
            status_code=status.HTTP_200_OK if sent else status.HTTP_500_INTERNAL_SERVER_ERROR
        )



