const API_BASE_URL = 'http://127.0.0.1:5000';

// Define API interfaces matching your Flask backend
export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  access_token?: string;
}

export interface BackendPredictPayload {
  tenure: number;
  monthly_charges: number;
  contract: string;
}

export interface PredictResponse {
  churn?: boolean;
  probability: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
}
export interface UserProfileResponse {
  username: string;
  email?: string;
}
//  ------------ Fetch Wrapper ---

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Request failed');
  }

  return data as T;
}

export const signupUser = (userData: SignUpPayload) =>
  apiClient<AuthResponse>('/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const loginUser = (credentials: LoginPayload): Promise<AuthResponse> =>
  apiClient<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

// Predict churn status & probability
export const predictChurn = (payload: BackendPredictPayload) =>
  apiClient<PredictResponse>('/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
// Verify session and get user details before loading dashboard
export const getProfile = () =>
  apiClient<UserProfileResponse>('/about');