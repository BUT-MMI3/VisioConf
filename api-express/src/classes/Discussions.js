const Discussion = require('../models/discussion');
const User = require('../models/user');

class Discussions {
    nomDInstance = 'Discussions';
    controller = null;

    listeMessagesEmis = ["liste_discussions", "historique_discussion"];
    listeMessagesRecus = ["demande_liste_discussions", "demande_historique_discussion"];

    verbose = true;

    constructor(controller, nomDInstance) {
        this.controller = controller;
        nomDInstance ? this.nomDInstance = nomDInstance : null;

        if (this.verbose || this.controller.verboseall) console.log(`INFO ${this.nomDInstance} - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO ${this.nomDInstance} - Réception d'un message : ${msg}`);

        if (typeof msg.demande_liste_discussions !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO ${this.nomDInstance} - Demande de liste de discussions reçue`);

            const user = await User.findOne({user_socket_id: msg.id});
            const user_discussions = await Discussion.find({discussion_members: user._id});
            this.controller.send(this, {liste_discussions: user_discussions, id: msg.id});

        } else if (typeof msg.demande_historique_discussion !== 'undefined') {

            const discussion = await Discussion.findOne({_id: msg.demande_historique_discussion.discussion_id});
            this.controller.send(this, {historique_discussion: discussion, id: msg.id});

        }
    }
}

module.exports = Discussions;