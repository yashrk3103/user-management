import { Topbar } from '../components/Topbar';
import { Link } from 'react-router';

export const Documentation = () => {
  const docs = [
    { title: 'User Roles & Permissions', desc: 'Understand access levels for admin, manager, and user.', link: '/users' },
    { title: 'Invite and Onboard Users', desc: 'Best practices for creating and activating accounts.', link: '/users' },
    { title: 'Security & Access Policies', desc: 'Guidance for account hygiene and periodic reviews.', link: '/security' },
    { title: 'Authentication Controls', desc: 'MFA and session policy recommendations.', link: '/authentication' },
  ];

  return (
    <>
      <Topbar pageName="Documentation" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Documentation</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Practical guides for operating your user management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <Link
                key={doc.title}
                to={doc.link}
                className="p-5 rounded-xl border hover:bg-[var(--hover-nav-bg)] transition-colors"
                style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{doc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
