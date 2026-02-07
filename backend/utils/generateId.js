const User = require('../models/User');

const generateEmployeeId = async () => {
    // Find the last created user with an ID starting with 'A-'
    const lastUser = await User.findOne({ employeeId: { $regex: /^A-\d+$/ } })
        .sort({ employeeId: -1 }) // Sort descending to get the highest ID
        .select('employeeId');

    let newId = 'A-001';

    if (lastUser && lastUser.employeeId) {
        // Extract the number part
        const lastIdNum = parseInt(lastUser.employeeId.split('-')[1]);

        // Increment
        const nextIdNum = lastIdNum + 1;

        // Pad with zeros (e.g., 1 -> 001, 10 -> 010)
        newId = `A-${nextIdNum.toString().padStart(3, '0')}`;
    }

    return newId;
};

module.exports = generateEmployeeId;
