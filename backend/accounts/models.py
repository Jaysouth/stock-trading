from django.contrib.auth.models import AbstractUser
from django.db import models
import pyotp


class User(AbstractUser):
    """Custom User model with 2FA support"""
    full_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    
    # 2FA fields
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    def generate_2fa_secret(self):
        """Generate a new 2FA secret"""
        self.two_factor_secret = pyotp.random_base32()
        self.save()
        return self.two_factor_secret
    
    def verify_2fa_token(self, token):
        """Verify a 2FA token"""
        if not self.two_factor_enabled or not self.two_factor_secret:
            return False
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)
    
    def get_2fa_qr_code(self):
        """Get provisioning URI for QR code"""
        if not self.two_factor_secret:
            self.generate_2fa_secret()
        return pyotp.totp.TOTP(self.two_factor_secret).provisioning_uri(
            name=self.email,
            issuer_name='Stock Trading App'
        )


class BankAccount(models.Model):
    """User bank accounts for withdrawals"""
    STATUS_CHOICES = [
        ('pending', 'Pending Admin Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts')
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=255)
    routing_number = models.CharField(max_length=50, blank=True)
    swift_code = models.CharField(max_length=50, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                    related_name='approved_bank_accounts')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.account_name} - {self.bank_name} ({self.status})"
