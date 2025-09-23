import React from 'react';
import { View, Text } from 'react-native';
import { styled } from "nativewind";

// FIX: Apply styled HOC to enable className prop on components.
const StyledView = styled(View);
const StyledText = styled(Text);

const PengajuanScreen = () => {
    return (
        <StyledView className="flex-1 justify-center items-center bg-slate-100 p-4">
            <StyledText className="text-xl font-bold text-slate-800 mb-2">Pengajuan RAB</StyledText>
            <StyledText className="text-slate-600 text-center">Fitur untuk membuat dan melacak pengajuan akan diimplementasikan di sini.</StyledText>
        </StyledView>
    );
};

export default PengajuanScreen;
