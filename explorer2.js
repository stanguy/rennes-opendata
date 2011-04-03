
jQuery.stanguy = {};

(function($){
     var known_apis = [];
     
     function displayVersionMethods() {
         var version_div = $(this);
         version_div.addClass('selected');
         var version = version_div.text();
         var api_idx = parseInt( $('#apis .data .selected').data('idx') );
         var methods_info = known_apis[api_idx].versions[version].methods;
         $('#methods .data').html('');
         $.each( methods_info, function( method_name, data ){
             var method_div = $('<div></div>')
                 .append(method_name);
             $('#methods .data').append(method_div);
         });
     }

     function displayAPIVersions() {
         var api_div = $(this);
         api_div.addClass('selected');
         var idx = parseInt( api_div.data('idx') );
         var api = known_apis[idx];
         $('#versions .data').html('');
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

         for( var i = 0; i < known_apis.length; ++i ) {
             if ( known_apis[i].name == name ) {
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

         var method_div = $('<div></div>')
             .data('idx',current_api_index)
             .append(name)
             .click( displayAPIVersions );
         $('#apis .data').append(
             method_div
         );
     };
})(jQuery);

