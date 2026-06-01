import { PageTitle } from './PageEmptyState';

function LegalPage({ label, title, children, maxWidth = 'max-w-3xl' }) {
  return (
    <div className="page-shell mx-auto w-full max-w-6xl">
      <div className={maxWidth}>
        {label ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{label}</p>
        ) : null}
        <PageTitle>{title}</PageTitle>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-black/70">{children}</div>
      </div>
    </div>
  );
}

export default LegalPage;
