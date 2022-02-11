import NavBar from '../components/nav';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NavBar></NavBar>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
