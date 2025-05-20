import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className || ''}`}>
      <div className="bg-primary p-1 rounded text-white mr-2">
        <Building2 size={24} />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-primary text-lg leading-tight">Dhiya Infrastructure</span>
      </div>
    </Link>
  );
};

export default Logo;