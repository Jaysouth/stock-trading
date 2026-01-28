from rest_framework import serializers
from .models import Transaction
from wallets.serializers import WalletSerializer
from accounts.serializers import BankAccountSerializer


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transaction details"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    from_wallet_details = WalletSerializer(source='from_wallet', read_only=True)
    to_wallet_details = WalletSerializer(source='to_wallet', read_only=True)
    to_bank_account_details = BankAccountSerializer(source='to_bank_account', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'user_name', 'transaction_type', 'transaction_type_display',
            'status', 'status_display', 'amount', 'withdrawal_fee', 'vat_fee', 'total_fees',
            'net_amount', 'from_wallet', 'from_wallet_details', 'to_wallet', 'to_wallet_details',
            'to_bank_account', 'to_bank_account_details', 'payment_gateway_id',
            'approved_by', 'approved_at', 'rejection_reason', 'notes',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'user', 'withdrawal_fee', 'vat_fee', 'total_fees', 'net_amount',
            'approved_by', 'approved_at', 'created_at', 'updated_at', 'completed_at'
        ]


class DepositSerializer(serializers.Serializer):
    """Serializer for deposit creation"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    payment_gateway_id = serializers.CharField(max_length=255)


class WithdrawalSerializer(serializers.Serializer):
    """Serializer for withdrawal creation"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    bank_account_id = serializers.IntegerField()
    
    def validate_bank_account_id(self, value):
        from accounts.models import BankAccount
        try:
            bank_account = BankAccount.objects.get(id=value, user=self.context['request'].user)
            if bank_account.status != 'approved':
                raise serializers.ValidationError("Bank account must be approved before withdrawal")
        except BankAccount.DoesNotExist:
            raise serializers.ValidationError("Bank account not found")
        return value


class TransferSerializer(serializers.Serializer):
    """Serializer for wallet-to-wallet transfer"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    from_wallet_type = serializers.ChoiceField(choices=['savings', 'trading'])
    to_wallet_type = serializers.ChoiceField(choices=['savings', 'trading'])
    
    def validate(self, data):
        if data['from_wallet_type'] == data['to_wallet_type']:
            raise serializers.ValidationError("Cannot transfer to the same wallet")
        return data


class TransactionApprovalSerializer(serializers.Serializer):
    """Serializer for transaction approval"""
    action = serializers.ChoiceField(choices=['approve', 'reject', 'complete'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)


class AdminTransactionStatementSerializer(serializers.ModelSerializer):
    """Serializer for admin transaction statement"""
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user_id', 'user_name', 'transaction_type', 'transaction_type_display',
            'amount', 'withdrawal_fee', 'vat_fee', 'total_fees', 'net_amount',
            'status', 'created_at', 'completed_at'
        ]
