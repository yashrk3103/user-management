import { UserStatus } from '../types';

interface StatusBadgeProps {
  status: UserStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = {
    active: {
      bg: '#ECFDF3',
      text: '#027A48',
      border: '#ABEFC6',
      label: 'Active',
    },
    inactive: {
      bg: '#F2F4F7',
      text: '#667085',
      border: '#D0D5DD',
      label: 'Inactive',
    },
  };

  const style = statusStyles[status];

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
