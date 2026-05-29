function LegalPage({ label, title, children }) {
  return (
    <div className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{label}</p>
        <h1 className="mt-4 font-serif text-4xl text-black">{title}</h1>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-black/70">{children}</div>
      </div>
    </div>
  );
}

export default LegalPage;
