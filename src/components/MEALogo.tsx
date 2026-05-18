
import React from 'react';

interface MEALogoProps {
  className?: string;
}

const MEALogo: React.FC<MEALogoProps> = ({ className = "h-16 w-16" }) => {
  return (
    <div className={`relative ${className}`}>
      <img src="/logoanim.svg" alt="MEA Logo" className="h-full w-full" />
    </div>
  );
};

export default MEALogo;