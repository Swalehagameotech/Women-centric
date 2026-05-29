const inputClass =
  'mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

function AddressFormFields({ form, onChange }) {
  const set = (field) => (e) => onChange({ ...form, [field]: e.target.value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        <span className="font-medium text-black">Name *</span>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={set('fullName')}
          className={inputClass}
          placeholder="Your full name"
        />
      </label>

      <label className="block text-sm sm:col-span-2">
        <span className="font-medium text-black">Number *</span>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={set('phone')}
          className={inputClass}
          placeholder="10-digit mobile number"
        />
      </label>

      <label className="block text-sm sm:col-span-2">
        <span className="font-medium text-black">Landmark *</span>
        <input
          type="text"
          required
          value={form.landmark}
          onChange={set('landmark')}
          className={inputClass}
          placeholder="House no., street, area, near landmark"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-black">City *</span>
        <input
          type="text"
          required
          value={form.city}
          onChange={set('city')}
          className={inputClass}
          placeholder="City"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-black">State *</span>
        <input
          type="text"
          required
          value={form.state}
          onChange={set('state')}
          className={inputClass}
          placeholder="State"
        />
      </label>

      <label className="block text-sm sm:col-span-2">
        <span className="font-medium text-black">Pincode *</span>
        <input
          type="text"
          required
          inputMode="numeric"
          value={form.postalCode}
          onChange={set('postalCode')}
          className={inputClass}
          placeholder="6-digit pincode"
        />
      </label>
    </div>
  );
}

export default AddressFormFields;
