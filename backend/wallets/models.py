from django.db import models
from django.conf import settings
from decimal import Decimal


class Wallet(models.Model):
    """Base wallet model for all wallet types"""
    WALLET_TYPES = [
        ('company', 'Company Wallet'),
        ('savings', 'Savings Wallet'),
        ('trading', 'Trading Wallet'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='wallets',
        null=True,
        blank=True
    )
    wallet_type = models.CharField(max_length=20, choices=WALLET_TYPES)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['user', 'wallet_type']]
        ordering = ['-created_at']
    
    def __str__(self):
        if self.wallet_type == 'company':
            return f"Company Wallet - Balance: ${self.balance}"
        return f"{self.user.full_name} - {self.get_wallet_type_display()} - ${self.balance}"
    
    def add_funds(self, amount):
        """Add funds to wallet"""
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += Decimal(str(amount))
        self.save()
        return self.balance
    
    def deduct_funds(self, amount):
        """Deduct funds from wallet"""
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if self.balance < Decimal(str(amount)):
            raise ValueError("Insufficient balance")
        self.balance -= Decimal(str(amount))
        self.save()
        return self.balance
    
    @classmethod
    def get_company_wallet(cls):
        """Get or create the company wallet"""
        wallet, created = cls.objects.get_or_create(
            wallet_type='company',
            user=None,
            defaults={'balance': 0.00}
        )
        return wallet
    
    @classmethod
    def get_or_create_user_wallets(cls, user):
        """Get or create savings and trading wallets for a user"""
        savings_wallet, _ = cls.objects.get_or_create(
            user=user,
            wallet_type='savings',
            defaults={'balance': 0.00}
        )
        trading_wallet, _ = cls.objects.get_or_create(
            user=user,
            wallet_type='trading',
            defaults={'balance': 0.00}
        )
        return savings_wallet, trading_wallet
