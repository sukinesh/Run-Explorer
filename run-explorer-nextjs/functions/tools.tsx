export function processURLParameters() {
    
    interface SimpleObject {
        [key: string]: string;
      }
    //get parm from url
    var queryString = window.location.search;
    if(queryString.length == 0) return;
    queryString = queryString.substring(1);
    var queryParams = queryString.split('&');
    var params:SimpleObject = {};
    queryParams.forEach(function(param) {
        var keyValue = param.split('=');
        var key = decodeURIComponent(keyValue[0]);
        var value = decodeURIComponent(keyValue[1]);
        params[key] = value;
    });
    
    return params;
}