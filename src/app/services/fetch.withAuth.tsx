// api.ts
const getToken = () => {
    // Burada token'ı yerel depodan veya başka bir yerden alabilirsiniz
    return localStorage.getItem('accessToken'); // Veya başka bir yöntem
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
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'API isteği başarısız oldu.');
    }
  
    return response.json(); // JSON formatında yanıt döndür
  };
  
  export { fetchWithAuth };
  