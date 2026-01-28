from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, BankAccount


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'contact_number', 'password', 'password_confirm', 'two_factor_enabled']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        two_factor_enabled = validated_data.pop('two_factor_enabled', False)
        
        user = User.objects.create_user(**validated_data)
        
        # Generate 2FA secret if enabled
        if two_factor_enabled:
            user.two_factor_enabled = True
            user.generate_2fa_secret()
        
        # Create user wallets
        from wallets.models import Wallet
        Wallet.get_or_create_user_wallets(user)
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'full_name', 'contact_number', 'two_factor_enabled', 'created_at']
        read_only_fields = ['id', 'created_at']


class TwoFactorSetupSerializer(serializers.Serializer):
    """Serializer for 2FA setup"""
    enable = serializers.BooleanField()


class TwoFactorVerifySerializer(serializers.Serializer):
    """Serializer for 2FA token verification"""
    token = serializers.CharField(max_length=6)


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    two_factor_token = serializers.CharField(max_length=6, required=False, allow_blank=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        two_factor_token = data.get('two_factor_token', '')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError("Invalid email or password")
            
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")
            
            # Check 2FA if enabled
            if user.two_factor_enabled:
                if not two_factor_token:
                    raise serializers.ValidationError("2FA token required")
                if not user.verify_2fa_token(two_factor_token):
                    raise serializers.ValidationError("Invalid 2FA token")
            
            data['user'] = user
        else:
            raise serializers.ValidationError("Must include email and password")
        
        return data


class BankAccountSerializer(serializers.ModelSerializer):
    """Serializer for bank accounts"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = BankAccount
        fields = ['id', 'user', 'user_name', 'account_name', 'account_number', 'bank_name', 
                  'routing_number', 'swift_code', 'status', 'status_display', 'rejection_reason', 
                  'created_at', 'approved_at']
        read_only_fields = ['id', 'user', 'status', 'rejection_reason', 'created_at', 'approved_at']
    
    def validate(self, data):
        # Check if user already has 2 bank accounts
        user = self.context['request'].user
        if not self.instance:  # Creating new account
            existing_count = BankAccount.objects.filter(user=user).count()
            if existing_count >= 2:
                raise serializers.ValidationError("Maximum 2 bank accounts allowed per user")
        return data


class BankAccountApprovalSerializer(serializers.Serializer):
    """Serializer for bank account approval"""
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
