import React from 'react';

/**
 * Footer komponens
 * Az alkalmazás minden oldalán konzisztens láblécet biztosít
 * Copyright információval
 */
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark-surface p-4 w-full">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SoltAI Solutions. Minden jog fenntartva.
      </div>
    </footer>
  );
} 