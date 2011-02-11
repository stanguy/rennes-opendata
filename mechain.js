
$(document).ready(function(){
    var map;
    var geocodingRequests = [];
    var markers = [];

    function l(msg) {
        $('#status').text(msg);
    }
                      
    function onResultClick(e) {
        for( var i = 0; i < markers.length; ++i ) {
            markers[i].setMap(null);
        }
        markers = [];
        $(this).children('.coords').each(function(i,elem) {
            var coords = $(elem).text().split(/,/);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng( coords[0], coords[1] ),
                map: map
            });
            markers.push( marker );
        });
    }


    function onGeocodingResult( results, status, name, address ) {
        if (status == google.maps.GeocoderStatus.OK) {
            var first_pos = results[0].geometry.location;
            var stored_point = new google.maps.LatLng( address.latitude, address.longitude );
            var dist = google.maps.geometry.spherical.computeDistanceBetween( first_pos, stored_point );
            var divClass = dist > 1000 ? "ko" : "ok";
            var div = $('<div></div>').addClass('grid_6 alpha omega').addClass(divClass).append(
            $('<span></span>').addClass('grid_3 alpha').text(name) ).append(
                $('<span></span>').addClass('grid_3 coords omega').text(address.latitude + "," + address.longitude ) ).append(
                $('<span></span>').addClass('grid_3 coords omega').text( 
                    first_pos.lat() + "," + first_pos.lng()
            ));   
            div.attr('title',dist);
            div.click( onResultClick );
            $('#results').append( div );
        } else {
//            console.log( 'failed to geocode with code ' + status );
        }
    }
    function geocodeAll() {
        if( geocodingRequests.length == 0) {
            l('all requests done');
            return;
        }
        var geocoder = new google.maps.Geocoder();
        var request = geocodingRequests.shift();
        geocoder.geocode( { address: request.geocode_adr }, function(a, b ) { onGeocodingResult(a,b,request.name, request.address ); });
        setTimeout( geocodeAll, 1000 );
    }

    function geocodeOrga( orga ) {
        var name = orga.name;
        var addresses;
        if( $.isArray( orga.addresses.address ) ) {
            addresses = orga.addresses.address;
        } else {
            addresses = [ orga.addresses.address ];
        }
        var addresses_length = addresses.length;
        for( var j = 0; j < addresses_length; ++j ) {
            var address = addresses[j];
            if( address == undefined || address.latitude.match( /^0\.0*/ ) ) {
                continue;
            }
            var geocode_adr = address.street.number + " " + address.street.name + ", " + address.city + ", FRANCE";
//            console.log( 'geocoding ' + geocode_adr );
            geocodingRequests.push({
                name: name,
                address: address,
                geocode_adr: geocode_adr
            });
        }
    }


    function onSearchResult(d,h,x) {
        l('search done, geocomputing stuff');
        $('#results').html('');
        var orgs ;
        if( $.isArray( d.opendata.answer.data.organization ) ) {
            orgs = d.opendata.answer.data.organization;
        } else {
            orgs = [ d.opendata.answer.data.organization ];
        }
        var orgs_length = orgs.length;
        for( var i =0 ; i < orgs_length; ++i ) {
            var orga = orgs[i];
            geocodeOrga( orga );
        }
        geocodeAll();
        l('geocoding started, maybe finished');
    }

    function runSearch() {
        l('running search');
        var full_params = {
            version: '1.1',
            key: $('#api_key').val(),
            cmd: 'getorganization',
            param: {
                name: $('#name_filter').val(),
                limit: $('#fetch_limit').val(),
                page: $('#fetch_page').val()
            }
        };
        var API_BASE_URL = 'http://www.data.rennes-metropole.fr/json/';
        jQuery.ajax( {
            url: API_BASE_URL,
            scriptCharsetString: 'ISO-8859-1',
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-1",
            data: full_params,
            success: onSearchResult
        });
    }

    $('#form_container input[type="submit"]').click( runSearch );

    map = new google.maps.Map($('#map')[0], {
        'scrollwheel': false,
        'zoom': 12,
        'center': new google.maps.LatLng( 48.11, -1.63 ),
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    });

});