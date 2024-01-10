const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Discussion = require('../models/discussion');

const usersToInsert = [
    {
        user_uuid: uuidv4(),
        user_firstname: 'John',
        user_lastname: 'Doe',
        user_job_desc: 'Developer',
        user_email: 'john.doe@example.com',
        user_password: 'hashed_password',
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Janny',
        user_lastname: 'Doey',
        user_job_desc: 'Designer',
        user_email: 'janny.doey@example.com',
        user_password: 'hashed_password',
    },
    {
        user_uuid: uuidv4(),
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



const initializeDiscussions = async () => {
    try {
        // Trouvez les utilisateurs par email (ou un autre identifiant unique)
        const userJohn = await User.findOne({ user_email: 'john.doe@example.com' });
        const userJanny = await User.findOne({ user_email: 'janny.doey@example.com' });
        const userJean = await User.findOne({ user_email: 'jean.deau@example.com' });

        // Vérifiez si les utilisateurs existent
        if (!userJohn || !userJanny || !userJean) {
            console.log("Certains utilisateurs sont manquants. Assurez-vous que les utilisateurs sont insérés d'abord.");
            return;
        }

        // Discussions à insérer
        const discussionsToInsert = [
            {
                discussion_uuid: uuidv4(),
                discussion_name: 'Project Discussion',
                discussion_description: 'Discussion about the project',
                discussion_members: [{ user: userJohn._id }, { user: userJanny._id }],
            },
        ];

        for (const discussionData of discussionsToInsert) {
            const discussionExists = await Discussion.findOne({ discussion_uuid: discussionData.discussion_uuid });
            if (!discussionExists) {
                const newDiscussion = new Discussion(discussionData);
                await newDiscussion.save();
                console.log(`Discussion '${discussionData.discussion_name}' inserted`);
            } else {
                console.log(`Discussion '${discussionData.discussion_name}' already exists`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    initializeUsers,
    initializeDiscussions
};