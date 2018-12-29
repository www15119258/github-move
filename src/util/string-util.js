'use strict'
module.exports = {
    toMiddleLine: function(str) {
        str =  str.replace(/([A-Z])/g,"-$1").toLowerCase();
        if (str.startsWith('-')) {
            str = str.substring(1);
        }
        return str;
    },
    toCamelCase: function(str) {
        return str.replace(/\-(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
    },
    toUpperCapital: function(str) {
        let capital = str.substring(0, 1);
        if (capital !== capital.toUpperCase()) {
            str = capital.toUpperCase() + str.substring(1);
        }
        return str;
    }
}