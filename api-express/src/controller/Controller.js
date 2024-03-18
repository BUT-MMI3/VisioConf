class Controller {
    listeEmission = {};
    listeReception = {};

    verbose = false;
    verboseall = false;

    subscribe(emetteur, liste_emission, liste_reception) {
        for (const key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] === "undefined") {
                this.listeEmission[liste_emission[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeEmission[liste_emission[key]]);
                }
            }
            if (typeof this.listeEmission[liste_emission[key]][emetteur.instanceName] !== "undefined") {
                console.error("ERREUR (controller): " + emetteur.instanceName + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_emission[key]);
            } else {
                this.listeEmission[liste_emission[key]][emetteur.instanceName] = emetteur;
            }
        }

        for (const key in liste_reception) {
            if (typeof this.listeReception[liste_reception[key]] === "undefined") {
                this.listeReception[liste_reception[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeReception[liste_reception[key]]);
                }
            }
            if (typeof this.listeReception[liste_reception[key]][emetteur.instanceName] !== "undefined") {
                console.error("ERREUR (controller): " + emetteur.instanceName + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_reception[key]);
            } else {
                this.listeReception[liste_reception[key]][emetteur.instanceName] = emetteur;
            }
        }
    }


    unsubscribe(emetteur, liste_emission, liste_abonnement) {
        for (const key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] === "undefined") {
                console.error("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_emission[key]);
            } else {
                if (typeof this.listeEmission[liste_emission[key]][emetteur.instanceName] === "undefined") {
                    console.error("ERREUR (controller): le message en émission  " + liste_emission[key] + " n'était pas enregistré par " + emetteur.instanceName);
                } else {
                    delete this.listeEmission[liste_emission[key]][emetteur.instanceName];
                    if (this.verboseall || this.verbose) console.log("INFO (controller): le message en émission " + liste_emission[key] + " a été enlevé de la liste pour " + emetteur.instanceName);
                }
            }
        }

        for (const key in liste_abonnement) {
            if (typeof this.listeReception[liste_abonnement[key]] === "undefined") {
                console.error("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_abonnement[key]);
            } else {
                if (typeof this.listeReception[liste_abonnement[key]][emetteur.instanceName] === "undefined") {
                    console.error("ERREUR (controller): le message en émission  " + liste_abonnement[key] + " n'était pas enregistré par " + emetteur.instanceName);
                } else {
                    delete this.listeReception[liste_abonnement[key]][emetteur.instanceName];
                    if (this.verboseall || this.verbose) console.log("INFO (controller): le message en abonnement " + liste_emission[key] + " a été enlevé de la liste pour " + emetteur.instanceName);
                }
            }
        }
    }

    send(emetteur, data) {
        if (this.verboseall || this.verbose) console.log("INFO (controller):le controller a reçu de " + emetteur.instanceName + " :");

        for (const item in data) {
            if (item !== "id" && item !== "sessionToken") {
                if (typeof this.listeEmission[item] === "undefined") {
                    console.error("ERREUR (controller): Le message " + item + " envoyé par " + emetteur.instanceName + " n'est pas enregistré par le contrôleur");
                    return;
                }
                if (this.listeEmission[item][emetteur.instanceName] === "undefined") {
                    console.error("ERREUR (controller): Le message " + item + " envoyé par " + emetteur.instanceName + " n'a pas déjà enregistré par le contrôleur");
                    return;
                }
                for (const recepteurKey in this.listeReception[item]) {
                    if (this.verboseall || this.verbose) console.log("INFO (controller): on envoie " + item + " à " + recepteurKey);

                    const T = {};
                    T[item] = data[item];
                    if (typeof data.id !== "undefined") T.id = data.id;

                    this.listeReception[item][recepteurKey].traitementMessage(T);

                }
            }
        }
    }
}

module.exports = Controller
