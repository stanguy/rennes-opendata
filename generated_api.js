
$.stanguy.register_api( 
    "Keolis Rennes", 
    "1.0", {
        "doc_url": "http://data.keolis-rennes.com/fr/les-donnees/commandes-disponibles.html",
        methods: {
            getstation: {
                description: "Retrieves stations",
                params: {
                    network: {
                        type: "enum",
                        values: [ "levelostar" ]
                    },
                    request: {
                        type: "enum",
                        values: ["all","proximity","district","number"]
                    }
                }
            }
        }
    }
);

$.stanguy.register_api( 
    "Keolis Rennes", 
    "2.0", {
        "doc_url": "http://data.keolis-rennes.com/fr/les-donnees/v2.html",
        methods: {
            getbikestations: {
                description: "Retrieves stations",
                params: {
                    network: {
                        type: "enum",
                        values: [ "levelostar" ]
                    }
                }
            }
        }
    }
);

$.stanguy.register_api( 
    "Rennes Metropole", 
    "1.1", {
        "doc_url": "http://www.data.rennes-metropole.fr/espace-developpeurs/documentation-de-l-api/",
        methods: {
            getcity: {
                description: "Retrieves all cities",
                params: {}
            }
        }
    }
);