import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminHeader({ title }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-primary/10 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <h1 className="font-serif text-xl font-medium text-[#1f1419] sm:text-2xl">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="rounded-full border border-primary/20 bg-white px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/5 sm:px-4 sm:text-sm"
        >
          ← Back to Site
        </Link>
        <Link
          to="/admin/account"
          className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10 sm:px-4 sm:text-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
            </svg>
          </span>
          <span className="hidden sm:inline">Admin</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 sm:px-4 sm:text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
