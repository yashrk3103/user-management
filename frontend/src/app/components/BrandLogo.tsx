interface BrandLogoProps {
  size?: number;
  rounded?: number;
}

export const BrandLogo = ({ size = 32, rounded = 10 }: BrandLogoProps) => {
  return (
    <div
      aria-hidden="true"
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${rounded}px`,
        border: '1px solid var(--logo-border)',
        background:
          'linear-gradient(140deg, var(--logo-bg-from) 0%, var(--logo-bg-to) 100%)',
        boxShadow: '0 6px 14px color-mix(in srgb, var(--logo-shadow) 22%, transparent)',
      }}
    >
      <div
        className="absolute"
        style={{
          width: '58%',
          height: '58%',
          borderRadius: `${Math.max(rounded - 4, 6)}px`,
          border: '1px solid color-mix(in srgb, var(--logo-mark) 36%, transparent)',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '14%',
          height: '14%',
          borderRadius: '999px',
          backgroundColor: 'var(--logo-mark)',
          top: '24%',
          left: '24%',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '14%',
          height: '14%',
          borderRadius: '999px',
          backgroundColor: 'var(--logo-mark)',
          right: '24%',
          top: '24%',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '14%',
          height: '14%',
          borderRadius: '999px',
          backgroundColor: 'var(--logo-mark)',
          bottom: '24%',
          left: '24%',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '14%',
          height: '14%',
          borderRadius: '999px',
          backgroundColor: 'var(--logo-mark)',
          right: '24%',
          bottom: '24%',
        }}
      />
    </div>
  );
};