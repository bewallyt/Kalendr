(function () {
  'use strict';

  angular
    .module('kalendr.posts', [
      'kalendr.posts.controllers',
      'kalendr.posts.directives',
      'kalendr.posts.services'
    ]);

  angular
    .module('kalendr.posts.controllers', []);

  angular
    .module('kalendr.posts.directives', ['ngDialog']);

  angular
    .module('kalendr.posts.services', []);
})();
