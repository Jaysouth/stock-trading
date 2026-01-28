from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Wallet
from .serializers import WalletSerializer


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for wallet viewing (read-only for users)"""
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Wallet.objects.all()
        return Wallet.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_wallets(self, request):
        """Get current user's wallets"""
        savings_wallet, trading_wallet = Wallet.get_or_create_user_wallets(request.user)
        
        return Response({
            'savings_wallet': WalletSerializer(savings_wallet).data,
            'trading_wallet': WalletSerializer(trading_wallet).data,
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def company_wallet(self, request):
        """Get company wallet (admin only)"""
        company_wallet = Wallet.get_company_wallet()
        return Response(WalletSerializer(company_wallet).data)
