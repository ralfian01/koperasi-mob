import React from 'react';
import { View, Text } from 'react-native';

const KoperasiScreen = () => {
    return (
        <View className="flex-1 justify-center items-center bg-slate-100 p-4">
            <Text className="text-xl font-bold text-slate-800 mb-2">Manajemen Koperasi</Text>
            <Text className="text-slate-600 text-center">Fitur untuk manajemen anggota, simpanan, dan pinjaman akan ada di sini.</Text>
        </View>
    );
};

export default KoperasiScreen;
