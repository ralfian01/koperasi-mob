import React, { useMemo } from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import usePosData from '../hooks/usePosData';
import { Product, Variant } from '../types';

const formatNumberCompact = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.', ',')} Juta`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace('.', ',')} Ribu`;
  return num.toLocaleString('id-ID');
};

const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

const MetricCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <View className="bg-white p-4 rounded-lg shadow-md flex-1">
        <Text className="text-sm text-slate-500 font-medium">{title}</Text>
        <Text className="text-2xl font-bold text-slate-800 mt-1">{value}</Text>
    </View>
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
        <ScrollView className="bg-slate-100 p-4">
            <Text className="text-3xl font-bold text-slate-800 mb-4">Dasbor Keseluruhan</Text>
            
            <View className="flex-row gap-4 mb-6">
                <MetricCard title="Total Pendapatan" value={`Rp${formatNumberCompact(totalRevenue)}`} />
                <MetricCard title="Total Penjualan" value={formatNumberCompact(totalSales)} />
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-xl font-bold text-slate-800 mb-2">Laporan Ringkas</Text>
                {summaryReport.length > 0 ? (
                    summaryReport.map(report => (
                        <View key={report.unitId} className="flex-row justify-between py-2 border-b border-slate-100">
                            <Text className="font-medium text-slate-800">{report.unitName}</Text>
                            <Text className="text-slate-700">{formatCurrency(report.omzet)}</Text>
                        </View>
                    ))
                ) : (
                    <Text className="text-center py-6 text-slate-500">Tidak ada data.</Text>
                )}
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md">
                <Text className="text-xl font-bold text-slate-800 mb-2">Peringatan Stok Rendah</Text>
                {/* Simplified low stock view for mobile */}
                <Text className="text-center py-6 text-slate-500">Fitur stok rendah akan ditampilkan di sini.</Text>
            </View>
        </ScrollView>
    );
};

export default DashboardScreen;
