const User = require('../models/user');

const usersToInsert = [
    {
        user_firstname: 'John',
        user_lastname: 'Doe',
        user_job_desc: 'Developer',
        user_email: 'john.doe@example.com',
        user_password: 'hashed_password',
    },
    {
        user_firstname: 'Janny',
        user_lastname: 'Doey',
        user_job_desc: 'Designer',
        user_email: 'janny.doey@example.com',
        user_password: 'hashed_password',
    },
    {
        user_firstname: 'Jean',
        user_lastname: 'Deau',
        user_job_desc: 'Manager',
        user_email: 'jean.deau@example.com',
        user_password: 'hashed_password',
    },
];
const initializeUsers = async () => {
    try {
        for (const userData of usersToInsert) {
            const userExists = await User.findOne({ user_email: userData.user_email });
            if (!userExists) {
                const newUser = new User(userData);
                await newUser.save();
                console.log(`User ${userData.user_email} inserted`);
            } else {
                console.log(`User ${userData.user_email} already exists`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = initializeUsers;
