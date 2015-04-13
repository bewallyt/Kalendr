(function () {
    'use strict';

    angular
        .module('kalendr.enmasse', [
            'kalendr.enmasse.controllers',
            'kalendr.enmasse.directives'
        ]);

    angular
        .module('kalendr.enmasse.controllers', []);

    angular
        .module('kalendr.enmasse.directives', ['ngDialog']);

})();
