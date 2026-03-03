import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface AgoraTokenResponse {
  token: string;
  channelName: string;
  userId: string;
}

export const getAgoraToken = async (
  channelName: string,
  userId: string,
  role: 'doctor' | 'patient'
): Promise<AgoraTokenResponse> => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get<AgoraTokenResponse>(
    `${API_URL.replace('/api', '')}/api/agora/token`,
    {
      params: { channelName, userId, role },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
