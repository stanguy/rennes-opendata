
$.stanguy.register_api( 
    "Keolis Rennes", 
    "1.0", {
        "doc_url": "http://data.keolis-rennes.com/fr/les-donnees/commandes-disponibles.html",
        "base_url": "http://data.keolis-rennes.com/",
        methods: {
            getstation: {
                description: "Retrieves stations",
                params: {
                    network: {
                        type: "enum",
                        values: [ "levelostar" ],
                        description: "The network identifier."                        
                    },
                    request: {
                        type: "enum",
                        values: ["all","proximity","district","number"],
                        description: "The filter type"
                    },
                    mode: {
                        type: "enum",
                        values: ["id", "coord"],
                        description: "The kind of proximity look up."
                    },
                    value: {
                        type: "string",
                        description: "From the specified station/district."
                    },
                    lat: {
                        type: "number",
                        description: "The point latitude."
                    },
                    'long': {
                        type: "number",
                        description: "The point longitude."
                    }
                }
            },
            getdistrict: {
                description: "Retrieves the districts.",
                params: {}
            }
        }
    }
);

$.stanguy.register_api( 
    "Keolis Rennes", 
    "2.0", {
        "doc_url": "http://data.keolis-rennes.com/fr/les-donnees/v2.html",
        "base_url": "http://data.keolis-rennes.com/",
        methods: {
            getbikestations: {
                description: "Retrieves stations",
                params: {
                    network: {
                        type: "enum",
                        values: [ "levelostar" ]
                    }
                }
            },
	    getbikedistricts: {
	      description: "Retrieves districts",
	      params: {
		network: {
		  type: "enum",
		  values: [ "levelostar" ]
		}
	      }
	    },
            getlines: {
              description: "Retrieves lines",
              params: {
                network: {
                  type: "enum",
                  values: ['star']
                },
                mode: {
                  type: 'enum',
                  values: ['all']
                },
                size: {
                  type: 'enum',
                  values: ['21','100','300','1000']
                }
              }
            },
	    getlinesalerts: {
	      description: "Retrieves lines alerts",
	      params: {
		network: {
		  type: "enum",
		  values: [ "star" ]
		},
		mode: {
		  type: "enum",
		  values: [ "all", "line" ]
		},
		line: {
		  type: "string",
		  description: "The line name."
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
        "base_url": "http://www.data.rennes-metropole.fr/",
        methods: {
            getcity: {
                description: "Retrieves all cities",
                params: {}
            }
        }
    }
);