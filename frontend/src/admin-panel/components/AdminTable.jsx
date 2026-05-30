function AdminTable({ columns, children, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[#f8f9fb] text-xs font-semibold uppercase tracking-wide text-black/55">
          <tr>
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/8 bg-white">{children}</tbody>
      </table>
      {!children && (
        <p className="bg-white px-4 py-10 text-center text-sm text-black/50">{emptyMessage}</p>
      )}
    </div>
  );
}

export default AdminTable;
