export const emptyAddressForm = {
  fullName: '',
  phone: '',
  landmark: '',
  city: '',
  state: '',
  postalCode: '',
  isDefault: false,
};

export const addressFromApi = (address) => ({
  fullName: address.fullName || '',
  phone: address.phone || '',
  landmark: address.landmark || '',
  city: address.city || '',
  state: address.state || '',
  postalCode: address.postalCode || '',
  isDefault: Boolean(address.isDefault),
});

export const formatAddressDisplay = (address) => {
  const landmark = address.landmark || address.addressLine1 || '';
  const pincode = address.postalCode || '';

  return {
    name: address.fullName,
    phone: address.phone,
    landmark,
    city: address.city,
    state: address.state,
    pincode,
    line: `${landmark}, ${address.city}, ${address.state} ${pincode}`.replace(/^,\s*/, ''),
  };
};
