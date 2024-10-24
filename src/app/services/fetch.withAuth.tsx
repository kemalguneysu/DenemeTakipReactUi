// api.ts
const getToken = () => {
  return localStorage.getItem('accessToken'); // Token'ı yerel depodan al
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers, // Mevcut başlıkları koru
  };

  const response = await fetch(url, {
      ...options,
      headers,
  });

  if (!response.ok) {
      try {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'API isteği başarısız oldu.');
      } catch (error) {
          throw new Error('API isteği başarısız oldu ve hata yanıtı alınamadı.');
      }
  }

  return response.json(); // JSON formatında yanıt döndür
};

export { fetchWithAuth };
