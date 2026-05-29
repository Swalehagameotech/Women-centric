import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { loggedIn, openAuth } = useAuth();

  if (loggedIn) {
    return children;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Account</p>
      <h1 className="mt-4 font-serif text-3xl text-black">Sign in required</h1>
      <p className="mt-3 text-sm text-black/70">
        Please sign in to view this page and manage your account.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={() => openAuth('login')} className="btn-solid min-w-[140px]">
          Sign in
        </button>
        <button type="button" onClick={() => openAuth('signup')} className="btn-outline min-w-[140px]">
          Create account
        </button>
      </div>
      <Link to="/" className="mt-6 inline-block text-sm text-primary hover:underline">
        Back to home
      </Link>
    </div>
  );
}

export default ProtectedRoute;
