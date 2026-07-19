import { apiClient } from './apiClient';

export const requestOtp = (email: string) => {
  return apiClient('/auth/request-otp', {
    method: 'POST',
    body: { email },
  });
};

export const verifyOtp = (email: string, otp: string, rememberMe: boolean) => {
  return apiClient('/auth/verify-otp', {
    method: 'POST',
    body: { email, otp, rememberMe },
  });
};

export const logout = () => {
  return apiClient('/auth/logout', {
    method: 'POST',
  });
};

export const getSession = () => {
  return apiClient('/auth/session', {
    method: 'GET',
  });
};
