import React, { useMemo } from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import usePosData from '../hooks/usePosData';
import { Product, Variant } from '../types';
import { styled } from 'nativewind';

// FIX: Apply styled HOC to enable className prop on components.
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

const formatNumberCompact = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.', ',')} Juta`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace('.', ',')} Ribu`;
  return num.toLocaleString('id-ID');
};

const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

const MetricCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <StyledView className="bg-white p-4 rounded-lg shadow-md flex-1">
        <StyledText className="text-sm text-slate-500 font-medium">{title}</StyledText>
        <StyledText className="text-2xl font-bold text-slate-800 mt-1">{value}</StyledText>
    </StyledView>
);

const DashboardScreen = () => {
    const { businessUnits, outlets, products, transactions, categories, operationalCosts, variants } = usePosData();

    // This dashboard shows overall data (selectedBusinessUnit is null)
    const totalRevenue = transactions.filter(t => t.status === 'Selesai').reduce((sum, t) => sum + t.total, 0);
    const totalSales = transactions.length;

    const summaryReport = useMemo(() => {
        return businessUnits.map(unit => {
            const outletIdsInUnit = outlets.filter(o => o.businessUnitId === unit.id).map(o => o.id);
            const unitTransactions = transactions.filter(t => outletIdsInUnit.includes(t.outletId));
            const omzet = unitTransactions.filter(t => t.status === 'Selesai').reduce((sum, t) => sum + t.total, 0);
            return { unitId: unit.id, unitName: unit.name, omzet };
        });
    }, [businessUnits, outlets, transactions]);

    return (
        <StyledScrollView className="bg-slate-100 p-4">
            <StyledText className="text-3xl font-bold text-slate-800 mb-4">Dasbor Keseluruhan</StyledText>
            
            <StyledView className="flex-row gap-4 mb-6">
                <MetricCard title="Total Pendapatan" value={`Rp${formatNumberCompact(totalRevenue)}`} />
                <MetricCard title="Total Penjualan" value={formatNumberCompact(totalSales)} />
            </StyledView>

            <StyledView className="bg-white p-4 rounded-lg shadow-md mb-6">
                <StyledText className="text-xl font-bold text-slate-800 mb-2">Laporan Ringkas</StyledText>
                {summaryReport.length > 0 ? (
                    summaryReport.map(report => (
                        <StyledView key={report.unitId} className="flex-row justify-between py-2 border-b border-slate-100">
                            <StyledText className="font-medium text-slate-800">{report.unitName}</StyledText>
                            <StyledText className="text-slate-700">{formatCurrency(report.omzet)}</StyledText>
                        </StyledView>
                    ))
                ) : (
                    <StyledText className="text-center py-6 text-slate-500">Tidak ada data.</StyledText>
                )}
            </StyledView>

            <StyledView className="bg-white p-4 rounded-lg shadow-md">
                <StyledText className="text-xl font-bold text-slate-800 mb-2">Peringatan Stok Rendah</StyledText>
                {/* Simplified low stock view for mobile */}
                <StyledText className="text-center py-6 text-slate-500">Fitur stok rendah akan ditampilkan di sini.</StyledText>
            </StyledView>
        </StyledScrollView>
    );
};

export default DashboardScreen;
