from django.contrib import admin
from django.utils import timezone
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin interface for Transaction approval and monitoring"""
    list_display = ['user', 'transaction_type', 'amount', 'total_fees', 'net_amount', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['user__full_name', 'user__email', 'payment_gateway_id']
    readonly_fields = ['withdrawal_fee', 'vat_fee', 'total_fees', 'net_amount', 'created_at', 'updated_at', 'completed_at', 'approved_at', 'approved_by']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('user', 'transaction_type', 'status', 'amount')
        }),
        ('Fee Breakdown', {
            'fields': ('withdrawal_fee', 'vat_fee', 'total_fees', 'net_amount')
        }),
        ('Wallet & Account Details', {
            'fields': ('from_wallet', 'to_wallet', 'to_bank_account', 'payment_gateway_id')
        }),
        ('Approval Information', {
            'fields': ('approved_by', 'approved_at', 'rejection_reason')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_at', 'updated_at', 'completed_at')
        }),
    )
    
    actions = ['approve_transactions', 'reject_transactions', 'complete_transactions']
    
    def approve_transactions(self, request, queryset):
        """Bulk approve transactions"""
        updated = queryset.filter(status='pending').update(
            status='approved',
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f'{updated} transactions approved successfully.')
    approve_transactions.short_description = "Approve selected transactions"
    
    def reject_transactions(self, request, queryset):
        """Bulk reject transactions"""
        updated = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f'{updated} transactions rejected.')
    reject_transactions.short_description = "Reject selected transactions"
    
    def complete_transactions(self, request, queryset):
        """Bulk complete approved transactions"""
        from wallets.models import Wallet
        from decimal import Decimal
        
        count = 0
        for transaction in queryset.filter(status='approved'):
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
                count += 1
            except Exception as e:
                self.message_user(request, f'Error completing transaction {transaction.id}: {str(e)}', level='error')
        
        self.message_user(request, f'{count} transactions completed successfully.')
    complete_transactions.short_description = "Complete approved transactions"
