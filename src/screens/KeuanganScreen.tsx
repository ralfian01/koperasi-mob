import React from 'react';
import { View, Text } from 'react-native';

const KeuanganScreen = () => {
    return (
        <View className="flex-1 justify-center items-center bg-slate-100 p-4">
            <Text className="text-xl font-bold text-slate-800 mb-2">Manajemen Keuangan</Text>
            <Text className="text-slate-600 text-center">Fitur jurnal, neraca, dan laporan keuangan lainnya akan ada di sini.</Text>
        </View>
    );
};

export default KeuanganScreen;
