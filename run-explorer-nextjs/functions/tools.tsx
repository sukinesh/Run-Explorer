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

export function deleteCookies() {
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  }