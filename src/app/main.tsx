import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginForm } from '../components/login'; // LoginForm bileşeninizin doğru yolunu buraya ekleyin

// Kendi client ID'nizi buraya ekleyin
// const clientId = '1057524497428-2v0rc83ou386nlvv53ubsq0km4md06bo.apps.googleusercontent.com';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={clientId}>
//       <LoginForm clientId={clientId} /> {/* clientId prop'unu LoginForm'a geçiriyoruz */}
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );
