var RENNES_OPENDATA_METHODS = {
    getcity: {},
    getdistrict: {
        city: {
            required: true,
            refers_to: {
                method: 'getcity',
                val: 'id',
                text: 'name'
            }
        }
    },
    gettheme: {},
    getsubtheme: {
        theme: {
            required: true,
            refers_to: {
                method: 'gettheme',
                val: 'id',
                text: 'label'
            }
        }
    },
    getaccessibility: {},
    getorganization: {
        name: {
            required: false
        },
        theme: {
            required: false,
            refers_to: {
                method: 'gettheme',
                val: 'id'
            }
        },
        subtheme: {
            required: false,
            refers_to: {
                method: 'getsubtheme',
                val: 'id'
            }
        },
        city: {
            required: false,
            refers_to: {
                method: 'getcity',
                val: 'id'
            }
        },
        district: {
            required: false,
            refers_to: {
                method: 'getdistrict',
                val: 'id'
            }
        },
        accessibility: {
            required: false,
            refers_to: {
                method: 'getaccessibility',
                val: 'code',
                text: 'label'
            }
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
            required: false,
            refers_to: {
                method: 'getreceptiontype',
                val: 'id',
                text: 'label'
            }
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


function handleData( data,status,xhr,method_name,callback ) {
    var target = $('#introspection');
    target.text('');
    var method_descr = RENNES_OPENDATA_METHODS[method_name];
    if( data.opendata.answer.status['@attributes'].code != "0" ) {
        target.text( 'An error occurred: ' +  data.opendata.answer.status['@attributes'].message );
        return;
    } else if ( data.opendata.answer.data == "" ) {
        target.text( 'Empty resultset' );
        return;
    }
    var data_key =  method_name.substr( 3 );
    var real_data = data.opendata.answer.data[data_key];
    if( callback !== undefined ) {
        target.append($('<h3>Select a value</h3>'));
    }
    $.each( real_data, function(i,x){
        var new_div = $('<div></div>').addClass('line');
        $.each( x, function(k,v){
            if( typeof(v) == "object" ) {
                return;
            }
            new_div.append(
                $('<span></span>').text(k).addClass('label')
            ).append(
                $('<span></span>').text(v).addClass('value')
            );
        });
        if( undefined !== callback ) {
            new_div.click( function() { callback(x); });
        }
        target.append(new_div);
    });
}

function submitMethod(method_name,callback){
    var full_params = {
        version: '1.0',
        key: $('#api_key').val(),
        cmd: method_name
    };
    var meth_params = null;
    var missing_required = false;
    $.each( RENNES_OPENDATA_METHODS[method_name], function(k,v){
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
    var API_BASE_URL = 'http://www.data.rennes-metropole.fr/json/';
    jQuery.ajax( {
        url: API_BASE_URL,
        scriptCharsetString: 'ISO-8859-1',
        contentType: "application/x-www-form-urlencoded;charset=ISO-8859-1",
        data: full_params,
        success: function(data,status,xhr) { handleData(data,status,xhr,method_name,callback); }
    });   
}

function pushMethod(previous_method, parameter_name, target ){
    displayMethodParameters( target.method, function(line_data){
        var selected = line_data[target.val];
        $('#parameters div').hide();
        $('#parameters div#' + previous_method).show();
        $('#p_' + parameter_name).val(selected);
    });
    return false;
}

function displayMethodParameters( method_name, callback ){
    $('#parameters div').hide();
    if( undefined === method_name ) {
        method_name = $('#methods').val();        
    }
    var innerDiv = $('#' + method_name);
    if( innerDiv.length == 0 ) {
        innerDiv = $('<div></div>').attr('id', method_name);
        $('#parameters').append( innerDiv );
        innerDiv.append( $('<h2></h2>').text(method_name));
        $.each( RENNES_OPENDATA_METHODS[method_name], function(k,v){
            innerDiv.append(
                $('<label>').attr('for','p_'+k).html(k)
            ).append(
                $('<input>').attr( 'id', 'p_' + k ).attr('name','p_' + k).attr( 'type', 'text' )
            );
            if( v.refers_to !== undefined ) {
                innerDiv.append(
                    $('<a href=""></a>').text('>').click( function(e){
                        e.preventDefault();
                        pushMethod( method_name, k, v.refers_to );
                        return false;
                    })
                );
            }
            if( v.required ) {
                $('input#p_' + k).addClass('required');
            }
        });
        innerDiv.append(
            $('<input>').attr('type','button').val('submit').click( function(){ submitMethod(method_name,callback); } )
        );
    } else {
        innerDiv.show();
    }

}

$(document).ready(function(){
    $.ajaxSetup({
        'beforeSend' : function(xhr) {
            xhr.overrideMimeType('text/html; charset=ISO-8859-1');
        }
    });
    $(window).resize(function(){
        $('#parameters').height( $('#explorer').height() - $('#head').height() );
    });
    $(window).resize();
    $.each( RENNES_OPENDATA_METHODS, function(k,v) {
        $('#methods').append( new Option( k, k ) );
    });
    $('#methods').change( function() { displayMethodParameters(); });
});