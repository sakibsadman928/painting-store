import Address from "../models/Address.js";

const addAddress = async (req, res) => {
    try {
        const { firstName, lastName, address, city } = req.body;

        const addressData = {
            userId: req.userId,
            firstName,
            lastName,
            address,
            city,
            country: "Bangladesh"
        };

        const userAddresses = await Address.find({ userId: req.userId });
        if (userAddresses.length === 0) {
            addressData.isDefault = true;
        }

        const newAddress = new Address(addressData);
        await newAddress.save();

        res.json({ success: true, message: "Address Added", address: newAddress });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.userId });
        res.json({ success: true, addresses });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateAddress = async (req, res) => {
    try {
        const { id, firstName, lastName, address, city } = req.body;

        const existingAddress = await Address.findOne({ _id: id, userId: req.userId });
        if (!existingAddress) {
            return res.json({ success: false, message: "Address not found" });
        }

        const updateData = {
            firstName,
            lastName,
            address,
            city
        };

        await Address.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Address Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.body;

        const addressToDelete = await Address.findOne({ _id: id, userId: req.userId });
        if (!addressToDelete) {
            return res.json({ success: false, message: "Address not found" });
        }

        await Address.findByIdAndDelete(id);

        if (addressToDelete.isDefault) {
            const remainingAddresses = await Address.find({ userId: req.userId });
            if (remainingAddresses.length > 0) {
                await Address.findByIdAndUpdate(remainingAddresses[0]._id, { isDefault: true });
            }
        }

        res.json({ success: true, message: "Address Deleted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.body;

        const address = await Address.findOne({ _id: id, userId: req.userId });
        if (!address) {
            return res.json({ success: false, message: "Address not found" });
        }

        await Address.updateMany({ userId: req.userId }, { isDefault: false });
        await Address.findByIdAndUpdate(id, { isDefault: true });

        res.json({ success: true, message: "Default Address Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addAddress, getUserAddresses, updateAddress, deleteAddress, setDefaultAddress };