require('dotenv').config();
const {v4: uuidv4} = require('uuid');
const User = require('../models/user');
const Discussion = require('../models/discussion');
const Call = require('../models/call');
const {sha256} = require("../utils/utils");

const usersToInsert = [
    {
        user_uuid: uuidv4(),
        user_firstname: 'John',
        user_lastname: 'Doe',
        user_job_desc: 'Developer',
        user_picture: 'https://play-lh.googleusercontent.com/15OKLti0ofnjK4XK1bgRXgsoblPvMi3hCA5z2o9WAcjssFNt2dXxemp2Om9vB3A_jYAe',
        user_email: 'john.doe@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17',
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Janny',
        user_lastname: 'Doey',
        user_job_desc: 'Designer',
        user_email: 'janny.doey@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17', // hash = mdp
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Jean',
        user_lastname: 'Deau',
        user_job_desc: 'Manager',
        user_email: 'jean.deau@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17', // hash = mdp
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Utilisateur',
        user_lastname: 'Utilisateur',
        user_job_desc: 'Student',
        user_email: 'utilisateur@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Student",
        user_password: ' ',
        user_status: 'waiting',
        user_tokens: {inscription: 'azerty1234'},
    },
];
const initializeUsers = async () => {
    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.log("Les identifiants de l'administrateur ne sont pas définis dans le .env");
        } else {
            const adminPasswordHash = await sha256(process.env.ADMIN_PASSWORD)

            usersToInsert.push({
                user_uuid: uuidv4(),
                user_firstname: 'Admin',
                user_lastname: 'Admin',
                user_job_desc: 'Administrateur',
                user_email: process.env.ADMIN_EMAIL,
                user_phone: "00.00.00.00.00",
                user_job: "Admin",
                user_password: adminPasswordHash,
                user_is_admin: true,
                user_roles: ['admin', 'user'],
            });
        }
        await User.deleteMany({});
        for (const userData of usersToInsert) {
            // flush existing users
            const userExists = await User.findOne({user_email: userData.user_email});
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
        await Discussion.deleteMany({});

        // Trouvez les utilisateurs par email (ou un autre identifiant unique)
        const userJohn = await User.findOne({user_email: 'john.doe@example.com'});
        const userJanny = await User.findOne({user_email: 'janny.doey@example.com'});
        const userJean = await User.findOne({user_email: 'jean.deau@example.com'});
        const userUtilisateur = await User.findOne({user_email: 'utilisateur@example.com'});

        // Vérifiez si les utilisateurs existent
        if (!userJohn || !userJanny || !userJean || !userUtilisateur) {
            console.log("Certains utilisateurs sont manquants. Assurez-vous que les utilisateurs sont insérés d'abord.");
            return;
        }

        // Discussions à insérer
        const discussionsToInsert = [
            {
                discussion_uuid: uuidv4(),
                discussion_name: 'Project Discussion',
                discussion_description: 'Discussion about the project',
                discussion_members: [userJohn._id, userJanny._id],
                discussion_creator: userJohn._id,
            },
        ];

        for (const discussionData of discussionsToInsert) {
            const discussionExists = await Discussion.findOne({discussion_uuid: discussionData.discussion_uuid});
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

const resetCalls = async () => {
    try {
        const callsNotEnded = await Call.find({is_ended: false});
        for (const call of callsNotEnded) {
            call.is_ended = true;
            if (!call.date_ended) {
                call.date_ended = Date.now();
            }
            await call.save();
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    initializeUsers,
    initializeDiscussions,
    resetCalls,
};