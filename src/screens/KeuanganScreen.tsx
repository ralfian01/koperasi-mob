import React from 'react';
import { View, Text } from 'react-native';
// FIX: Corrected import path for 'styled' from nativewind.
import { styled } from "nativewind/styled";

// FIX: Apply styled HOC to enable className prop on components.
const StyledView = styled(View);
const StyledText = styled(Text);

const KeuanganScreen = () => {
    return (
        <StyledView className="flex-1 justify-center items-center bg-slate-100 p-4">
            <StyledText className="text-xl font-bold text-slate-800 mb-2">Manajemen Keuangan</StyledText>
            <StyledText className="text-slate-600 text-center">Fitur jurnal, neraca, dan laporan keuangan lainnya akan ada di sini.</StyledText>
        </StyledView>
    );
};

export default KeuanganScreen;