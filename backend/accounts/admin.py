from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils import timezone
from .models import User, BankAccount


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    list_display = ['email', 'full_name', 'username', 'contact_number', 'two_factor_enabled', 'is_staff', 'created_at']
    list_filter = ['two_factor_enabled', 'is_staff', 'is_active', 'created_at']
    search_fields = ['email', 'full_name', 'username', 'contact_number']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('full_name', 'contact_number')}),
        ('2FA Settings', {'fields': ('two_factor_enabled', 'two_factor_secret')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'contact_number', 'password1', 'password2'),
        }),
    )


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    """Admin interface for Bank Account approval"""
    list_display = ['user', 'account_name', 'bank_name', 'account_number', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__full_name', 'user__email', 'account_name', 'bank_name', 'account_number']
    readonly_fields = ['created_at', 'updated_at', 'approved_at', 'approved_by']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Account Information', {
            'fields': ('user', 'account_name', 'account_number', 'bank_name', 'routing_number', 'swift_code')
        }),
        ('Approval Status', {
            'fields': ('status', 'rejection_reason', 'approved_by', 'approved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['approve_accounts', 'reject_accounts']
    
    def approve_accounts(self, request, queryset):
        """Bulk approve bank accounts"""
        updated = queryset.filter(status='pending').update(
            status='approved',
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f'{updated} bank accounts approved successfully.')
    approve_accounts.short_description = "Approve selected bank accounts"
    
    def reject_accounts(self, request, queryset):
        """Bulk reject bank accounts"""
        updated = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f'{updated} bank accounts rejected.')
    reject_accounts.short_description = "Reject selected bank accounts"
