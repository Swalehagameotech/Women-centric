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
    <div className={`mx-auto ${maxWidth} px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
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
