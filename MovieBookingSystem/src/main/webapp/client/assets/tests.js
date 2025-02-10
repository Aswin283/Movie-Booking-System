'use strict';

define('movie-booking-system/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/bookings-container.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/bookings-container.js should pass ESLint\n\n');
  });

  QUnit.test('components/date-bar.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/date-bar.js should pass ESLint\n\n16:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/movie-container.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/movie-container.js should pass ESLint\n\n');
  });

  QUnit.test('components/screen-layout.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/screen-layout.js should pass ESLint\n\n2:10 - \'colors\' is defined but never used. (no-unused-vars)\n46:9 - Unexpected console statement. (no-console)\n92:19 - \'response\' is defined but never used. (no-unused-vars)\n99:17 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('components/show-container.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/show-container.js should pass ESLint\n\n');
  });

  QUnit.test('components/theatre-container.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/theatre-container.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n51:15 - \'error\' is defined but never used. (no-unused-vars)\n166:7 - Unexpected console statement. (no-console)\n167:7 - Unexpected console statement. (no-console)\n179:11 - Unexpected console statement. (no-console)\n286:39 - \'error\' is defined but never used. (no-unused-vars)\n302:28 - \'response\' is defined but never used. (no-unused-vars)\n306:39 - \'error\' is defined but never used. (no-unused-vars)\n351:57 - \'confirm_password\' is not defined. (no-undef)');
  });

  QUnit.test('controllers/bookings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/bookings.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/bookings/booking.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/bookings/booking.js should pass ESLint\n\n2:10 - \'colors\' is defined but never used. (no-unused-vars)\n12:5 - Unexpected console statement. (no-console)\n36:7 - Unexpected console statement. (no-console)\n37:7 - Unexpected console statement. (no-console)\n51:19 - \'response\' is defined but never used. (no-unused-vars)\n56:11 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/movies.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/movies.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/movies/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/movies/index.js should pass ESLint\n\n73:11 - Unexpected console statement. (no-console)\n74:11 - Unexpected console statement. (no-console)\n75:11 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/movies/shows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/movies/shows.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/movies/shows/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/movies/shows/index.js should pass ESLint\n\n2:10 - \'colors\' is defined but never used. (no-unused-vars)\n75:17 - \'xhr\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/movies/shows/show.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/movies/shows/show.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/theatres.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/theatres.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/theatres/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/theatres/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/theatres/shows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/theatres/shows.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/theatres/shows/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/theatres/shows/index.js should pass ESLint\n\n12:5 - Unexpected console statement. (no-console)\n18:3 - Duplicate key \'shows\'. (no-dupe-keys)\n19:3 - Duplicate key \'currentTheatre\'. (no-dupe-keys)\n28:11 - \'controller\' is assigned a value but never used. (no-unused-vars)\n42:13 - \'reject\' is not defined. (no-undef)\n46:11 - \'reject\' is not defined. (no-undef)\n107:11 - Unexpected console statement. (no-console)\n137:17 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/theatres/shows/show.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/theatres/shows/show.js should pass ESLint\n\n2:10 - \'colors\' is defined but never used. (no-unused-vars)\n33:15 - \'controller\' is assigned a value but never used. (no-unused-vars)\n34:13 - Unexpected console statement. (no-console)\n35:13 - Unexpected console statement. (no-console)\n43:27 - \'response\' is defined but never used. (no-unused-vars)\n52:19 - Unexpected console statement. (no-console)\n57:11 - Unexpected console statement. (no-console)\n58:11 - Unexpected console statement. (no-console)\n59:11 - Unexpected console statement. (no-console)\n69:15 - Unexpected console statement. (no-console)\n79:15 - Unexpected console statement. (no-console)\n83:15 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/city-name.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/city-name.js should pass ESLint\n\n15:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/date-generator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/date-generator.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/equal-to.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/equal-to.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/find-length.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/find-length.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/find-seat.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/find-seat.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/format-date.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/format-date.js should pass ESLint\n\n8:9 - \'dateObj\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('helpers/format-seats.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/format-seats.js should pass ESLint\n\n6:3 - Unexpected console statement. (no-console)\n7:3 - Unexpected console statement. (no-console)\n8:3 - Unexpected console statement. (no-console)\n9:3 - Unexpected console statement. (no-console)\n22:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/format-time.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-time.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/lookup-seat.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/lookup-seat.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/loop.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/loop.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/milli-to-minutes.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/milli-to-minutes.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/milli-to-show-timing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/milli-to-show-timing.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/mins-to-hours.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/mins-to-hours.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/not-equal-to.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/not-equal-to.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/tax-value.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/tax-value.js should pass ESLint\n\n6:1 - Unexpected console statement. (no-console)\n7:1 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/time-difference.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/time-difference.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/bookings.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/bookings.js should pass ESLint\n\n22:9 - Unexpected console statement. (no-console)\n41:30 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/bookings/booking.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/bookings/booking.js should pass ESLint\n\n5:5 - Unexpected console statement. (no-console)\n13:5 - Unexpected console statement. (no-console)\n23:11 - Unexpected console statement. (no-console)\n34:11 - Unexpected console statement. (no-console)\n43:5 - Unexpected console statement. (no-console)\n44:5 - Unexpected console statement. (no-console)\n45:5 - Unexpected console statement. (no-console)\n46:5 - Unexpected console statement. (no-console)\n47:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/bookings/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/bookings/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/movies.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/movies.js should pass ESLint\n\n27:34 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/movies/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/movies/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/movies/shows.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/movies/shows.js should pass ESLint\n\n32:9 - \'route\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/movies/shows/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/movies/shows/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/movies/shows/show.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/movies/shows/show.js should pass ESLint\n\n');
  });

  QUnit.test('routes/page-not-found.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/page-not-found.js should pass ESLint\n\n');
  });

  QUnit.test('routes/theatres.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/theatres.js should pass ESLint\n\n');
  });

  QUnit.test('routes/theatres/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/theatres/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/theatres/shows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/theatres/shows.js should pass ESLint\n\n');
  });

  QUnit.test('routes/theatres/shows/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/theatres/shows/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/theatres/shows/show.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/theatres/shows/show.js should pass ESLint\n\n46:30 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('utils/colors.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/colors.js should pass ESLint\n\n');
  });
});
define('movie-booking-system/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('movie-booking-system/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'movie-booking-system/tests/helpers/start-app', 'movie-booking-system/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('movie-booking-system/tests/helpers/resolver', ['exports', 'movie-booking-system/resolver', 'movie-booking-system/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('movie-booking-system/tests/helpers/start-app', ['exports', 'movie-booking-system/app', 'movie-booking-system/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('movie-booking-system/tests/integration/components/bookings-container.hbs-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('bookings-container.hbs', 'Integration | Component | bookings container.hbs', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "1E8SD+Qk",
      "block": "{\"statements\":[[1,[28,[\"bookings-container\",\"hbs\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6Kg2RXmM",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"component\"],[[28,[\"bookings-container\",\"hbs\"]]],null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/components/date-bar-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('date-bar', 'Integration | Component | date bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "wowJgkJK",
      "block": "{\"statements\":[[1,[26,[\"date-bar\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "oniKJvL7",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"date-bar\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/components/movie-container-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('movie-container', 'Integration | Component | movie container', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "p6UYBuWQ",
      "block": "{\"statements\":[[1,[26,[\"movie-container\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "5hMuBSl6",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"movie-container\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/components/screen-layout-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('screen-layout', 'Integration | Component | screen layout', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "KKnOp06l",
      "block": "{\"statements\":[[1,[26,[\"screen-layout\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "21eds1cS",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"screen-layout\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/components/show-container-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('show-container', 'Integration | Component | show container', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ONR+n+ED",
      "block": "{\"statements\":[[1,[26,[\"show-container\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6iRD3U3b",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"show-container\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/components/theatre-container-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('theatre-container', 'Integration | Component | theatre container', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "3e+bZvrR",
      "block": "{\"statements\":[[1,[26,[\"theatre-container\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "IAFPd9BP",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"theatre-container\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('movie-booking-system/tests/integration/helpers/city-name-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('city-name', 'helper:city-name', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "rjjM22u3",
      "block": "{\"statements\":[[1,[33,[\"city-name\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/date-generator-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('date-generator', 'helper:date-generator', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "nA5tM2nD",
      "block": "{\"statements\":[[1,[33,[\"date-generator\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/equal-to-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('equal-to', 'helper:equal-to', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "Yfcj4UZ/",
      "block": "{\"statements\":[[1,[33,[\"equal-to\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/find-length-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('find-length', 'helper:find-length', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "IhtCow5M",
      "block": "{\"statements\":[[1,[33,[\"find-length\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/find-seat-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('find-seat', 'helper:find-seat', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "GZWV2QwF",
      "block": "{\"statements\":[[1,[33,[\"find-seat\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/format-date-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-date', 'helper:format-date', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "+/CCj5S3",
      "block": "{\"statements\":[[1,[33,[\"format-date\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/format-seats-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-seats', 'helper:format-seats', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "TfFuNhob",
      "block": "{\"statements\":[[1,[33,[\"format-seats\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/format-time-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-time', 'helper:format-time', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "jGwYvE1s",
      "block": "{\"statements\":[[1,[33,[\"format-time\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/lookup-seat-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('lookup-seat', 'helper:lookup-seat', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "StxNqUkN",
      "block": "{\"statements\":[[1,[33,[\"lookup-seat\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/loop-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('loop', 'helper:loop', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "x2vhJfby",
      "block": "{\"statements\":[[1,[33,[\"loop\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/milli-to-minutes-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('milli-to-minutes', 'helper:milli-to-minutes', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "v3JivVHP",
      "block": "{\"statements\":[[1,[33,[\"milli-to-minutes\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/milli-to-show-timing-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('milli-to-show-timing', 'helper:milli-to-show-timing', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "k4QI9S+r",
      "block": "{\"statements\":[[1,[33,[\"milli-to-show-timing\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/mins-to-hours-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('mins-to-hours', 'helper:mins-to-hours', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "zt0MdWbu",
      "block": "{\"statements\":[[1,[33,[\"mins-to-hours\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/not-equal-to-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('not-equal-to', 'helper:not-equal-to', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "dcXk521/",
      "block": "{\"statements\":[[1,[33,[\"not-equal-to\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/tax-value-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('tax-value', 'helper:tax-value', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "YMENxWh7",
      "block": "{\"statements\":[[1,[33,[\"tax-value\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/time-difference-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('time-difference', 'helper:time-difference', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "oRPED07X",
      "block": "{\"statements\":[[1,[33,[\"time-difference\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/integration/helpers/user-check-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('user-check', 'helper:user-check', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "0rx8Cv/j",
      "block": "{\"statements\":[[1,[33,[\"user-check\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('movie-booking-system/tests/test-helper', ['movie-booking-system/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('movie-booking-system/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/bookings-container.hbs-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/bookings-container.hbs-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/date-bar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/date-bar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/movie-container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/movie-container-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/screen-layout-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/screen-layout-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/show-container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/show-container-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/theatre-container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/theatre-container-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/city-name-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/city-name-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/date-generator-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/date-generator-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/equal-to-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/equal-to-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/find-length-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/find-length-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/find-seat-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/find-seat-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-date-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-date-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-seats-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-seats-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-time-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-time-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/lookup-seat-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/lookup-seat-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/loop-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/loop-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/milli-to-minutes-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/milli-to-minutes-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/milli-to-show-timing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/milli-to-show-timing-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/mins-to-hours-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/mins-to-hours-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/not-equal-to-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/not-equal-to-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/tax-value-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/tax-value-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/time-difference-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/time-difference-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/user-check-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/user-check-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/admin-dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/admin-dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/bookings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/bookings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/bookings/booking-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/bookings/booking-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/movies-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/movies-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/movies/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/movies/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/movies/shows-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/movies/shows-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/movies/shows/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/movies/shows/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/movies/shows/show-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/movies/shows/show-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/theatres-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/theatres-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/theatres/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/theatres/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/theatres/shows-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/theatres/shows-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/theatres/shows/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/theatres/shows/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/theatres/shows/show-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/theatres/shows/show-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/bookings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/bookings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/bookings/booking-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/bookings/booking-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/bookings/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/bookings/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/movies-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/movies-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/movies/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/movies/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/movies/shows-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/movies/shows-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/movies/shows/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/movies/shows/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/movies/shows/show-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/movies/shows/show-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/page-not-found-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/page-not-found-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/theatres-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/theatres-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/theatres/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/theatres/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/theatres/shows-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/theatres/shows-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/theatres/shows/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/theatres/shows/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/theatres/shows/show-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/theatres/shows/show-test.js should pass ESLint\n\n');
  });
});
define('movie-booking-system/tests/unit/controllers/admin-dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:admin-dashboard', 'Unit | Controller | admin dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/bookings-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:bookings', 'Unit | Controller | bookings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/bookings/booking-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:bookings/booking', 'Unit | Controller | bookings/booking', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/movies-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:movies', 'Unit | Controller | movies', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/movies/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:movies/index', 'Unit | Controller | movies/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/movies/shows-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:movies/shows', 'Unit | Controller | movies/shows', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/movies/shows/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:movies/shows/index', 'Unit | Controller | movies/shows/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/movies/shows/show-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:movies/shows/show', 'Unit | Controller | movies/shows/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/theatres-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:theatres', 'Unit | Controller | theatres', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/theatres/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:theatres/index', 'Unit | Controller | theatres/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/theatres/shows-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:theatres/shows', 'Unit | Controller | theatres/shows', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/theatres/shows/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:theatres/shows/index', 'Unit | Controller | theatres/shows/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/controllers/theatres/shows/show-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:theatres/shows/show', 'Unit | Controller | theatres/shows/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('movie-booking-system/tests/unit/routes/bookings-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:bookings', 'Unit | Route | bookings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/bookings/booking-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:bookings/booking', 'Unit | Route | bookings/booking', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/bookings/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:bookings/index', 'Unit | Route | bookings/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/movies-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:movies', 'Unit | Route | movies', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/movies/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:movies/index', 'Unit | Route | movies/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/movies/shows-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:movies/shows', 'Unit | Route | movies/shows', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/movies/shows/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:movies/shows/index', 'Unit | Route | movies/shows/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/movies/shows/show-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:movies/shows/show', 'Unit | Route | movies/shows/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/page-not-found-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:page-not-found', 'Unit | Route | page not found', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/theatres-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:theatres', 'Unit | Route | theatres', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/theatres/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:theatres/index', 'Unit | Route | theatres/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/theatres/shows-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:theatres/shows', 'Unit | Route | theatres/shows', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/theatres/shows/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:theatres/shows/index', 'Unit | Route | theatres/shows/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('movie-booking-system/tests/unit/routes/theatres/shows/show-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:theatres/shows/show', 'Unit | Route | theatres/shows/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('movie-booking-system/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
