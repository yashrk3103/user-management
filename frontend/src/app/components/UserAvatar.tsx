import { getAvatarColor, getInitials } from '../utils/colors';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  online?: boolean;
}

export const UserAvatar = ({ 
  name, 
  avatar, 
  size = 'md', 
  showOnline = false,
  online = false 
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const onlineSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const initials = getInitials(name);
  const colors = getAvatarColor(name);

  return (
    <div className="relative inline-block">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium`}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {initials}
        </div>
      )}
      {showOnline && (
        <span
          className={`${onlineSizeClasses[size]} absolute bottom-0 right-0 rounded-full border-2 border-white`}
          style={{ backgroundColor: online ? '#12B76A' : '#98A2B3' }}
        />
      )}
    </div>
  );
};
