import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { User } from '../../types';
import { styled } from "nativewind";

// FIX: Apply styled HOC to enable className prop on components.
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('https://api.majukoperasiku.my.id/auth/account', {
          method: 'POST',
          headers: { 'Authorization': `Basic ${credentials}`, 'Accept': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login gagal');
      
      const token = result.data?.token;
      if (!token) throw new Error('Token tidak ditemukan');
      
      const userPayload = JSON.parse(atob(token.split('.')[1]));
      const userToLogin: User = {
          id: userPayload.uid_b64 ? atob(userPayload.uid_b64) : `user-${Date.now()}`,
          username: userPayload.username,
          password: '', 
          role: userPayload.username === 'admin' ? 'Admin' : 'Staf',
      };
      
      await login(userToLogin, token);
      addNotification('Login berhasil!', 'success');

    } catch (err: any) {
      addNotification(err.message || 'Terjadi kesalahan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
      <StyledView className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <StyledView className="items-center">
          {/* Placeholder for LogoIcon */}
          <StyledView className="w-12 h-12 bg-red-100 rounded-lg" />
          <StyledText className="mt-4 text-3xl font-bold text-center text-slate-900">Login</StyledText>
          <StyledText className="mt-2 text-sm text-center text-slate-600">Silakan masukkan kredensial Anda.</StyledText>
        </StyledView>

        <StyledView className="space-y-4">
          <StyledTextInput
            className="w-full px-3 py-3 text-gray-900 border border-gray-300 rounded-md"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            autoCapitalize="none"
          />
          <StyledTextInput
            className="w-full px-3 py-3 text-gray-900 border border-gray-300 rounded-md"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </StyledView>

        <StyledTouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="flex-row justify-center w-full px-4 py-3 bg-red-600 rounded-md disabled:bg-red-400"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <StyledText className="text-sm font-medium text-white">Login</StyledText>
          )}
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
