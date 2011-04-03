
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
                    }
                }
            }
        }
    }
);