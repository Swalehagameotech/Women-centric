import Address from '../model/address.js';

const clearDefaultForUser = async (userId, exceptId = null) => {
  const filter = { user: userId, isDefault: true };

  if (exceptId) {
    filter._id = { $ne: exceptId };
  }

  await Address.updateMany(filter, { isDefault: false });
};

export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { fullName, phone, landmark, city, state, postalCode, isDefault = false } = req.body;

    if (!fullName || !phone || !landmark || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Name, number, landmark, city, state, and pincode are required',
      });
    }

    const addressCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = isDefault || addressCount === 0;

    if (shouldBeDefault) {
      await clearDefaultForUser(req.user._id);
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      landmark,
      city,
      state,
      postalCode,
      isDefault: shouldBeDefault,
    });

    res.status(201).json({
      success: true,
      message: 'Address saved',
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const fields = ['fullName', 'phone', 'landmark', 'city', 'state', 'postalCode', 'isDefault'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    if (req.body.isDefault === true) {
      await clearDefaultForUser(req.user._id, address._id);
      address.isDefault = true;
    }

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated',
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    if (address.isDefault) {
      const nextDefault = await Address.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    await clearDefaultForUser(req.user._id, address._id);
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
