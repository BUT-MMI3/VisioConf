class Controller {
    listeEmission = {};
    listeAbonnement = {};
    verbose = false;
    verboseall = false;

    constructor() {

    }

    subscribe(emitter, liste_emission, liste_abonnement) {
        for (const key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] === "undefined") {
                this.listeEmission[liste_emission[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeEmission[liste_emission[key]]);
                }
            }
            if (typeof this.listeEmission[liste_emission[key]][emitter.instanceName] !== "undefined") {
                console.log("ERREUR (controller): " + emitter.instanceName + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_emission[key]);
            } else {
                if (this.verbose || this.verboseall) console.log("INFO (controller): " + emitter.instanceName + " s'enregistre pour le message en émission: " + liste_emission[key]);
                this.listeEmission[liste_emission[key]][emitter.instanceName] = emitter;
            }
        }
        for (const key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] === "undefined") {
                this.listeAbonnement[liste_abonnement[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeAbonnement[liste_abonnement[key]]);
                }
            }
            if (typeof this.listeAbonnement[liste_abonnement[key]][emitter.instanceName] !== "undefined") {
                console.log("ERREUR (controller): " + emitter.instanceName + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_abonnement[key]);
            } else {
                if (this.verbose || this.verboseall) console.log("INFO (controller): " + emitter.instanceName + " s'enregistre pour le message en abonnement: " + liste_abonnement[key]);
                this.listeAbonnement[liste_abonnement[key]][emitter.instanceName] = emitter;
            }
        }

    }

    unsubscribe(emitter, liste_emission, liste_abonnement) {
        for (const key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] === "undefined") {
                console.log("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_emission[key]);
            } else {
                if (typeof this.listeEmission[liste_emission[key]][emitter.instanceName] === "undefined") {
                    console.log("ERREUR (controller): le message en émission  " + liste_emission[key] + " n'était pas enregistré par " + emitter.instanceName);
                } else {
                    delete this.listeEmission[liste_emission[key]][emitter.instanceName];
                    if (this.verboseall || this.verbose) console.log("INFO (controller): le message en émission " + liste_emission[key] + " a été enlevé de la liste pour " + emitter.instanceName);
                }
            }
        }

        for (const key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] === "undefined") {
                console.log("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_abonnement[key]);
            } else {
                if (typeof this.listeAbonnement[liste_abonnement[key]][emitter.instanceName] === "undefined") {
                    console.log("ERREUR (controller): le message en émission  " + liste_abonnement[key] + " n'était pas enregistré par " + emitter.instanceName);
                } else {
                    delete this.listeAbonnement[liste_abonnement[key]][emitter.instanceName];
                    if (this.verboseall || this.verbose) console.log("INFO (controller): le message en abonnement " + liste_emission[key] + " a été enlevé de la liste pour " + emitter.instanceName);
                }
            }
        }
    }

    send(emitter, data) {
        if (this.verboseall || this.verbose) console.log("INFO (controller) : le controller a reçu de " + emitter.instanceName + " :");

        for (let item in data) {
            if (typeof this.listeEmission[item] == "undefined") {
                console.log("ERREUR (controller) : Le message " + item + " envoyé par " + emitter.instanceName + " n'est pas enregistré par le contrôleur");
                return;
            }
            if (this.listeEmission[item][emitter.instanceName] === "undefined") {
                console.log("ERREUR (controller) : Le message " + item + " envoyé par " + emitter.instanceName + " n'a pas déjà enregistré par ");
                return;
            }
            for (const recepteurKey in this.listeAbonnement[item]) {
                if (this.verboseall || this.verbose) console.log("INFO (controller) : on envoie " + item + " à " + recepteurKey);

                let T = {};
                T[item] = data[item];
                this.listeAbonnement[item][recepteurKey].traitementMessage(T);
            }
        }
    }

    test() {
        console.log("test");
    }
}