from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.utils import timezone
from .models import User, BankAccount
from .serializers import (
    UserRegistrationSerializer, UserSerializer, LoginSerializer,
    TwoFactorSetupSerializer, TwoFactorVerifySerializer,
    BankAccountSerializer, BankAccountApprovalSerializer
)
import qrcode
import io
import base64


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """User registration endpoint"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            response_data = {
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            }
            
            # Include 2FA QR code if enabled
            if user.two_factor_enabled:
                qr_uri = user.get_2fa_qr_code()
                
                # Generate QR code image
                qr = qrcode.QRCode(version=1, box_size=10, border=5)
                qr.add_data(qr_uri)
                qr.make(fit=True)
                img = qr.make_image(fill_color="black", back_color="white")
                
                # Convert to base64
                buffer = io.BytesIO()
                img.save(buffer, format='PNG')
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                response_data['qr_code'] = f"data:image/png;base64,{img_str}"
                response_data['secret'] = user.two_factor_secret
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """User login endpoint with 2FA support"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Login successful'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout endpoint"""
        logout(request)
        return Response({'message': 'Logout successful'})
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user details"""
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'])
    def setup_2fa(self, request):
        """Setup or disable 2FA"""
        serializer = TwoFactorSetupSerializer(data=request.data)
        if serializer.is_valid():
            enable = serializer.validated_data['enable']
            user = request.user
            
            if enable and not user.two_factor_enabled:
                user.generate_2fa_secret()
                user.two_factor_enabled = True
                user.save()
                
                qr_uri = user.get_2fa_qr_code()
                
                # Generate QR code image
                qr = qrcode.QRCode(version=1, box_size=10, border=5)
                qr.add_data(qr_uri)
                qr.make(fit=True)
                img = qr.make_image(fill_color="black", back_color="white")
                
                buffer = io.BytesIO()
                img.save(buffer, format='PNG')
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                return Response({
                    'message': '2FA enabled successfully',
                    'qr_code': f"data:image/png;base64,{img_str}",
                    'secret': user.two_factor_secret
                })
            
            elif not enable and user.two_factor_enabled:
                user.two_factor_enabled = False
                user.two_factor_secret = None
                user.save()
                return Response({'message': '2FA disabled successfully'})
            
            return Response({'message': 'No change made'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_2fa(self, request):
        """Verify 2FA token"""
        serializer = TwoFactorVerifySerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            if request.user.verify_2fa_token(token):
                return Response({'message': 'Token verified successfully'})
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankAccountViewSet(viewsets.ModelViewSet):
    """ViewSet for bank account management"""
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return BankAccount.objects.all()
        return BankAccount.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Approve or reject bank account"""
        bank_account = self.get_object()
        serializer = BankAccountApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            
            if action_type == 'approve':
                bank_account.status = 'approved'
                bank_account.approved_by = request.user
                bank_account.approved_at = timezone.now()
                bank_account.save()
                return Response({'message': 'Bank account approved successfully'})
            
            elif action_type == 'reject':
                bank_account.status = 'rejected'
                bank_account.rejection_reason = serializer.validated_data.get('rejection_reason', '')
                bank_account.save()
                return Response({'message': 'Bank account rejected'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
