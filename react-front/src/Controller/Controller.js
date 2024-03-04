class Controller {
    listeEmission = {};
    listeAbonnement = {};
    verbose = true;
    verboseall = false;

    constructor() {

    }

    subscribe(emitter, liste_emission, liste_abonnement) {
        for (let key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] == "undefined") {
                this.listeEmission[liste_emission[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controleur): liste des instances qui ont déjà enegistré ce message en émission:");
                    console.log(this.listeEmission[liste_emission[key]]);
                }
            }
            if (typeof this.listeEmission[liste_emission[key]][emitter.nomDInstance] != "undefined") {
                console.log("ERREUR (controleur): " + emitter.nomDInstance + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_emission[key]);
            } else {
                if (this.verbose || this.verboseall) {
                    console.log("INFO (controleur): " + emitter.nomDInstance + " s'enregistre pour le message en émission: " + liste_emission[key]);
                }
                this.listeEmission[liste_emission[key]][emitter.nomDInstance] = emitter;
            }
        }
        for (let key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] == "undefined") {
                this.listeAbonnement[liste_abonnement[key]] = {};
            } else {
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controleur): liste des instances qui ont déjà enegistré ce message en émission:");
                    console.log(this.listeAbonnement[liste_abonnement[key]]);
                }
            }
            if (typeof this.listeAbonnement[liste_abonnement[key]][emitter.nomDInstance] != "undefined") {
                console.log("ERREUR (controleur): " + emitter.nomDInstance + " essaie de s'enregistrer une nouvelle fois pour le message en émission: " + liste_abonnement[key]);
            } else {
                if (this.verbose || this.verboseall) {
                    console.log("INFO (controleur): " + emitter.nomDInstance + " s'enregistre pour le message en abonnement: " + liste_abonnement[key]);
                }
                this.listeAbonnement[liste_abonnement[key]][emitter.nomDInstance] = emitter;
            }
        }

    }

    unsubscribe(emitter, liste_emission, liste_abonnement) {
        for (let key in liste_emission) {
            if (typeof this.listeEmission[liste_emission[key]] == "undefined") {
                console.log("ERREUR (controleur): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_emission[key]);
            } else {
                if (typeof this.listeEmission[liste_emission[key]][emitter.nomDInstance] == "undefined") {
                    console.log("ERREUR (controleur): le message en émission  " + liste_emission[key] + " n'était pas enregistré par " + emitter.nomDInstance);
                } else {
                    delete this.listeEmission[liste_emission[key]][emitter.nomDInstance];
                    if (this.verboseall || this.verbose) {
                        console.log("INFO (controleur): le message en émission " + liste_emission[key] + " a été enlevé de la liste pour " + emitter.nomDInstance);
                    }
                }
            }
        }

        for (let key in liste_abonnement) {
            if (typeof this.listeAbonnement[liste_abonnement[key]] == "undefined") {
                console.log("ERREUR (controleur): le message en émission n'existe plus, on ne peut pas l'enlever: " + liste_abonnement[key]);
            } else {
                if (typeof this.listeAbonnement[liste_abonnement[key]][emitter.nomDInstance] == "undefined") {
                    console.log("ERREUR (controleur): le message en émission  " + liste_abonnement[key] + " n'était pas enregistré par " + emitter.nomDInstance);
                } else {
                    delete this.listeAbonnement[liste_abonnement[key]][emitter.nomDInstance];
                    if (this.verboseall || this.verbose) {
                        console.log("INFO (controleur): le message en abonnement " + liste_emission[key] + " a été enlevé de la liste pour " + emitter.nomDInstance);
                    }
                }
            }
        }


    }

    send(emitter, t) {

        if (this.verboseall || this.verbose) {
            console.log("INFO (controleur) : le controleur a reçu de " + emitter.nomDInstance + " :");
            console.log(t);
        }

        for (let item in t) {
            if (typeof this.listeEmission[item] == "undefined") {
                console.log("ERREUR (controleur) : Le message " + item + " envoyé par " + emitter.nomDInstance + " n'est pas enregistré par le contrôleur");
                return;
            }
            if (this.listeEmission[item][emitter.nomDInstance] === "undefined") {
                console.log("ERREUR (controleur) : Le message " + item + " envoyé par " + emitter.nomDInstance + " n'a pas déjà enregistré par ");
                return;
            }
            for (let recepteurkey in this.listeAbonnement[item]) {
                let T = {};
                T[item] = t[item];
                if (this.verboseall || this.verbose) {
                    console.log("INFO (controleur) : on envoie " + item + " à " + recepteurkey);
                }
                console.log("INFO (controleur) : on envoie " + item + " à " + recepteurkey);
                this.listeAbonnement[item][recepteurkey].traitementMessage(T);
            }
        }
    }
}

export default Controller;
