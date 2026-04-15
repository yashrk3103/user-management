// Generate deterministic avatar colors based on name
export const getAvatarColor = (name: string): { bg: string; text: string } => {
  const colors = [
    { bg: '#FEF3C7', text: '#92400E' }, // yellow
    { bg: '#DBEAFE', text: '#1E40AF' }, // blue
    { bg: '#FCE7F3', text: '#9F1239' }, // pink
    { bg: '#D1FAE5', text: '#065F46' }, // green
    { bg: '#EDE9FE', text: '#5B21B6' }, // purple
    { bg: '#FED7AA', text: '#9A3412' }, // orange
    { bg: '#E0E7FF', text: '#3730A3' }, // indigo
    { bg: '#FECACA', text: '#991B1B' }, // red
  ];

  const firstChar = name.charAt(0).toUpperCase();
  const index = firstChar.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name
export const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Generate random password
export const generatePassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
