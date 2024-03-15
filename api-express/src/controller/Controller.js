class Controller {
    listeEmission = {};
    listeAbonnement = {};
    verbose = false;
    verboseall = false;

    subscribe(emetteur, liste_emission, liste_abonnement) {
        for (let key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] == "undefined") {
                this.listeEmission[liste_emission[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeEmission[liste_emission[key]]);
                }
            }
            if (typeof this.listeEmission[liste_emission[key]][emetteur.nomDInstance] != "undefined") {
                console.error("ERREUR (controller): " + emetteur.nomDInstance + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_emission[key]);
            } else {
                this.listeEmission[liste_emission[key]][emetteur.nomDInstance] = emetteur;
            }
        }
        for (let key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] == "undefined") {
                this.listeAbonnement[liste_abonnement[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controller): liste des instances qui ont déjà enregistré ce message en émission:");
                    console.log(this.listeAbonnement[liste_abonnement[key]]);
                }
            }
            if (typeof this.listeAbonnement[liste_abonnement[key]][emetteur.nomDInstance] != "undefined") {
                console.error("ERREUR (controller): " + emetteur.nomDInstance + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_abonnement[key]);
            } else {
                this.listeAbonnement[liste_abonnement[key]][emetteur.nomDInstance] = emetteur;
            }
        }

    }


    unsubscribe(emetteur, liste_emission, liste_abonnement) {
        for (let key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] == "undefined") {
                console.error("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_emission[key]);
            } else {
                if (typeof this.listeEmission[liste_emission[key]][emetteur.nomDInstance] == "undefined") {
                    console.error("ERREUR (controller): le message en émission  " + liste_emission[key] + " n'était pas enregistré par " + emetteur.nomDInstance);
                } else {
                    delete this.listeEmission[liste_emission[key]][emetteur.nomDInstance];
                    if (this.verboseall || this.verbose) {
                        console.log("INFO (controller): le message en émission " + liste_emission[key] + " a été enlevé de la liste pour " + emetteur.nomDInstance);
                    }
                }
            }
        }

        for (let key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] == "undefined") {
                console.error("ERREUR (controller): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_abonnement[key]);
            } else {
                if (typeof this.listeAbonnement[liste_abonnement[key]][emetteur.nomDInstance] == "undefined") {
                    console.error("ERREUR (controller): le message en émission  " + liste_abonnement[key] + " n'était pas enregistré par " + emetteur.nomDInstance);
                } else {
                    delete this.listeAbonnement[liste_abonnement[key]][emetteur.nomDInstance];
                    if (this.verboseall || this.verbose) {
                        console.log("INFO (controller): le message en abonnement " + liste_emission[key] + " a été enlevé de la liste pour " + emetteur.nomDInstance);
                    }
                }
            }
        }


    }

    send(emetteur, t) {

        if (this.verboseall || this.verbose) {
            console.log("INFO (controller):le controller a reçu de " + emetteur.nomDInstance + " :");
            console.log(t);
        }

        for (let item in t) {
            if (item !== "id") {
                if (typeof this.listeEmission[item] == "undefined") {
                    console.error("ERREUR (controller): Le message " + item + " envoyé par " + emetteur.nomDInstance + " n'est pas enregistré par le contrôleur");
                    return;
                }
                if (this.listeEmission[item][emetteur.nomDInstance] === "undefined") {
                    console.error("ERREUR (controller): Le message " + item + " envoyé par " + emetteur.nomDInstance + " n'a pas déjà enregistré par ");
                    return;
                }
                for (let recepteurkey in this.listeAbonnement[item]) {
                    let T = {};
                    T[item] = t[item];
                    if (typeof t.id != "undefined") T.id = t.id;
                    if (this.verboseall || this.verbose) {
                        console.log("INFO (controller): on envoie " + item + " à " + recepteurkey);
                    }
                    this.listeAbonnement[item][recepteurkey].traitementMessage(T);

                }
            }
        }
    }


}

module.exports = Controller
