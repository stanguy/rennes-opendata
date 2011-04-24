
jQuery.stanguy = {};

(function($){
     var known_apis = [];
     var query_format = 'json';
     
     function onRemoteCallCompletion(jqXHR, textStatus) {
         var full_response_div = $('<div></div>');
         full_response_div.append(
             $('<h2></h2>').text( this.method_name )
         );
         full_response_div.append( $('<h3>Request</h3>') );
         full_response_div.append( 
             $('<pre></pre>')
                 .append( 'GET ' )
                 .append( this.url )
         );
         full_response_div.append( $('<h3>Response</h3>') );
         full_response_div.append( 
             $('<pre></pre>')
                .append( jqXHR.status + " " )
                .append( jqXHR.statusText )
         );
         full_response_div.append( 
             $('<pre></pre>')
                .append( js_beautify( jqXHR.responseText ) )
         );
         $('#result').prepend( full_response_div );
     }
     function callRemoteMethod() {
         var method_div = $('#methods .data .selected');
         var version = $('#versions .data .selected').text();
         var api_idx = parseInt( $('#apis .data .selected').data('idx') );
         var method_name = method_div.data('name');
         var method_info = known_apis[api_idx].versions[version].methods[method_name];
         
         var full_params = {
             version: version,
             key: $('#api_key').val(),
             cmd: method_name
         };
         var meth_params = {};
         
         $.each( method_info.params, function( param_name, param_info ) {
             var val = $('#p_' + param_name).val();
             if ( val != null && val != "" ) {
                 meth_params[param_name] = val;
             }
         });
         full_params['param'] = meth_params;
         var base_url = known_apis[api_idx].versions[version].base_url;
         var missing_slash = base_url.match('/$') ? '' : '/';
         var req_url = base_url + query_format + missing_slash + '/?' + $.param( full_params );
         $.ajax({
            url: req_url,
            complete: onRemoteCallCompletion,
            context: {
                method_name: method_name,
                url: req_url
            }
         });
     }
	 function checkInputSubmit(e) {
         var code = (e.keyCode ? e.keyCode : e.which);
         if ( code == 13 /* enter */ ) {
		     callRemoteMethod();
		 }		
	 }
     function param2input( name, info ) {
         var input;
         if ( info.type == "enum" ) {
             input = ( $('<select>').attr('name', name ) );
             input.append( new Option() );
             for( var i = 0; i < info.values.length; ++i ) {
                 input.append( new Option( info.values[i] ) );
             }
         } else {
             input = $('<input type="text"></input>').attr( 'name', name );
			 input.keyup( checkInputSubmit );
         }
         input.attr('id', 'p_' + name );
         return input;
     }
     
     function displayMethodParameters() {
         var method_div = $(this);
         $('#methods .data .selected').removeClass('selected');
         method_div.addClass('selected');
         var version = $('#versions .data .selected').text();
         var api_idx = parseInt( $('#apis .data .selected').data('idx') );
         var method_name = method_div.data('name');
         var method_info = known_apis[api_idx].versions[version].methods[method_name];
         $('#parameters .data').html('');
         $.each( method_info.params, function( param_name, param_info ) {
             var param_div = $('<div></div>');
             param_div.append( $('<span></span>').text(param_name + " =") );
             param_div.append( param2input( param_name, param_info ) );
             if( param_info.description != null ) {
                 param_div.append( $('<p></p>').text( param_info.description ) )
             }
             $('#parameters .data').append(param_div);
         });
         var submit_div = $('<div></div>').addClass('action');
         var submit = $('<input type="submit"></input>');
         submit.click( callRemoteMethod );
         submit_div.append( submit );
         $('#parameters .data').append( submit_div );
     }

     function displayVersionMethods() {
         var version_div = $(this);
         $('#versions .data .selected').removeClass('selected');
         version_div.addClass('selected');
         var version = version_div.text();
         var api_idx = parseInt( $('#apis .data .selected').data('idx') );
         var methods_info = known_apis[api_idx].versions[version].methods;
         $('#methods .data').html('');
         $('#parameters .data').html('');
         $.each( methods_info, function( method_name, data ){
             var method_div = $('<div></div>')
                 .append( $('<span></span>').text( method_name ).addClass( 'name') )
                 .append( $('<p></p>').text( data.description ) );
             method_div.data('name',method_name)
             method_div.click( displayMethodParameters );
             $('#methods .data').append(method_div);
         });
     }

     function displayAPIVersions() {
         var api_div = $(this);
         $('#apis .data .selected').removeClass('selected');
         api_div.addClass('selected');
         var idx = parseInt( api_div.data('idx') );
         var api = known_apis[idx];
         $('#versions .data').html('');
         $('#methods .data').html('');
         $('#parameters .data').html('');
         $.each( api.versions, function( version, data ) {
             var version_div = $('<div></div>')
                 .append(version);
             version_div.click( displayVersionMethods );
             $('#versions .data').append(version_div);
             
         });
     }

     $.stanguy.register_api = function( name, version, struct ) {

         var current_api = null;
         var current_api_index = -1;
         var should_add = true;

         for( var i = 0; i < known_apis.length; ++i ) {
             if ( known_apis[i].name == name ) {
                 should_add = false;
                 current_api = known_apis[i];
                 current_api_index = i;
                 break;
             }
         }
         if ( null === current_api ) {
             current_api = { name: name, versions: {} };
             known_apis.push( current_api );
             current_api_index = known_apis.length - 1;
         }
         current_api.versions[version] = struct;

         if( should_add ) {
             var method_div = $('<div></div>')
                 .data('idx',current_api_index)
                 .append(name)
                 .click( displayAPIVersions );
             $('#apis .data').append(
                 method_div
             );
         }
     };
})(jQuery);

