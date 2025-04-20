
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 mt-8"> {/* mt-8 adds margin top */}
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Examind. All rights reserved. | Academic Prototype
      </div>
    </footer>
  );
};

export default Footer;