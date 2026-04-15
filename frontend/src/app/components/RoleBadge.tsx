import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const roleStyles = {
    admin: {
      bg: '#ECFDF3',
      text: '#027A48',
      border: '#ABEFC6',
      label: 'Admin',
    },
    manager: {
      bg: '#FFFAEB',
      text: '#B54708',
      border: '#FEDF89',
      label: 'Manager',
    },
    user: {
      bg: '#F2F4F7',
      text: '#344054',
      border: '#D0D5DD',
      label: 'User',
    },
  };

  const style = roleStyles[role];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {style.label}
    </span>
  );
};
