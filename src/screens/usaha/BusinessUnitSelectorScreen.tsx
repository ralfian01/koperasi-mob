import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../../contexts/NotificationContext';
import { BusinessUnit } from '../../types';

const API_ENDPOINT = 'https://api.majukoperasiku.my.id/manage/business';

const BusinessUnitCard: React.FC<{ unit: BusinessUnit; onSelect: (unit: BusinessUnit) => void; }> = ({ unit, onSelect }) => (
    <View className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">
        <View>
            <Text className="font-bold text-slate-800 text-lg">{unit.name}</Text>
            <Text className="text-xs text-slate-500">{unit.outlets?.length || 0} Outlet</Text>
        </View>
        <TouchableOpacity
            onPress={() => onSelect(unit)}
            className="mt-4 h-10 px-4 bg-indigo-600 justify-center items-center rounded-lg"
        >
            <Text className="text-white font-semibold text-sm">Buka Portal</Text>
        </TouchableOpacity>
    </View>
);

const BusinessUnitSelectorScreen = () => {
    const navigation = useNavigation<any>();
    const { addNotification } = useNotification();
    const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBusinessUnits = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINT);
            const result = await response.json();
            if (response.ok && result.data?.data) {
                setBusinessUnits(result.data.data);
            } else {
                throw new Error(result.message || 'Gagal memuat data');
            }
        } catch (err: any) {
            addNotification(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchBusinessUnits();
    }, [fetchBusinessUnits]);

    const handleSelectUnit = (unit: BusinessUnit) => {
        navigation.navigate('UnitDashboard', { unitId: unit.id, unitName: unit.name });
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#4f46e5" className="mt-10" />;
    }

    return (
        <FlatList
            data={businessUnits}
            renderItem={({ item }) => <BusinessUnitCard unit={item} onSelect={handleSelectUnit} />}
            keyExtractor={(item) => item.id.toString()}
            className="p-4 bg-slate-100"
            ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">Tidak ada unit usaha.</Text>}
        />
    );
};

export default BusinessUnitSelectorScreen;
