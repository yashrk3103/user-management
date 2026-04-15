import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import { router } from './routes';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: 'var(--toast-bg)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 16px',
              minWidth: '320px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
