from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Transaction
from .serializers import (
    TransactionSerializer, DepositSerializer, WithdrawalSerializer,
    TransferSerializer, TransactionApprovalSerializer,
    AdminTransactionStatementSerializer
)
from accounts.models import BankAccount
from wallets.models import Wallet


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for transaction management"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def deposit(self, request):
        """Create a deposit transaction"""
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            try:
                transaction = Transaction.create_deposit(
                    user=request.user,
                    amount=serializer.validated_data['amount'],
                    payment_gateway_id=serializer.validated_data['payment_gateway_id']
                )
                return Response(
                    TransactionSerializer(transaction).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def withdraw(self, request):
        """Create a withdrawal transaction"""
        serializer = WithdrawalSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                bank_account = BankAccount.objects.get(
                    id=serializer.validated_data['bank_account_id'],
                    user=request.user
                )
                transaction = Transaction.create_withdrawal(
                    user=request.user,
                    amount=serializer.validated_data['amount'],
                    bank_account=bank_account
                )
                return Response(
                    TransactionSerializer(transaction).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def transfer(self, request):
        """Create a wallet-to-wallet transfer"""
        serializer = TransferSerializer(data=request.data)
        if serializer.is_valid():
            try:
                transaction = Transaction.create_transfer(
                    user=request.user,
                    amount=serializer.validated_data['amount'],
                    from_wallet_type=serializer.validated_data['from_wallet_type'],
                    to_wallet_type=serializer.validated_data['to_wallet_type']
                )
                return Response(
                    TransactionSerializer(transaction).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Approve, reject, or complete a transaction"""
        transaction = self.get_object()
        serializer = TransactionApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            
            if action_type == 'approve' and transaction.status == 'pending':
                transaction.status = 'approved'
                transaction.approved_by = request.user
                transaction.approved_at = timezone.now()
                transaction.save()
                return Response({'message': 'Transaction approved successfully'})
            
            elif action_type == 'reject' and transaction.status == 'pending':
                transaction.status = 'rejected'
                transaction.rejection_reason = serializer.validated_data.get('rejection_reason', '')
                transaction.save()
                return Response({'message': 'Transaction rejected'})
            
            elif action_type == 'complete' and transaction.status == 'approved':
                try:
                    if transaction.transaction_type == 'withdrawal':
                        # Deduct from savings wallet
                        transaction.from_wallet.deduct_funds(transaction.amount)
                        # Add fees to company wallet
                        company_wallet = Wallet.get_company_wallet()
                        company_wallet.add_funds(transaction.total_fees)
                        
                    elif transaction.transaction_type == 'transfer':
                        # Transfer between user wallets
                        transaction.from_wallet.deduct_funds(transaction.amount)
                        transaction.to_wallet.add_funds(transaction.amount)
                    
                    transaction.status = 'completed'
                    transaction.completed_at = timezone.now()
                    transaction.save()
                    return Response({'message': 'Transaction completed successfully'})
                except Exception as e:
                    return Response(
                        {'error': f'Failed to complete transaction: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            return Response(
                {'error': 'Invalid action for current transaction status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_statement(self, request):
        """Get user's transaction statement"""
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def admin_statement(self, request):
        """Get admin transaction statement with fee details"""
        # Get all withdrawal and fee transactions
        transactions = Transaction.objects.filter(
            Q(transaction_type='withdrawal') | Q(transaction_type='fee')
        )
        serializer = AdminTransactionStatementSerializer(transactions, many=True)
        
        # Calculate totals
        total_fees = sum(t.total_fees for t in transactions if t.transaction_type == 'withdrawal')
        total_withdrawal_fees = sum(t.withdrawal_fee for t in transactions if t.transaction_type == 'withdrawal')
        total_vat_fees = sum(t.vat_fee for t in transactions if t.transaction_type == 'withdrawal')
        
        return Response({
            'transactions': serializer.data,
            'summary': {
                'total_fees_collected': float(total_fees),
                'total_withdrawal_fees': float(total_withdrawal_fees),
                'total_vat_fees': float(total_vat_fees),
            }
        })
