import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const PengaturanScreen = () => {
    const { logout } = useAuth();
    return (
        <View className="flex-1 justify-center items-center bg-slate-100 p-4">
            <Text className="text-xl font-bold text-slate-800 mb-2">Pengaturan Akun</Text>
            <Text className="text-slate-600 text-center mb-6">Manajemen akun pengguna dan hak akses akan ada di sini.</Text>
            <Button title="Logout" onPress={logout} color="#dc2626" />
        </View>
    );
};

export default PengaturanScreen;
