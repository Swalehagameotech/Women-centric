function AdminPageShell({ title, description, children }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1f1419]">{title}</h2>
      {description && <p className="mt-1 text-sm text-black/55">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default AdminPageShell;
