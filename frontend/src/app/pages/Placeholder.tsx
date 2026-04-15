import { Topbar } from '../components/Topbar';

interface PlaceholderProps {
  pageName: string;
}

export const Placeholder = ({ pageName }: PlaceholderProps) => {
  return (
    <>
      <Topbar pageName={pageName} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {pageName}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This page is under construction. The core user management features are fully functional.
          </p>
        </div>
      </div>
    </>
  );
};
