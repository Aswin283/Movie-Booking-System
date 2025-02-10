"use strict";



define('movie-booking-system/app', ['exports', 'movie-booking-system/resolver', 'ember-load-initializers', 'movie-booking-system/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('movie-booking-system/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('movie-booking-system/controllers/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    loginService: Ember.inject.service('login-service'), // Inject the login service

    actions: {
      login: function login() {
        var _this = this;

        var phoneNumber = this.get('pno');
        var password = this.get('password');

        // Validate inputs
        if (!phoneNumber || !password) {
          alert("Please enter both phone number and password.");
          return;
        }

        // Call the login method from the service
        this.get('loginService').login(phoneNumber, password).then(function (userData) {
          alert("Login successful!");
          _this.transitionToRoute('dashboard'); // Redirect to dashboard
        }).catch(function (error) {
          alert("Login failed: " + error.message); // Handle error
        });
      },
      logout: function logout() {
        this.get('loginService').logout(); // Call the logout method
        this.transitionToRoute('login'); // Redirect to login page
      }
    }
  });
});
define('movie-booking-system/helpers/app-version', ['exports', 'movie-booking-system/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('movie-booking-system/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('movie-booking-system/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('movie-booking-system/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'movie-booking-system/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('movie-booking-system/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('movie-booking-system/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('movie-booking-system/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('movie-booking-system/initializers/export-application-global', ['exports', 'movie-booking-system/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('movie-booking-system/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('movie-booking-system/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('movie-booking-system/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("movie-booking-system/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('movie-booking-system/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('movie-booking-system/router', ['exports', 'movie-booking-system/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('dashboard');
  });

  exports.default = Router;
});
define('movie-booking-system/routes/dashboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    loginService: Ember.inject.service('login-service'), // Inject the login service

    model: function model() {
      return this.get('loginService').get('currentUser'); // Bind the current user to the model
    }
  });
});
define('movie-booking-system/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('movie-booking-system/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('movie-booking-system/services/login-service', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    currentUser: null, // Store the logged-in user's data

    login: function login(phoneNumber, password) {
      var _this = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/authentication/login', // Your servlet endpoint
          type: 'POST',
          data: JSON.stringify({
            pno: phoneNumber,
            password: password
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            if (Array.isArray(response) && response.length > 0) {
              _this.set('currentUser', response[0]); // Store user data
              resolve(response[0]); // Resolve the promise
            } else {
              reject(new Error("No user data found in the response.")); // Reject if empty
            }
          },
          error: function error(xhr, status, _error) {
            reject(new Error("An error occurred: " + _error)); // Reject on error
          }
        });
      });
    },
    isLoggedIn: function isLoggedIn() {
      return !!this.get('currentUser'); // Check if user is logged in
    },
    logout: function logout() {
      this.set('currentUser', null); // Clear the currentUser on logout
    }
  });
});
define("movie-booking-system/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JJDiLHhN", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/application.hbs" } });
});
define("movie-booking-system/templates/dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "OJZNW0NB", "block": "{\"statements\":[[0,\"MOVIES / THEATRES\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/dashboard.hbs" } });
});
define("movie-booking-system/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "WPSM301U", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"login-page\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"image-section\"],[13],[0,\"\\n    \"],[11,\"img\",[]],[15,\"src\",\"/assets/theatreSeats.jpg\"],[15,\"alt\",\"Movie booking image\"],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"login-section\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Login to Movie Booking\"],[14],[0,\"\\n\\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"login\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"pno\"],[13],[0,\"Phone Number:\"],[14],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"number\",\"pno\",[28,[\"pno\"]],\"Enter your phone number\"]]],false],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"password\"],[13],[0,\"Password:\"],[14],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"password\",\"password\",[28,[\"password\"]],\"Enter your password\"]]],false],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"login-btn\"],[5,[\"action\"],[[28,[null]],\"login\"]],[13],[0,\"Login\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"login-footer\"],[13],[0,\"\\n      \"],[11,\"a\",[]],[15,\"href\",\"#\"],[15,\"class\",\"forgot-password\"],[13],[0,\"Forgot your password?\"],[14],[0,\" |\\n      \"],[11,\"a\",[]],[15,\"href\",\"#\"],[13],[0,\"Sign up\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\nem\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/login.hbs" } });
});


define('movie-booking-system/config/environment', ['ember'], function(Ember) {
  var prefix = 'movie-booking-system';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("movie-booking-system/app")["default"].create({"name":"movie-booking-system","version":"0.0.0"});
}
//# sourceMappingURL=movie-booking-system.map
