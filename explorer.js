var RENNES_OPENDATA_METHODS = {
    getcity: {},
    getdistrict: {
        city: {
            required: true
        }
    },
    gettheme: {},
    getsubtheme: {
        theme: {
            required: true
        }
    },
    getaccessibility: {},
    getorganization: {
        name: {
            required: false
        },
        theme: {
            required: false
        },
        subtheme: {
            required: false
        },
        city: {
            required: false
        },
        district: {
            required: false
        },
        accessibility: {
            required: false
        },
        latitude: {
            required: false
        },
        longitude: {
            required: false
        },
        limit: {
            required: false
        },
        distance: {
            required: false
        },
        receptiontype: {
            required: false
        }
    },
    getcalendar: {
        organization: {
            required: true
        },
        receptiontype: {
            required: true
        },
        year: {
            required: true
        },
        month: {
            required: false
        }
    },
    gettimeslot: {
        mode: {
            required: true
        },
        idlist: {
            required: true
        }
    },
    getreceptiontype: {}
};

function submitMethod(){
    var full_params = {
        version: '1.0',
        key: $('#api_key').val(),
        cmd: $('#methods').val()
    };
    var meth_params = null;
    var missing_required = false;
    $.each( RENNES_OPENDATA_METHODS[$('#methods').val()], function(k,v){
        var val = $('#p_' + k ).val();
        if ( null == meth_params ) {
            meth_params = {};
        }
        if ( val != null && val != "" ) {
            meth_params[k] = val;
        } else if ( v.required ) {
            alert( "you did not provide a required parameter" );
            missing_required = true;
        }
    });
    if( missing_required ) {
        return;
    }
    if( null != meth_params ) {
        full_params['param'] = meth_params;
    }
    var API_BASE_URL = 'http://www.data.rennes-metropole.fr/xml/';
    jQuery.ajax( {
        url: API_BASE_URL,
        data: full_params,
        success: function( data,status,xhr ) {
            $('#introspection pre').text( xhr.responseText );
        }
    });   
}

function displayMethodParameters(){
    $('#parameters').html('');
    $.each( RENNES_OPENDATA_METHODS[$('#methods').val()], function(k,v){
        $('#parameters').append(
            $('<label>').attr('for','p_'+k).html(k)
        ).append(
            $('<input></input>').attr( 'id', 'p_' + k ).attr('name','p_' + k).attr( 'type', 'text' )
        );
        if( v.required ) {
            $('input#p_' + k).addClass('required');
        }
    });
    $('#parameters').append(
        $('<input></input>').attr('type','button').val('submit').click( submitMethod )
    );
}

$(document).ready(function(){
    $.each( RENNES_OPENDATA_METHODS, function(k,v) {
        $('#methods').append( new Option( k, k ) );
    });
    $('#methods').change( displayMethodParameters );
});