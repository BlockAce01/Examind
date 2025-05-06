
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 mt-8"> {}
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Examind by GigaSync | All rights reserved  
      </div>
    </footer>
  );
};

export default Footer;