from django.db import models
from django.conf import settings
from decimal import Decimal


class Transaction(models.Model):
    """Transaction model for all wallet operations"""
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
        ('fee', 'Fee'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Amount details
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    withdrawal_fee = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    vat_fee = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    total_fees = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=15, decimal_places=2)  # Amount after fees
    
    # Source and destination
    from_wallet = models.ForeignKey(
        'wallets.Wallet',
        on_delete=models.CASCADE,
        related_name='outgoing_transactions',
        null=True,
        blank=True
    )
    to_wallet = models.ForeignKey(
        'wallets.Wallet',
        on_delete=models.CASCADE,
        related_name='incoming_transactions',
        null=True,
        blank=True
    )
    to_bank_account = models.ForeignKey(
        'accounts.BankAccount',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    
    # Payment gateway reference (for deposits)
    payment_gateway_id = models.CharField(max_length=255, blank=True)
    
    # Admin approval
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_transactions'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.get_transaction_type_display()} - ${self.amount} ({self.status})"
    
    def calculate_withdrawal_fees(self, amount):
        """Calculate withdrawal fees: 3.5% withdrawal + 7.5% VAT = 11% total"""
        amount_decimal = Decimal(str(amount))
        
        # Withdrawal fee: 3.5% of amount
        self.withdrawal_fee = (amount_decimal * Decimal('0.035')).quantize(Decimal('0.01'))
        
        # VAT fee: 7.5% of amount
        self.vat_fee = (amount_decimal * Decimal('0.075')).quantize(Decimal('0.01'))
        
        # Total fees
        self.total_fees = self.withdrawal_fee + self.vat_fee
        
        # Net amount (what user receives)
        self.net_amount = amount_decimal - self.total_fees
        
        return {
            'withdrawal_fee': self.withdrawal_fee,
            'vat_fee': self.vat_fee,
            'total_fees': self.total_fees,
            'net_amount': self.net_amount
        }
    
    @classmethod
    def create_deposit(cls, user, amount, payment_gateway_id):
        """Create a deposit transaction"""
        from wallets.models import Wallet
        
        savings_wallet, _ = Wallet.get_or_create_user_wallets(user)
        
        transaction = cls.objects.create(
            user=user,
            transaction_type='deposit',
            amount=amount,
            net_amount=amount,
            to_wallet=savings_wallet,
            payment_gateway_id=payment_gateway_id,
            status='completed'  # Deposits are auto-completed after payment gateway confirmation
        )
        
        # Add funds to savings wallet
        savings_wallet.add_funds(amount)
        
        return transaction
    
    @classmethod
    def create_withdrawal(cls, user, amount, bank_account):
        """Create a withdrawal transaction (requires admin approval)"""
        from wallets.models import Wallet
        
        savings_wallet = Wallet.objects.get(user=user, wallet_type='savings')
        
        # Check if user has sufficient balance
        if savings_wallet.balance < Decimal(str(amount)):
            raise ValueError("Insufficient balance")
        
        transaction = cls.objects.create(
            user=user,
            transaction_type='withdrawal',
            amount=amount,
            from_wallet=savings_wallet,
            to_bank_account=bank_account,
            status='pending'
        )
        
        # Calculate fees
        transaction.calculate_withdrawal_fees(amount)
        transaction.save()
        
        return transaction
    
    @classmethod
    def create_transfer(cls, user, amount, from_wallet_type, to_wallet_type):
        """Create a transfer between wallets (requires admin approval)"""
        from wallets.models import Wallet
        
        from_wallet = Wallet.objects.get(user=user, wallet_type=from_wallet_type)
        to_wallet = Wallet.objects.get(user=user, wallet_type=to_wallet_type)
        
        # Check if user has sufficient balance
        if from_wallet.balance < Decimal(str(amount)):
            raise ValueError("Insufficient balance")
        
        transaction = cls.objects.create(
            user=user,
            transaction_type='transfer',
            amount=amount,
            net_amount=amount,  # Transfers between own wallets are fee-free
            from_wallet=from_wallet,
            to_wallet=to_wallet,
            status='pending'
        )
        
        return transaction
