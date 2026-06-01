import { PageTitle } from './PageEmptyState';

function PageLayout({
  title,
  titleAlign = 'left',
  description,
  children,
  maxWidth = 'max-w-6xl',
  className = '',
}) {
  return (
    <div className={`page-shell mx-auto ${maxWidth} ${className}`}>
      <PageTitle align={titleAlign}>{title}</PageTitle>
      {description && (
        <p className={`mt-2 text-sm text-black/70 ${titleAlign === 'center' ? 'text-center' : ''}`}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export default PageLayout;
