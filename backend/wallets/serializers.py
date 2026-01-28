from rest_framework import serializers
from .models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    """Serializer for wallet details"""
    wallet_type_display = serializers.CharField(source='get_wallet_type_display', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Wallet
        fields = ['id', 'user', 'user_name', 'wallet_type', 'wallet_type_display', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'balance', 'created_at', 'updated_at']
