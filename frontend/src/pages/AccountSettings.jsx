import { useCallback, useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { updateStoredUser } from '../utils/auth';
import PageLayout from '../components/PageLayout';
import AddressFormFields from '../components/AddressFormFields';
import { addressFromApi, emptyAddressForm, formatAddressDisplay } from '../utils/address';

const inputClass =
  'mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

function AccountSettings() {
  const { user, refreshUser, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);

    try {
      const result = await authFetch('/api/addresses');
      setAddresses(result.data || []);
    } catch (err) {
      setAddressError(err.message);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setLoadingProfile(true);
    setProfileMessage('');
    setProfileError('');

    try {
      const result = await authFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileForm),
      });

      setUser(result.data);
      updateStoredUser(result.data);
      await refreshUser();
      setProfileMessage('Your details were updated successfully.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const resetAddressForm = () => {
    setAddressForm(emptyAddressForm);
    setEditingAddressId(null);
    setShowAddressForm(false);
    setAddressError('');
  };

  const startEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm(addressFromApi(address));
    setShowAddressForm(true);
    setAddressMessage('');
    setAddressError('');
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setAddressMessage('');
    setAddressError('');

    try {
      if (editingAddressId) {
        await authFetch(`/api/addresses/${editingAddressId}`, {
          method: 'PUT',
          body: JSON.stringify(addressForm),
        });
        setAddressMessage('Address updated.');
      } else {
        await authFetch('/api/addresses', {
          method: 'POST',
          body: JSON.stringify(addressForm),
        });
        setAddressMessage('Address saved.');
      }

      resetAddressForm();
      await loadAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      await authFetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      setAddressMessage('Address removed.');
      await loadAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await authFetch(`/api/addresses/${addressId}/default`, { method: 'PATCH' });
      setAddressMessage('Default address updated.');
      await loadAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  return (
    <PageLayout title="Account settings" maxWidth="max-w-4xl">
      {/* Profile — existing info + Update */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-black/50">
          Your information
        </h2>

        {profileMessage && (
          <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
            {profileMessage}
          </p>
        )}
        {profileError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</p>
        )}

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-black">Full name</span>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-black">Email</span>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-black">Phone number</span>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
          </label>

          <button type="submit" disabled={loadingProfile} className="btn-solid disabled:opacity-60">
            {loadingProfile ? 'Updating…' : 'Update'}
          </button>
        </form>
      </section>

      {/* Addresses */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-black/50">
              Addresses
            </h2>
            <p className="mt-1 text-sm text-black/60">Saved for checkout and delivery</p>
          </div>
          {!showAddressForm && (
            <button
              type="button"
              onClick={() => {
                setShowAddressForm(true);
                setEditingAddressId(null);
                setAddressForm(emptyAddressForm);
              }}
              className="btn-outline text-sm"
            >
              Add address
            </button>
          )}
        </div>

        {addressMessage && (
          <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
            {addressMessage}
          </p>
        )}
        {addressError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{addressError}</p>
        )}

        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="mt-6 space-y-4 border-t border-black/10 pt-6">
            <AddressFormFields form={addressForm} onChange={setAddressForm} />

            <label className="flex items-center gap-2 text-sm text-black">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                }
                className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
              />
              Set as default address
            </label>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-solid">
                {editingAddressId ? 'Update address' : 'Save address'}
              </button>
              <button type="button" onClick={resetAddressForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {loadingAddresses ? (
            <p className="text-sm text-black/60">Loading addresses…</p>
          ) : addresses.length === 0 ? (
            <p className="rounded-lg border border-dashed border-black/15 bg-stone-50/80 px-4 py-8 text-center text-sm text-black/60">
              No saved addresses yet. Add one for faster checkout.
            </p>
          ) : (
            addresses.map((address) => {
              const display = formatAddressDisplay(address);

              return (
                <article
                  key={address._id}
                  className="rounded-lg border border-black/10 bg-stone-50/50 p-4 text-sm text-black"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold">
                      {display.name}
                      {address.isDefault && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address._id)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Make default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditAddress(address)}
                        className="text-xs font-medium text-black/70 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 leading-relaxed text-black/80">
                    {display.landmark}
                    <br />
                    {display.city}, {display.state} — {display.pincode}
                    <br />
                    {display.phone}
                  </p>
                </article>
              );
            })
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export default AccountSettings;
