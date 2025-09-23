import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { styled } from "nativewind";

// FIX: Apply styled HOC to enable className prop on components.
const StyledView = styled(View);
const StyledText = styled(Text);

const PengaturanScreen = () => {
    const { logout } = useAuth();
    return (
        <StyledView className="flex-1 justify-center items-center bg-slate-100 p-4">
            <StyledText className="text-xl font-bold text-slate-800 mb-2">Pengaturan Akun</StyledText>
            <StyledText className="text-slate-600 text-center mb-6">Manajemen akun pengguna dan hak akses akan ada di sini.</StyledText>
            <Button title="Logout" onPress={logout} color="#dc2626" />
        </StyledView>
    );
};

export default PengaturanScreen;
