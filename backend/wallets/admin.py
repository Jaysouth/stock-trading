from django.contrib import admin
from .models import Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """Admin interface for Wallet model"""
    list_display = ['get_owner', 'wallet_type', 'balance', 'created_at', 'updated_at']
    list_filter = ['wallet_type', 'created_at']
    search_fields = ['user__full_name', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Wallet Information', {
            'fields': ('user', 'wallet_type', 'balance')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_owner(self, obj):
        """Display wallet owner"""
        if obj.wallet_type == 'company':
            return 'Company (Admin)'
        return obj.user.full_name if obj.user else 'N/A'
    get_owner.short_description = 'Owner'
