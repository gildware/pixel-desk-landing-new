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

export const loginWithPassword = (
  email: string,
  password: string,
  rememberMe: boolean,
) => {
  return apiClient('/auth/login-password', {
    method: 'POST',
    body: { email, password, rememberMe },
  });
};

export const forgotPassword = (email: string) => {
  return apiClient('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
};

export const validateResetToken = (token: string) => {
  return apiClient(
    `/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
    {
      method: 'GET',
    },
  );
};

export const resetPassword = (
  token: string,
  password: string,
  confirmPassword: string,
  rememberMe: boolean,
) => {
  return apiClient('/auth/reset-password', {
    method: 'POST',
    body: { token, password, confirmPassword, rememberMe },
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
