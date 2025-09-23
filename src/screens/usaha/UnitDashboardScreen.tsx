import React, { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import usePosData from '../../hooks/usePosData';
import { styled } from "nativewind";

// FIX: Apply styled HOC to enable className prop on components.
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const formatNumberCompact = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} Jt`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)} Rb`;
  return num.toLocaleString('id-ID');
};

const MetricCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <StyledView className="bg-white p-4 rounded-lg shadow-md flex-1">
        <StyledText className="text-sm text-slate-500 font-medium">{title}</StyledText>
        <StyledText className="text-2xl font-bold text-slate-800 mt-1">{value}</StyledText>
    </StyledView>
);

const UnitDashboardScreen = ({ route }: any) => {
    const { unitId, unitName } = route.params;
    const { outlets, products, transactions } = usePosData();

    const { totalRevenue, totalSales, totalProducts } = useMemo(() => {
        const outletIdsInUnit = outlets.filter(o => o.businessUnitId === unitId).map(o => o.id);
        const filteredTransactions = transactions.filter(t => outletIdsInUnit.includes(t.outletId) && t.status === 'Selesai');
        const revenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
        const salesCount = filteredTransactions.length;
        const productsCount = products.filter(p => outletIdsInUnit.includes(p.outletId)).length;
        
        return { totalRevenue: revenue, totalSales: salesCount, totalProducts: productsCount };
    }, [unitId, outlets, products, transactions]);

    return (
        <StyledScrollView className="bg-slate-100 p-4">
            <StyledText className="text-2xl font-bold text-slate-800 mb-4">Dasbor: {unitName}</StyledText>
            
            <StyledView className="flex-row gap-4 mb-6">
                <MetricCard title="Pendapatan" value={`Rp${formatNumberCompact(totalRevenue)}`} />
                <MetricCard title="Penjualan" value={formatNumberCompact(totalSales)} />
            </StyledView>
            <MetricCard title="Total Produk Aktif" value={formatNumberCompact(totalProducts)} />
            
             <StyledView className="bg-white p-4 rounded-lg shadow-md mt-6">
                <StyledText className="text-xl font-bold text-slate-800 mb-2">Menu Cepat</StyledText>
                <StyledText className="text-slate-600 mb-2">Navigasi ke manajemen produk, outlet, dll. akan ditambahkan di sini.</StyledText>
                {/* Future navigation buttons would go here */}
            </StyledView>
        </StyledScrollView>
    );
};

export default UnitDashboardScreen;
