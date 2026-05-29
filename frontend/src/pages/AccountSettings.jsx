import { useCallback, useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { updateStoredUser } from '../utils/auth';
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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
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
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setLoadingPassword(true);

    try {
      await authFetch('/api/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      setPasswordMessage('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setLoadingPassword(false);
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">My account</p>
      <h1 className="mt-2 font-serif text-3xl text-black sm:text-4xl">Account settings</h1>
      <p className="mt-2 text-sm text-black/70">
        Update your profile, password, and delivery addresses.
      </p>

      <section className="mt-10 rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Profile</h2>
        <p className="mt-1 text-sm text-black/60">Name, email, and phone number</p>

        {profileMessage && (
          <p className="mt-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-primary">{profileMessage}</p>
        )}
        {profileError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</p>
        )}

        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
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
            {loadingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Password</h2>
        <p className="mt-1 text-sm text-black/60">Change your sign-in password</p>

        {passwordMessage && (
          <p className="mt-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-primary">{passwordMessage}</p>
        )}
        {passwordError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{passwordError}</p>
        )}

        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-black">Current password</span>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-black">New password</span>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className={inputClass}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-black">Confirm new password</span>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className={inputClass}
              />
            </label>
          </div>

          <button type="submit" disabled={loadingPassword} className="btn-solid disabled:opacity-60">
            {loadingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-black">Delivery addresses</h2>
            <p className="mt-1 text-sm text-black/60">Saved addresses for checkout</p>
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
          <p className="mt-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-primary">{addressMessage}</p>
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
            <p className="text-sm text-black/60">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-black/60">No saved addresses yet.</p>
          ) : (
            addresses.map((address) => {
              const display = formatAddressDisplay(address);

              return (
              <article
                key={address._id}
                className="rounded-xl border border-black/10 p-4 text-sm text-black"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {display.name}
                      {address.isDefault && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                    </p>
                  </div>
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
                  Number: {display.phone}
                </p>
              </article>
            );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default AccountSettings;
