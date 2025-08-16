import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';
import FloatingActions from './FloatingActions';
import FloatingThemeSwitcher from './FloatingThemeSwitcher';
import NotificationSystem from './NotificationSystem';

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <Chatbot />
      <FloatingActions />
      <FloatingThemeSwitcher />
      <NotificationSystem />
    </>
  );
};

export default Layout;
