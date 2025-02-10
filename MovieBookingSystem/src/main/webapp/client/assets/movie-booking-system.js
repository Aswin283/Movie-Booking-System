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
define('movie-booking-system/components/bookings-container', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        classNames: ['booking-container']

    });
});
define('movie-booking-system/components/date-bar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    dateRange: Ember.computed(function () {
      var today = new Date();
      var dates = [];

      for (var i = 0; i < 10; i++) {
        var nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(nextDate.toISOString().split('T')[0]);
      }
      console.log;
      return dates;
    })
  });
});
define('movie-booking-system/components/movie-container', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        classNames: ['movie']
    });
});
define('movie-booking-system/components/screen-layout', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNames: ['container'],
    applicationController: null,
    isOpen: false,
    selectedSeats: null,
    seatTotalPrice: 0,
    finalPrice: 0,
    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    taxAmount: Ember.computed('seatTotalPrice', function () {
      return this.get('seatTotalPrice') * 0.05;
    }),

    open: function open() {
      this.toggleProperty('isOpen');
    },


    actions: {
      open: function open() {
        this.toggleProperty('isOpen');
      },
      selectSeat: function selectSeat(seat) {
        if (seat.seat_is_available) {
          Ember.set(seat, 'isSelected', !seat.isSelected);
        }
      },
      book: function book() {
        var controller = this;
        if (this.get('currentUser')) {
          var selectedSeats = this.get('seats').filter(function (seat) {
            return seat.isSelected;
          });
          var seatTotalPrice = selectedSeats.reduce(function (total, seat) {
            if (String(seat.seat_number).startsWith('A')) {
              return total + seat.seat_price * 0.5;
            } else {
              return total + seat.seat_price;
            }
          }, 0);
          console.log("selected seats::: " + selectedSeats);
          if (!selectedSeats.length) {
            controller.get('applicationController').triggerAlert("Please select the required seats", "#ffc107");
          } else {
            var convenienceFee = 30;
            var finalPrice = seatTotalPrice + convenienceFee + seatTotalPrice * 0.05;

            this.set('selectedSeats', selectedSeats);
            this.set('seatTotalPrice', seatTotalPrice);
            this.set('finalPrice', finalPrice);

            this.open();
          }
        } else {
          this.get('applicationController').send('toggleLoginPopup');
        }
      },
      confirm: function confirm() {
        var _this = this;

        var controller = this;
        var selectedSeats = this.get('selectedSeats');
        var showId = selectedSeats.length > 0 ? selectedSeats[0].seat_show_id : null;
        var seatIds = selectedSeats.map(function (seat) {
          return seat.seat_seat_id;
        });
        var currentUser = this.get('currentUser');

        if (!selectedSeats) {
          controller.get('applicationController').triggerAlert("Please select the required seats", "#ffc107");
          return;
        }

        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/users/' + currentUser.USER_user_id + '/bookings',
          type: 'POST',
          withCredentials: true,
          data: JSON.stringify({
            price: controller.get('finalPrice'),
            customer_id: currentUser.USER_user_id,
            show_id: showId,
            is_cancelled: false,
            seatIds: seatIds
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            controller.get('applicationController').triggerAlert("Booking successfull", "#28a745");
            _this.set('isOpen', false);
            controller.get('applicationController').redirectToTheatresShowsShow();
            controller.get('applicationController').redirectToMoviesShowsShow();
          },
          error: function error(_error) {
            controller.get('applicationController').triggerAlert("Booking failed", "#c50812");
          }
        });
      }
    }
  });
});
define('movie-booking-system/components/show-container', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        classNames: ['show-container']
    });
});
define('movie-booking-system/components/theatre-container', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        applicationController: null,
        onInit: Ember.on('init', function () {
            this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
        }),
        currentUser: Ember.computed.alias('applicationController.currentUser'),

        cityMap: {
            1: 'Chennai',
            2: 'Mumbai',
            3: 'Delhi',
            4: 'Bangalore',
            5: 'Hyderabad',
            6: 'Kolkata',
            7: 'Pune'
        },
        classNames: ['theatre-container']

    });
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
define('movie-booking-system/controllers/application', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    showAlert: false,
    alertMessage: '',
    alertColor: _colors.colors.success,
    alertSymbol: 'Check',

    searchValue: '',
    searchBarContent: "Search by movies...",
    currentUser: null,
    isLoginActive: false,
    loginPopup: false,
    profilePopup: false,
    currentRouteName: null,

    cities: [{ name: 'Chennai', value: '1' }, { name: 'Mumbai', value: '2' }, { name: 'Delhi', value: '3' }, { name: 'Bangalore', value: '4' }, { name: 'Hyderabad', value: '5' }, { name: 'Kolkata', value: '6' }, { name: 'Pune', value: '7' }],

    onInit: Ember.on('init', function () {
      if (this.get('currentUser') == null) {
        this.checkAuthentication();
      }
    }),

    checkAuthentication: function checkAuthentication() {
      var controller = this;

      Ember.$.ajax({
        url: 'http://localhost:8080/api/v1/authentication',
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).then(function (data) {
        if (data.success && data.data) {
          controller.set('currentUser', data.data.get(0));
        } else {
          controller.set('currentUser', null);
        }
      }).catch(function (error) {
        controller.set('currentUser', null);
      });
    },


    sidebarItems: Ember.computed(function () {
      return [{ label: 'Movies', isActive: 'isMovieActive', iconClass: "material-symbols-outlined", iconName: "movie", routeName: "movies" }, { label: 'Theatres', isActive: 'isTheatreActive', iconClass: "material-symbols-outlined", iconName: "theaters", routeName: "theatres" }, { label: 'Bookings', isActive: 'isHistoryActive', iconClass: "material-symbols-outlined", iconName: "event_available", routeName: "bookings" }];
    }),

    capitalizeFirstLetter: function capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },


    fullName: Ember.computed('currentUser.USER_first_name', 'currentUser.USER_last_name', function () {
      if (this.currentUser != null) {
        var firstName = this.get('currentUser.USER_first_name');
        var lastName = this.get('currentUser.USER_last_name');
        return this.capitalizeFirstLetter(firstName) + ' ' + this.capitalizeFirstLetter(lastName);
      }
      return 'Guest';
    }),

    toggleLoginActive: function toggleLoginActive() {
      this.toggleProperty('isLoginActive');
    },
    toggleLoginPopup: function toggleLoginPopup() {
      this.toggleProperty('loginPopup');
    },
    redirectToTheatres: function redirectToTheatres() {
      this.transitionToRoute('theatres');
    },
    redirectToTheatresShows: function redirectToTheatresShows() {
      this.transitionToRoute('theatres.shows');
    },
    redirectToTheatresShowsShow: function redirectToTheatresShowsShow() {
      this.transitionToRoute('theatres.shows.show');
    },
    redirectToMovies: function redirectToMovies() {
      this.transitionToRoute('movies');
    },
    redirectToMoviesShowsShow: function redirectToMoviesShowsShow() {
      this.transitionToRoute('movies.shows.show');
    },
    redirectToBookings: function redirectToBookings() {
      this.transitionToRoute('bookings');
    },
    checkUser: function checkUser(userType) {
      var currentUser = this.get('currentUser');
      if (currentUser && currentUser.USER_type === userType) {
        return true;
      }
      return false;
    },
    isValidPhoneNumber: function isValidPhoneNumber(phoneNumber) {
      var phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(phoneNumber);
    },
    isValidPassword: function isValidPassword(password) {
      var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      return passwordRegex.test(password);
    },
    triggerAlert: function triggerAlert(message) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#28a745';
      var symbol = arguments[2];

      this.set('alertMessage', message);
      this.set('alertColor', color);
      this.set('showAlert', true);
      this.set('alertSymbol', symbol);

      Ember.run.later(this, function () {
        this.set('showAlert', false);
      }, 3000);
    },
    substitutionCipherEncrypt: function substitutionCipherEncrypt(plainText) {
      var alphabet = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{}|;:',.<>?/";
      var shuffledAlphabet = "qazwsxedcrfvtgbyhnujmikolp9876543210)(*&^%$#@!/?><,.;:[]{}-=+_";

      return plainText.split('').map(function (char) {
        var index = alphabet.indexOf(char.toLowerCase());
        return index !== -1 ? shuffledAlphabet[index] : char;
      }).join('');
    },


    actions: {
      didTransition: function didTransition() {
        this.controller.set('searchValue', '');
        return true;
      },
      handleSearchInput: function handleSearchInput(value) {
        this.set('searchValue', value);
      },
      toggleProfilePopup: function toggleProfilePopup() {
        this.toggleProperty('profilePopup');
      },
      updateProfile: function updateProfile() {
        var _this = this;

        var firstName = this.get('updatedFirstName');
        var lastName = this.get('updatedLastName');
        var pno = this.get('updatedPno');
        var city = this.get('updatedCity');
        var updatedPassword = this.get('updatedPassword');
        var updatedConfirmPassword = this.get('updatedConfirmPassword');
        var passwordFlag = false;
        var controller = this;

        console.log("CITY: " + city);
        console.log("UPDATED PASS :" + updatedPassword);

        if (updatedPassword && updatedConfirmPassword) {
          if (!this.isValidPassword(updatedPassword)) {
            controller.triggerAlert("Password must be at least 8 characters long, include a letter, a number, and a special symbol.", _colors.colors.info);
            return;
          }

          if (updatedPassword !== updatedConfirmPassword) {
            console.log(updatedPassword + " " + updatedConfirmPassword);
            controller.triggerAlert("Passwords do not match", _colors.colors.info);
            return;
          }

          passwordFlag = true; // Enable the flag if passwords are valid
        }

        var userId = this.get('currentUser.USER_user_id');

        // Construct the data object conditionally
        var data = {
          first_name: firstName,
          last_name: lastName,
          pno: pno,
          city: city
        };

        if (passwordFlag) {
          data.updatedPassword = this.substitutionCipherEncrypt(updatedPassword);
          data.updatedConfirmPassword = this.substitutionCipherEncrypt(updatedConfirmPassword);
        }

        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/users/' + userId + '/update',
          method: 'PUT',
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify(data), // Pass the constructed data object
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            _this.set('currentUser.USER_first_name', firstName);
            _this.set('currentUser.USER_last_name', lastName);
            _this.set('currentUser.USER_pno', pno);
            _this.set('currentUser.address_city', city);

            _this.triggerAlert(response.message, _colors.colors.success, 'Check');
          },
          error: function error(_error) {
            _this.triggerAlert(_error.responseJSON.message, _colors.colors.error, "Close");
          }
        });

        this.set('isEditingProfile', false);
        this.set('profilePopup', false);
      },
      editProfile: function editProfile() {
        this.set('isEditingProfile', true);
        var ele = document.getElementsByClassName('sidebar-content');
        var formele = ele[0].getElementsByClassName('form-group');
        formele[4].style.display = 'block';
        this.set('updatedFirstName', this.get('currentUser.USER_first_name'));
        this.set('updatedLastName', this.get('currentUser.USER_last_name'));
        this.set('updatedPno', this.get('currentUser.USER_pno'));
        this.set('updatedCity', this.get('currentUser.address_city'));
      },
      closeProfile: function closeProfile() {
        this.set('isEditingProfile', false);
      },
      toggleLoginPopup: function toggleLoginPopup() {
        this.toggleProperty('loginPopup');
      },
      closeModal: function closeModal() {
        this.set('loginPopup', false);
        this.set('profilePopup', false);
      },
      flipToRegister: function flipToRegister() {
        document.getElementById('flipper').classList.add('flip');
      },
      flipToLogin: function flipToLogin() {
        document.getElementById('flipper').classList.remove('flip');
      },
      login: function login() {
        var phoneNumber = this.get('pno');
        var password = this.get('password');
        var controller = this;

        if (!phoneNumber || !password) {
          controller.triggerAlert("Enter both phone number and password", '#007bff');
          return;
        }
        Ember.$.ajax({
          url: 'http://localhost:8080/authentication/login',
          method: 'POST',
          data: JSON.stringify({
            pno: phoneNumber,
            //password:password
            password: this.substitutionCipherEncrypt(password)
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            controller.set('currentUser', response.data.get(0));
            controller.triggerAlert("Login Successfull!!", _colors.colors.success, 'Check');
            controller.toggleLoginActive();
            controller.toggleLoginPopup();
          },
          error: function error(xhr, status, _error2) {
            controller.triggerAlert("Login Failed!", _colors.colors.error, "Close");
          }
        });
      },
      logout: function logout() {
        var controller = this;
        Ember.$.ajax({
          url: 'http://localhost:8080/authentication/logout',
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            controller.set('currentUser', null);
            controller.triggerAlert("Logout successful!", _colors.colors.success, 'Check');
          },
          error: function error(xhr, status, _error3) {
            controller.triggerAlert("Logout failed", _colors.colors.error, 'Close');
          }
        });
      },
      register: function register() {
        var firstName = this.get('firstName');
        var lastName = this.get('lastName');
        var phoneNumber = this.get('registerPno');
        var city = this.get('city');

        var password = this.get('registerPassword');
        var confirmPassword = this.get('confirmPassword');
        var controller = this;

        if (!firstName || !phoneNumber || !city || !password || !confirmPassword) {
          controller.triggerAlert("Please fill all fields", _colors.colors.info);
          return;
        }

        if (!this.isValidPhoneNumber(phoneNumber)) {
          controller.triggerAlert("Please enter a valid 10-digit phone number.", _colors.colors.info);
          return;
        }

        if (!this.isValidPassword(password)) {
          controller.triggerAlert("Password must be at least 8 characters long, include a letter, a number, and a special symbol.", _colors.colors.info);
          return;
        }

        if (password !== confirmPassword) {
          controller.triggerAlert("Passwords do not match", _colors.colors.info);
          return;
        }

        var payload = {
          first_name: firstName,
          last_name: lastName,
          pno: phoneNumber,
          address: {
            city: city
          },
          password: this.substitutionCipherEncrypt(password),
          confirm_password: this.substitutionCipherEncrypt(confirm_password),
          type: 1
        };

        Ember.$.ajax({
          url: 'http://localhost:8080/authentication/register',
          type: 'POST',
          data: '[' + JSON.stringify(payload) + ']',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            controller.triggerAlert(response.message, _colors.colors.success);
            controller.toggleLoginPopup();
          },
          error: function error(_error4) {
            controller.triggerAlert(_error4.responseJSON.message, _colors.colors.error);
            controller.toggleLoginPopup();
          }
        });
      }
    }
  });
});
define('movie-booking-system/controllers/bookings', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        applicationController: null,
        currentUser: null,
        bookings: null
    });
});
define('movie-booking-system/controllers/bookings/booking', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    isOpen: false,
    applicationController: null,
    booking_id: null,
    seats: null,
    seat_ids: null,

    onInit: Ember.on('init', function () {
      console.log('init of bookings/booking');
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),
    currentUser: Ember.computed.alias('applicationController.currentUser'),

    actions: {
      open: function open() {
        this.set('isOpen', true);
      },
      close: function close() {
        this.set('isOpen', false);
      },
      cancelBooking: function cancelBooking() {
        var controller = this;
        var bookingId = this.get('booking_id');
        var seats = this.get('seats');
        var seat_ids = this.get('seat_ids');

        if (!bookingId || !seats || !seat_ids) {
          controller.get('applicationController').triggerAlert("Please fill out all required fields.", "#ffc107");
          return;
        }

        console.log("Booking ID to cancel:", bookingId);
        console.log("Seats:", seats);

        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/users/' + this.get('currentUser.USER_user_id') + '/bookings/' + bookingId,
          type: 'PUT',
          contentType: 'application/json',
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify({
            booking_id: bookingId,
            seats: seats,
            seat_ids: seat_ids
          }),
          success: function success(response) {
            controller.set('bookings.is_cancelled', 'true');
            controller.get('applicationController').triggerAlert("Booking Cancellation Successful", "#28a745");
          },
          error: function error(xhr, status, _error) {
            console.log('AJAX error:', status, _error);
            controller.get('applicationController').triggerAlert("Failed to cancel booking. Please try again.", "#dc3545");
          }
        });

        this.set('isOpen', false);
      }
    }
  });
});
define('movie-booking-system/controllers/movies', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),
    currentUser: Ember.computed.alias('applicationController.currentUser'),
    userType: Ember.computed.alias('applicationController.currentUser.USER_type')

  });
});
define('movie-booking-system/controllers/movies/index', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    isOpen: false,
    searchValue: '',
    filteredMovies: null,
    hasFilteredMovies: false,

    onInit: Ember.on('init', function () {
      this.set('filteredMovies', this.get('model'));
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),

    searchValueObserver: Ember.observer('applicationController.searchValue', function () {
      var searchValue = this.get('applicationController.searchValue');
      this.filterMovies(searchValue);
    }),

    filterMovies: function filterMovies(searchValue) {
      if (searchValue) {
        var filteredMovies = this.get('model').filter(function (movie) {
          return movie.movie_movie_name.toLowerCase().includes(searchValue.toLowerCase());
        });
        this.set('filteredMovies', filteredMovies.length > 0 ? filteredMovies : []);
        this.set('hasFilteredMovies', true);
      } else {
        this.set('filteredMovies', this.get('model'));
      }
    },


    actions: {
      handleSearchInput: function handleSearchInput(value) {
        this.set('searchValue', value);
      },
      addMovie: function addMovie() {
        var controller = this;
        var name = this.get('movieName');
        var duration = this.get('duration');
        var director = this.get('director');
        var genre = this.get('movieGenre');
        var language = this.get('language');
        var link = this.get("link");

        if (!name || !duration || !director || !genre || !language || !link) {
          controller.get('applicationController').triggerAlert("Please fill out all required fields.", _colors.colors.info);
          return;
        }

        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/movies',
          type: 'POST',
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify({
            movie_name: name,
            duration: duration,
            language: language,
            genre: genre,
            director: director,
            image_link: link
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function success(response) {
            controller.get('applicationController').triggerAlert(response.message, _colors.colors.success);
          },
          error: function error(_error) {
            console.log(1);
            console.log(_error);
            console.log(1);
            controller.get('applicationController').triggerAlert(_error.responseJSON.message, _colors.colors.error);
          }
        });
        this.set('isOpen', false);
      },
      close: function close() {
        this.set('isOpen', false);
      },
      open: function open() {
        this.set('isOpen', true);
      },
      willTransition: function willTransition() {
        var controller = this.controller;
        controller.set('searchValue', '');
        controller.set('applicationController.searchValue', '');
        controller.set('filteredMovies', controller.get('model'));
        controller.set('hasFilteredMovies', false);
      }
    }
  });
});
define('movie-booking-system/controllers/movies/shows', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    userType: Ember.computed.alias('applicationController.currentUser.USER_type')

  });
});
define('movie-booking-system/controllers/movies/shows/index', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    hasFilteredTheatres: false,
    searchValue: '',

    onInit: Ember.on('init', function () {
      this.set('filteredTheatres', this.get('model'));
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
      this.set('showsController', Ember.getOwner(this).lookup('controller:movies.shows'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    currentMovie: Ember.computed.alias('showsController.currentMovie'),
    shows: Ember.computed.alias('showsController.shows'),
    selectedDate: null,

    searchValueObserver: Ember.observer('applicationController.searchValue', function () {
      var searchValue = this.get('applicationController.searchValue');
      this.filterTheatres(searchValue);
    }),

    filterTheatres: function filterTheatres(searchValue) {
      var _this = this;

      var theatres = this.get('model');

      if (!theatres) {
        this.set('filteredTheatres', []);
        this.set('hasFilteredTheatres', false);
        return;
      }

      var filteredTheatres = Object.keys(theatres).filter(function (theatreName) {
        var matchesSearch = true;

        if (searchValue) {
          _this.set('hasFilteredTheatres', true);
          matchesSearch = theatreName.toLowerCase().includes(searchValue.toLowerCase());
        }

        return matchesSearch;
      });
      var filteredTheatreData = filteredTheatres.reduce(function (acc, theatreName) {
        acc[theatreName] = theatres[theatreName];
        return acc;
      }, {});

      this.set('filteredTheatres', filteredTheatreData);
    },


    actions: {
      handleSearchInput: function handleSearchInput(value) {
        this.set('searchValue', value);
        this.filterTheatres(value);
      },
      getShows: function getShows(date) {
        var _this2 = this;

        var movie_id = this.get('currentMovie.movie_movie_id');

        this.set('selectedDate', date);
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres?include=shows&movies=' + movie_id + '&date=' + date,
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            if (response && response.success) {
              _this2.set('shows', response.data);
            } else {
              // handle the error
            }
          },
          error: function error(xhr) {
            // handle the error
          }
        });
      }
    }
  });
});
define('movie-booking-system/controllers/movies/shows/show', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    showsController: Ember.computed(function () {
      return Ember.getOwner(this).lookup('controller:movies.shows');
    }),

    currentTheatre: Ember.computed.alias('showsController.currentTheatre')
  });
});
define('movie-booking-system/controllers/theatres', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    userType: Ember.computed.alias('applicationController.currentUser.USER_type')
  });
});
define('movie-booking-system/controllers/theatres/index', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        applicationController: Ember.inject.controller('application'),
        isOpen: false,
        managers: null,
        city: null,
        hasFilteredTheatres: false,
        searchValue: '',

        onInit: Ember.on('init', function () {
            this.set('filteredTheatres', this.get('model'));
            this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
        }),

        currentUser: Ember.computed.alias('applicationController.currentUser'),

        searchValueObserver: Ember.observer('applicationController.searchValue', function () {
            var searchValue = this.get('applicationController.searchValue');
            this.filterTheatres(searchValue);
        }),

        filterTheatres: function filterTheatres(searchValue) {
            var _this = this;

            var city = this.get('city');
            var theatres = this.get('model');

            if (!theatres) {
                this.set('filteredTheatres', []);
                this.set('hasFilteredTheatres', false);
                return;
            }

            var filteredTheatres = theatres.filter(function (theatre) {
                var matchesSearch = true;
                var matchesCity = true;

                if (searchValue) {
                    _this.set('hasFilteredTheatres', true);
                    matchesSearch = theatre.theatre_theatre_name.toLowerCase().includes(searchValue.toLowerCase());
                }

                if (city) {
                    _this.set('hasFilteredTheatres', true);
                    matchesCity = theatre.address_city === parseInt(city, 10);
                }

                return matchesCity && matchesSearch;
            });

            this.set('filteredTheatres', filteredTheatres);
        },


        cities: [{ name: 'Chennai', value: '1' }, { name: 'Mumbai', value: '2' }, { name: 'Delhi', value: '3' }, { name: 'Bangalore', value: '4' }, { name: 'Hyderabad', value: '5' }, { name: 'Kolkata', value: '6' }, { name: 'Pune', value: '7' }],

        actions: {
            selectCity: function selectCity(city) {
                this.set('city', city);
                this.filterTheatres(this.get('searchValue'));
            },
            handleSearchInput: function handleSearchInput(value) {
                this.set('searchValue', value);
                this.filterTheatres(value);
            },
            addTheatre: function addTheatre() {
                var _this2 = this;

                var requiredFields = ['theatreName', 'doorNo', 'streetAddress', 'city', 'pincode', 'screenRows', 'screenColumns', 'managerId'];
                if (requiredFields.some(function (field) {
                    return !_this2.get(field);
                })) {
                    this.get('applicationController').triggerAlert("Please fill out all required fields.", _colors.colors.info);
                    return;
                }

                var theatreData = {
                    theatre_name: this.get('theatreName'),
                    address: {
                        door_no: this.get('doorNo'),
                        street_address: this.get('streetAddress'),
                        city: this.get('city'),
                        pincode: this.get('pincode')
                    },
                    screen_rows: this.get('screenRows'),
                    screen_columns: this.get('screenColumns'),
                    manager_id: this.get('managerId')
                };

                Ember.$.ajax({
                    url: 'http://localhost:8080/api/v1/theatres',
                    type: 'POST',
                    data: JSON.stringify(theatreData),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function success(response) {
                        _this2.get('applicationController').triggerAlert(response.message, _colors.colors.success);

                        var newTheatre = response.data[0];
                        _this2.get('theatres').pushObject(newTheatre);
                        _this2.set('isOpen', false);
                    },
                    error: function error(_error) {
                        _this2.get('applicationController').triggerAlert(_error.responseJSON.message, _colors.colors.error);
                    }
                });
            },
            open: function open() {
                this.toggleProperty('isOpen');
                if (this.isOpen) {
                    this.fetchManagers();
                }
            },
            close: function close() {
                this.set('isOpen', false);
            },
            willTransition: function willTransition() {
                var controller = this.controller;
                controller.set('searchValue', '');
                controller.set('filteredTheatres', controller.get('model'));
                controller.set('hasFilteredTheatres', false);
            }
        },

        fetchManagers: function fetchManagers() {
            var _this3 = this;

            Ember.$.ajax({
                url: 'http://localhost:8080/api/v1/getusers',
                method: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function success(response) {
                    _this3.set('managers', response.success ? response.data : []);
                },
                error: function error() {
                    _this3.set('managers', []);
                }
            });
        }
    });
});
define('movie-booking-system/controllers/theatres/shows', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
      this.currentUser = Ember.computed.alias('applicationController.currentUser');
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    userType: Ember.computed.alias('applicationController.currentUser.USER_type'),

    actions: {
      close: function close() {
        this.set('isOpen', false);
      },
      open: function open() {
        this.set('isOpen', true);
      }
    }
  });
});
define('movie-booking-system/controllers/theatres/shows/index', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Ember$Controller$ext;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = Ember.Controller.extend((_Ember$Controller$ext = {
    isOpen: false,
    movies: null,
    currentTheatre: null,
    shows: null,
    selectedDate: null,

    onInit: Ember.on('init', function () {
      console.log('init of theatre/index');
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
      this.set('moviesController', Ember.getOwner(this).lookup('controller:application.moviesController'));
      this.set('showsController', Ember.getOwner(this).lookup('controller:theatres.shows'));
    }),
    currentUser: Ember.computed.alias('applicationController.currentUser')
  }, _defineProperty(_Ember$Controller$ext, 'shows', Ember.computed.alias('showsController.shows')), _defineProperty(_Ember$Controller$ext, 'currentTheatre', Ember.computed.alias('showsController.currentTheatre')), _defineProperty(_Ember$Controller$ext, 'toggleShowsPopup', function toggleShowsPopup() {
    this.toggleProperty('isOpen');
  }), _defineProperty(_Ember$Controller$ext, 'actions', {
    getShows: function getShows(date) {
      var _this = this;

      var theatre_id = this.get('currentTheatre.theatre_theatre_id');
      var controller = this;
      this.set('selectedDate', date);

      Ember.$.ajax({
        url: 'http://localhost:8080/api/v1/movies?include=shows&theatres=' + theatre_id + '&date=' + date,
        type: 'GET',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          if (response && response.success) {
            _this.set('shows', response.data);
          } else {
            reject(new Error(response.message || "No shows found."));
          }
        },
        error: function error(xhr) {
          reject(new Error("An error occurred: " + xhr.responseText));
        }
      });
    },
    addShow: function addShow() {
      var _this2 = this;

      var showTiming = this.get('showTiming');
      var movieId = this.get('movieId');
      var price = this.get('price');
      var theatreId = this.get('currentTheatre.theatre_theatre_id');
      var userId = this.get('currentUser.USER_user_id');
      var controller = this;

      if (!showTiming || !movieId || !price || !theatreId) {
        controller.get('applicationController').triggerAlert("Please fill out all required fields.", _colors.colors.info);
        return;
      }

      var showTimingMillis = new Date(showTiming).getTime();

      var payload = {
        timing: showTimingMillis,
        movie_id: movieId,
        price: price,
        theatre_id: theatreId,
        user_id: userId
      };

      Ember.$.ajax({
        url: 'http://localhost:8080/api/v1/theatres/' + theatreId + '/shows',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function success(response) {
          var newShowData = response.data[0];
          var movieName = newShowData.movie_movie_name;
          var newShow = {
            screen_rows: newShowData.theatre_screen_rows,
            screen_columns: newShowData.theatre_screen_columns,
            timing: newShowData.show_timing,
            movie_link: newShowData.movie_image_link,
            theatre_id: newShowData.show_theatre_id,
            movie_id: newShowData.movie_movie_id,
            is_cancelled: newShowData.show_is_cancelled,
            show_id: newShowData.show_show_id
          };

          var shows = _this2.get('shows') || {};
          var updatedShows = Object.assign({}, shows);

          if (!updatedShows[movieName]) {
            Ember.set(updatedShows, movieName, []);
          }
          updatedShows[movieName] = [].concat(_toConsumableArray(updatedShows[movieName]), [newShow]);

          _this2.set('shows', updatedShows);

          controller.get('applicationController').triggerAlert(response.message, _colors.colors.success);
          _this2.set('isOpen', false);
        },
        error: function error(_error) {
          console.log(_error);
          controller.get('applicationController').triggerAlert(_error.responseJSON.message, _colors.colors.error);
        }
      });
    },
    close: function close() {
      this.set('isOpen', false);
    },
    open: function open() {
      this.set('isOpen', true);

      var controller = this;

      Ember.$.ajax({
        url: 'http://localhost:8080/api/v1/movies?include=all',
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).then(function (response) {
        if (response.success && response.data) {
          controller.set('movies', response.data);
        } else {
          controller.set('movies', null);
        }
      }).catch(function (error) {
        controller.set('movies', null);
      });
    }
  }), _Ember$Controller$ext));
});
define('movie-booking-system/controllers/theatres/shows/show', ['exports', 'movie-booking-system/utils/colors'], function (exports, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    isCollectionOpen: false,
    isCancelShowOpen: false,
    applicationController: null,
    showsController: null,
    showId: null,
    seats: null,
    ticket_collection: null,
    fee_collection: null,
    tax_collection: null,
    total: null,
    total_tickets_sold: null,
    total_tickets: null,

    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
      this.set('showsController', Ember.getOwner(this).lookup('controller:theatres.shows'));
    }),
    currentUser: Ember.computed.alias('applicationController.currentUser'),
    currentTheatre: Ember.computed.alias('showsController.currentTheatre'),

    actions: {
      openCancelShow: function openCancelShow() {
        this.set('isCancelShowOpen', true);
      },
      closeCancelShow: function closeCancelShow() {
        this.set('isCancelShowOpen', false);
      },
      cancelShow: function cancelShow() {
        var _this = this;

        var controller = this;
        console.log("cancel theatre id: " + this.get('currentTheatre.theatre_theatre_id'));
        console.log("cancel show id: " + this.get('showId'));
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres/' + this.get('currentTheatre.theatre_theatre_id') + '/shows/' + this.get('showId'), // Include booking_id in the URL
          type: 'PUT',
          contentType: 'application/json',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            _this.set('isCancelShowOpen', false);

            _this.get('applicationController').triggerAlert("Show Cancellation successfull", "#28a745");
            _this.get('applicationController').redirectToTheatres();
          },
          error: function error(xhr, status, _error) {
            console.log('AJAX error:', status, _error);
          }
        });
      },
      getCollection: function getCollection() {
        console.log("collection ku info");
        console.log(this.get('showId'));
        console.log(this.get('currentTheatre.theatre_theatre_id'));
        var controller = this;
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres/' + controller.get('currentTheatre.theatre_theatre_id') + '/shows/' + controller.get('showId') + '/collections', // Include booking_id in the URL
          type: 'GET',
          contentType: 'application/json',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            console.log("response of colleciton");
            var result = response.data.get(0);

            controller.set('ticket_collection', result.ticket_collection);
            controller.set('fee_collection', result.fee_collection);
            controller.set('tax_collection', result.tax_collection);
            controller.set('total', result.ticket_collection + result.fee_collection + result.tax_collection);
            controller.set("total_tickets", result.total_tickets);
            controller.set("total_tickets_sold", result.total_tickets_sold);

            console.log("tax:" + controller.get('tax_collection'));
          },
          error: function error(xhr, status, _error2) {
            console.log('AJAX error:', status, _error2);
          }
        });
        this.set('isCollectionOpen', true);
      },
      close: function close() {
        this.set('isCollectionOpen', false);
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
define('movie-booking-system/helpers/city-name', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cityName = cityName;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var cityMap = {
    1: 'Chennai',
    2: 'Mumbai',
    3: 'Delhi',
    4: 'Bangalore',
    5: 'Hyderabad',
    6: 'Kolkata',
    7: 'Pune'
  };

  function cityName(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        number = _ref2[0];

    var parsedNumber = parseInt(number, 10);
    console.log(number);
    return cityMap[parsedNumber] || 'Unknown City';
  }

  exports.default = Ember.Helper.helper(cityName);
});
define('movie-booking-system/helpers/date-generator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.dateGenerator = dateGenerator;
  function dateGenerator() {
    var futureDates = [];
    var currentDate = new Date();

    var currentYear = currentDate.getFullYear();
    var currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    var currentDay = String(currentDate.getDate()).padStart(2, '0');

    futureDates.push(currentYear + '-' + currentMonth + '-' + currentDay);

    for (var i = 1; i <= 10; i++) {
      var futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + i);

      var year = futureDate.getFullYear();
      var month = String(futureDate.getMonth() + 1).padStart(2, '0');
      var day = String(futureDate.getDate()).padStart(2, '0');

      futureDates.push(year + '-' + month + '-' + day);
    }

    return futureDates;
  }

  exports.default = Ember.Helper.helper(dateGenerator);
});
define('movie-booking-system/helpers/equal-to', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.equalTo = equalTo;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function equalTo(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        userType = _ref2[0],
        type = _ref2[1];

    return userType === type;
  }

  exports.default = Ember.Helper.helper(equalTo);
});
define('movie-booking-system/helpers/find-length', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findLength = findLength;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function findLength(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        array = _ref2[0];

    return Array.isArray(array) ? array.length : 0;
  }

  exports.default = Ember.Helper.helper(findLength);
});
define('movie-booking-system/helpers/find-seat', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findSeat = findSeat;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function findSeat(_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        row = _ref2[0],
        col = _ref2[1],
        seats = _ref2[2];

    return seats.find(function (seat) {
      return seat.seat_number === '' + row + col;
    }) || {};
  }

  exports.default = Ember.Helper.helper(findSeat);
});
define('movie-booking-system/helpers/format-date', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatDate = formatDate;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function formatDate(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        date = _ref2[0];

    var _date$split = date.split('-'),
        _date$split2 = _slicedToArray(_date$split, 3),
        year = _date$split2[0],
        month = _date$split2[1],
        day = _date$split2[2];

    // Create a Date object using the provided values
    var dateObj = new Date(year + '-' + month + '-' + day);

    // Define an array of month names
    var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // Get the month name by using the month index (0-based, so subtract 1)
    var monthName = monthNames[parseInt(month, 10) - 1];

    // Return the formatted string with the month name and day
    return monthName + ' ' + day;
  }

  exports.default = Ember.Helper.helper(formatDate);
});
define("movie-booking-system/helpers/format-seats", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatSeats = formatSeats;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function formatSeats(_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        screenRows = _ref2[0],
        screenColumns = _ref2[1],
        seats = _ref2[2];

    var seatLayout = [];
    var seatIndex = 0;
    console.log(screenRows);
    console.log(seats);
    console.log("format seats row" + screenRows);
    console.log("format seats columns" + screenColumns);
    for (var row = 0; row < screenRows; row++) {
      var currentRow = [];
      for (var col = 0; col < screenColumns; col++) {
        if (seatIndex < seats.length) {
          currentRow.push(seats[seatIndex]);
          seatIndex++;
        } else {
          currentRow.push(null);
        }
      }
      seatLayout.push(currentRow);
    }
    console.log(seatLayout);
    return seatLayout;
  }

  exports.default = Ember.Helper.helper(formatSeats);
});
define('movie-booking-system/helpers/format-time', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatTime = formatTime;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function formatTime(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        milliseconds = _ref2[0];

    if (!milliseconds) {
      return '';
    }
    var date = new Date(milliseconds);

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes + ' ' + ampm;
  }

  exports.default = Ember.Helper.helper(formatTime);
});
define('movie-booking-system/helpers/lookup-seat', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lookupSeat = lookupSeat;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function lookupSeat(_ref, _ref2) {
    var _ref3 = _slicedToArray(_ref, 2),
        row = _ref3[0],
        col = _ref3[1];

    var seats = _ref2.seats;

    return seats.find(function (seat) {
      return seat.seat_number === '' + row + col;
    });
  }

  exports.default = Ember.Helper.helper(lookupSeat);
});
define('movie-booking-system/helpers/loop', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.loop = loop;
  function loop(params) {
    var count = parseInt(params[0], 10);
    var array = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
  }

  exports.default = Ember.Helper.helper(loop);
});
define('movie-booking-system/helpers/milli-to-minutes', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.milliToMinutes = milliToMinutes;
  function milliToMinutes(milli) {
    return Math.floor(milli / 60000);
  }

  exports.default = Ember.Helper.helper(milliToMinutes);
});
define('movie-booking-system/helpers/milli-to-show-timing', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatTime = formatTime;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function formatTime(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        milliseconds = _ref2[0];

    if (!milliseconds) {
      return '';
    }

    var date = new Date(milliseconds);

    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ' ' + ampm;
  }

  exports.default = Ember.Helper.helper(formatTime);
});
define('movie-booking-system/helpers/mins-to-hours', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.minsToHours = minsToHours;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function minsToHours(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        mins = _ref2[0];

    if (isNaN(mins)) {
      return '';
    }

    var hours = Math.floor(mins / 60);
    var minutes = mins % 60;

    var timeString = hours + 'h';
    if (minutes > 0) {
      timeString += ' ' + minutes + 'm';
    }

    return timeString;
  }

  exports.default = Ember.Helper.helper(minsToHours);
});
define('movie-booking-system/helpers/not-equal-to', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.notEqualTo = notEqualTo;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function notEqualTo(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        userType = _ref2[0],
        type = _ref2[1];

    return userType === type ? false : true;
  }

  exports.default = Ember.Helper.helper(notEqualTo);
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
define('movie-booking-system/helpers/tax-value', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.taxValue = taxValue;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function taxValue(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        totalAmount = _ref2[0];

    var originalAmount = (totalAmount - 30) / (1 + 0.05);
    console.log(originalAmount);
    console.log(totalAmount);

    var taxAmount = totalAmount - 30 - originalAmount;

    return taxAmount;
  }

  exports.default = Ember.Helper.helper(taxValue);
});
define('movie-booking-system/helpers/time-difference', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.timeDifference = timeDifference;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  // 1 - 86400000
  // 2 - finished show 0 ms

  function timeDifference(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        time = _ref2[0],
        differenceEnum = _ref2[1];

    var currentTime = Date.now();
    var timeDifference = time - currentTime;
    if (differenceEnum === 1) {
      return timeDifference >= 86400000;
    } else {
      return timeDifference < 0;
    }
  }
  exports.default = Ember.Helper.helper(timeDifference);
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
    this.route('movies', function () {
      this.route('shows', { path: '/:movie_id/shows' }, function () {
        this.route('show', { path: '/:show_id' });
      });
    });
    this.route('theatres', function () {
      this.route('shows', { path: '/:theatre_id/shows' }, function () {
        this.route('show', { path: '/:show_id' });
      });
    });
    this.route('bookings', function () {
      this.route('booking', { path: '/:booking_id' }); // New booking route
    });

    this.route('page-not-found', { path: '/*path' });
  });

  exports.default = Router;
});
define('movie-booking-system/routes/bookings', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({

    onInit: Ember.on('init', function () {
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', false);
    },
    beforeModel: function beforeModel() {
      var currentUser = this.get('currentUser');

      if (!currentUser) {
        var applicationController = this.get('applicationController');
        if (applicationController && typeof applicationController.toggleLoginPopup === 'function') {
          applicationController.toggleLoginPopup();
        } else {
          console.error('toggleLoginPopup is not defined in applicationController.');
        }
        return false;
      }
    },
    model: function model() {
      var currentUser = this.get('currentUser');
      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/users/' + currentUser.USER_user_id + '/bookings',
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            var bookings = response.data;
            resolve(bookings);
          },
          error: function error(xhr, status, _error) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    }
  });
});
define('movie-booking-system/routes/bookings/booking', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    onInit: Ember.on('init', function () {
      console.log('init of route/bookings');
      this.set('applicationController', Ember.getOwner(this).lookup('controller:application'));
    }),

    currentUser: Ember.computed.alias('applicationController.currentUser'),

    model: function model(params) {
      var _this = this;

      var booking_id = params.booking_id;
      console.log("BOOKINGS BOOKING ROUTE booking_id: " + booking_id);

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/users/' + _this.get('currentUser.USER_user_id') + '/bookings/' + booking_id,
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            console.log('Server booking response of selected movie:', response);
            var bookingData = response.data[0];

            resolve({
              booking_id: booking_id,
              bookings: bookingData,
              seats: bookingData.seats,
              seat_ids: bookingData.seat_ids
            });
          },
          error: function error(xhr, status, _error) {
            console.log('AJAX error:', status, _error);
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      console.log("Setting up booking controller with model:");
      console.log(model);
      console.log("seatssssss");
      console.log(model.seats);
      console.log(model.seat_ids);

      controller.set('booking_id', model.booking_id);
      controller.set('seats', model.seats);
      controller.set('seat_ids', model.seat_ids);
      controller.set('bookings', model.bookings);
    }
  });
});
define('movie-booking-system/routes/bookings/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('movie-booking-system/routes/movies', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', "Search by movies...");
    },
    model: function model() {
      var route = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/movies',
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            if (response && response.success) {
              route.dateRange = response.dateRange;
              var movies = response.data;
              resolve(movies);
            } else {
              reject(new Error(response.message || "No movies found."));
            }
          },
          error: function error(xhr, status, _error) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    }
  });
});
define('movie-booking-system/routes/movies/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('movie-booking-system/routes/movies/shows', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    showsCache: null,
    shows: null,
    onInit: Ember.on('init', function () {
      this.set('showsController', Ember.getOwner(this).lookup('controller:movies.shows'));
    }),

    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', "Search by theatres...");
    },
    getCurrentDate: function getCurrentDate() {
      var today = new Date();
      return today.toISOString().split('T')[0];
    },
    beforeModel: function beforeModel() {
      var movieId = this.paramsFor('movies.shows').movie_id;
      var movies = this.modelFor('movies');
      var isValidMovie = movies.some(function (movie) {
        return movie.movie_movie_id === parseInt(movieId);
      });

      if (!isValidMovie) {
        this.transitionTo('movies');
      }
    },
    model: function model(params) {
      var _this = this;

      var movie_id = params.movie_id;
      var route = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres?include=shows&movies=' + movie_id + '&date=' + _this.getCurrentDate(),
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            if (response && response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.message || "No shows found."));
            }
          },
          error: function error(xhr) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('shows', model);
      var movieId = this.paramsFor('movies.shows').movie_id;
      var movies = this.modelFor('movies');
      var currentMovie = movies.find(function (movie) {
        return movie.movie_movie_id === parseInt(movieId);
      });
      controller.set('currentMovie', currentMovie);
    }
  });
});
define('movie-booking-system/routes/movies/shows/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        activate: function activate() {
            var controller = this.controllerFor('movies.shows.index');
            var currentDate = new Date().toISOString().split('T')[0];
            controller.set('selectedDate', currentDate);
        }
    });
});
define('movie-booking-system/routes/movies/shows/show', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', false);
    },
    model: function model(params) {
      var movieParams = this.paramsFor('movies.shows');
      this.show_id = params.show_id;
      this.movie_id = movieParams.movie_id;
      var route = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/movies/' + route.movie_id + '/shows/' + route.show_id + '/seats',
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: function success(response) {
            if (response && response.success) {
              var _response$data$ = response.data[0],
                  screenRows = _response$data$.theatre_screen_rows,
                  screenColumns = _response$data$.theatre_screen_columns;

              resolve({ seats: response.data, screenRows: screenRows, screenColumns: screenColumns, showId: route.show_id });
            } else {
              reject(new Error(response.message || "No shows found."));
            }
          },
          error: function error(xhr) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    }
  });
});
define('movie-booking-system/routes/page-not-found', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('movie-booking-system/routes/theatres', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    cityMapping: {
      1: 'Chennai',
      2: 'Mumbai',
      3: 'Delhi',
      4: 'Bangalore',
      5: 'Hyderabad',
      6: 'Kolkata',
      7: 'Pune'
    },
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', "Search by theatres...");
    },
    model: function model() {
      var _this = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres',
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            if (response && response.success) {
              var theatres = response.data.map(function (theatre) {
                theatre.address_city_name = _this.cityMapping[theatre.address_city];
                return theatre;
              });
              resolve(theatres);
            } else {
              reject(new Error(response.message || "No theatres found."));
            }
          },
          error: function error(xhr) {
            reject(new Error('An error occurred: ' + xhr.responseText));
          }
        });
      });
    }
  });
});
define('movie-booking-system/routes/theatres/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.modelFor('theatres');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('theatres', model);
    },
    activate: function activate() {
      var controller = this.controllerFor('theatres.index');
      controller.set('city', null);
      controller.set('hasFilteredTheatres', false);
    }
  });
});
define('movie-booking-system/routes/theatres/shows', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    showsController: null,

    onInit: Ember.on('init', function () {
      this.set('showsController', Ember.getOwner(this).lookup('controller:theatres.shows'));
    }),
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', "Search by movies...");
    },
    getCurrentDate: function getCurrentDate() {
      var today = new Date();
      return today.toISOString().split('T')[0];
    },
    beforeModel: function beforeModel() {
      var theatreId = this.paramsFor('theatres.shows').theatre_id;
      var theatres = this.modelFor('theatres');

      if (!theatres.some(function (theatre) {
        return theatre.theatre_theatre_id === parseInt(theatreId);
      })) {
        this.transitionTo('theatres');
      }
    },
    model: function model(params) {
      var _this = this;

      var theatreId = params.theatre_id;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/movies?include=shows&theatres=' + theatreId + '&date=' + _this.getCurrentDate(),
          type: 'GET',
          success: function success(response) {
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.message || "No shows found."));
            }
          },
          error: function error(xhr) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('shows', model);

      var theatreId = this.paramsFor('theatres.shows').theatre_id;
      var theatres = this.modelFor('theatres');
      var currentTheatre = theatres.find(function (theatre) {
        return theatre.theatre_theatre_id === parseInt(theatreId);
      });
      controller.set('currentTheatre', currentTheatre);
    }
  });
});
define('movie-booking-system/routes/theatres/shows/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        activate: function activate() {
            var controller = this.controllerFor('theatres.shows.index');
            var currentDate = new Date().toISOString().split('T')[0];
            controller.set('selectedDate', currentDate);
        }
    });
});
define('movie-booking-system/routes/theatres/shows/show', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    activate: function activate() {
      var applicationController = Ember.getOwner(this).lookup('controller:application');
      applicationController.set('searchBarContent', false);
    },
    model: function model(params) {
      var theatreParams = this.paramsFor('theatres.shows');
      this.show_id = params.show_id;
      this.theatre_id = theatreParams.theatre_id;
      var route = this;

      var ticketsSold = null;
      var ticketsCollection = null;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
          url: 'http://localhost:8080/api/v1/theatres/' + route.theatre_id + '/shows/' + route.show_id + '/seats',
          type: 'GET',
          xhrFields: {
            withCredentials: true
          },
          success: function success(response) {
            if (response && response.success) {
              var screenRows = response.data[0].theatre_screen_rows;
              var screenColumns = response.data[0].theatre_screen_columns;

              ticketsSold = response.data.filter(function (seat) {
                return !seat.seat_is_available;
              }).length;

              ticketsCollection = response.data.filter(function (seat) {
                return !seat.seat_is_available;
              }).reduce(function (total, seat) {
                return total + seat.seat_price;
              }, 0);

              resolve({
                seats: response.data,
                screenRows: screenRows,
                screenColumns: screenColumns,
                ticketsSold: ticketsSold,
                ticketsCollection: ticketsCollection
              });
            } else {
              reject(new Error(response.message || "No shows found."));
            }
          },
          error: function error(xhr, status, _error) {
            reject(new Error("An error occurred: " + xhr.responseText));
          }
        });
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('seats', model.seats);
      controller.set('showId', this.show_id);
      controller.set('screenRows', model.screenRows);
      controller.set('screenColumns', model.screenColumns);
      controller.set('ticketsSold', model.ticketsSold);
      controller.set('ticketsCollection', model.ticketsCollection);
    }
  });
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
define("movie-booking-system/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hH44wV7q", "block": "{\"statements\":[[11,\"link\",[]],[15,\"rel\",\"icon\"],[15,\"href\",\"https://images.vexels.com/media/users/3/299373/isolated/preview/82645c0f2a9ffe857a9a79e025a3c168-combo-for-the-cinema.png\"],[15,\"type\",\"image/icon type\"],[13],[14],[0,\"\\n\\n\"],[11,\"header\",[]],[15,\"class\",\"dashboard-header\"],[13],[0,\"\\n  \\n  \"],[11,\"div\",[]],[15,\"class\",\"header-logo\"],[13],[0,\"\\n    \"],[11,\"img\",[]],[15,\"src\",\"https://images.vexels.com/media/users/3/299373/isolated/preview/82645c0f2a9ffe857a9a79e025a3c168-combo-for-the-cinema.png\"],[15,\"alt\",\"Logo\"],[13],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[0,\"  !!!Welcome \"],[1,[26,[\"fullName\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"searchBarContent\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"header-search\"],[13],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[16,\"placeholder\",[26,[\"searchBarContent\"]],null],[15,\"class\",\"search-input\"],[16,\"value\",[26,[\"searchValue\"]],null],[16,\"oninput\",[33,[\"action\"],[[28,[null]],\"handleSearchInput\"],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"currentUser\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"header-right\"],[13],[0,\"\\n   \\n   \"],[11,\"button\",[]],[15,\"class\",\"profile-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"toggleProfilePopup\"]],[13],[0,\" \\n      \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"person\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \\n    \"],[11,\"button\",[]],[15,\"class\",\"status-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"logout\"]],[13],[0,\" \\n      \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"logout\"],[14],[0,\"Logout\\n    \"],[14],[0,\"\\n\\n  \"],[14],[0,\"\\n   \\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n    \"],[11,\"button\",[]],[15,\"class\",\"status-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"toggleLoginPopup\"]],[13],[0,\" \\n      \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"login\"],[14],[0,\"Login\\n    \"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"\\n\"],[14],[0,\"\\n\"],[0,\"\\n\"],[0,\"\\n    \"],[11,\"nav\",[]],[15,\"class\",\"dashboard-sidebar\"],[13],[0,\"\\n      \"],[11,\"ul\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"sidebarItems\"]]],null,{\"statements\":[[6,[\"link-to\"],[[28,[\"navItem\",\"routeName\"]]],[[\"activeClass\",\"tagName\"],[\"active\",\"li\"]],{\"statements\":[[0,\"            \"],[11,\"span\",[]],[16,\"class\",[28,[\"navItem\",\"iconClass\"]],null],[13],[0,\"\\n              \"],[1,[28,[\"navItem\",\"iconName\"]],false],[0,\"\\n            \"],[14],[0,\"\\n            \"],[1,[28,[\"navItem\",\"label\"]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"navItem\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"main-content\"],[13],[0,\"\\n  \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"link\",[]],[15,\"rel\",\"stylesheet\"],[15,\"href\",\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined\"],[13],[14],[0,\"\\n\\n\\n\"],[6,[\"if\"],[[28,[\"profilePopup\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"sidebar-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"sidebar-content\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"class\",\"close-button\"],[5,[\"action\"],[[28,[null]],\"closeModal\"]],[13],[0,\"×\"],[14],[0,\" \\n      \"],[11,\"br\",[]],[13],[14],[0,\"\\n      \"],[11,\"h3\",[]],[13],[0,\"Profile\"],[14],[0,\"\\n      \"],[11,\"img\",[]],[15,\"src\",\"https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-qxsb84gy.png\"],[15,\"class\",\"profile-img\"],[13],[14],[0,\" \\n      \"],[11,\"form\",[]],[15,\"autocomplete\",\"off\"],[5,[\"action\"],[[28,[null]],\"updateProfile\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"updatedFirstName\"],[13],[0,\"First Name:\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\"],[\"text\",\"updatedFirstName\",[28,[\"updatedFirstName\"]],\"form-control\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"p\",[]],[13],[1,[28,[\"currentUser\",\"USER_first_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"updatedLastName\"],[13],[0,\"Last Name:\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\"],[\"text\",\"updatedLastName\",[28,[\"updatedLastName\"]],\"form-control\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"p\",[]],[13],[1,[28,[\"currentUser\",\"USER_last_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"updatedPno\"],[13],[0,\"Phone Number:\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\"],[\"number\",\"updatedPno\",[28,[\"updatedPno\"]],\"form-control\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"p\",[]],[13],[1,[28,[\"currentUser\",\"USER_pno\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"updatedCity\"],[13],[0,\"City:\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\"],[\"text\",\"updatedCity\",[33,[\"city-name\"],[[28,[\"updatedCity\"]]],null],\"form-control\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"p\",[]],[13],[1,[33,[\"city-name\"],[[28,[\"currentUser\",\"address_city\"]]],null],false],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[11,\"label\",[]],[15,\"for\",\"updatedPassword\"],[13],[0,\"Password :\"],[14],[0,\"\\n    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\",\"placeholder\"],[\"text\",\"updatedPassword\",[28,[\"updatedPassword\"]],\"form-control\",\"********\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"p\",[]],[13],[0,\"Password\"],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"    \"],[11,\"label\",[]],[15,\"for\",\"updatedConfirmPassword\"],[13],[0,\"Confirm Password :\"],[14],[0,\"\\n    \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"class\",\"placeholder\"],[\"text\",\"updatedConfirmPassword\",[28,[\"updatedConfirmPassword\"]],\"form-control\",\"********\"]]],false],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isEditingProfile\"]]],null,{\"statements\":[[0,\"      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"profile-save-btn\"],[5,[\"action\"],[[28,[null]],\"updateProfile\"]],[13],[0,\"Save\"],[14],[0,\"\\n      \"],[11,\"button\",[]],[15,\"class\",\"profile-cancel-btn\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"closeProfile\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"      \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"editProfile\"]],[13],[0,\"Edit\"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"loginPopup\"]]],null,{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"modal-overlay\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"signing-page\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"flipper\"],[15,\"id\",\"flipper\"],[13],[0,\"\\n      \"],[4,\" Login Section \"],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"login-section\"],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"class\",\"close-button\"],[5,[\"action\"],[[28,[null]],\"closeModal\"]],[13],[0,\"×\"],[14],[0,\" \"],[4,\" Close Button \"],[0,\"\\n\\n        \"],[11,\"h2\",[]],[13],[0,\"LOGIN\"],[14],[0,\"\\n        \"],[11,\"form\",[]],[15,\"autocomplete\",\"off\"],[5,[\"action\"],[[28,[null]],\"login\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"pno\"],[13],[0,\"Phone Numbere:\"],[14],[0,\"\\n            \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"number\",\"pno\",[28,[\"pno\"]],\"Enter your phone number\"]]],false],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"password\"],[13],[0,\"Password:\"],[14],[0,\"\\n            \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"password\",\"password\",[28,[\"password\"]],\"Enter your password\"]]],false],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"login-btn\"],[5,[\"action\"],[[28,[null]],\"login\"]],[13],[0,\"Login\"],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"login-footer\"],[13],[0,\"\\n\\n          \"],[11,\"a\",[]],[15,\"href\",\"#\"],[15,\"style\",\"color:#c50812;\"],[5,[\"action\"],[[28,[null]],\"flipToRegister\"]],[13],[0,\"Register Here\"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[4,\" Register Section \"],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"register-section\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"close-button\"],[5,[\"action\"],[[28,[null]],\"closeModal\"]],[13],[0,\"×\"],[14],[0,\" \\n  \"],[11,\"h2\",[]],[13],[0,\"REGISTER\"],[14],[0,\"\\n  \"],[11,\"form\",[]],[15,\"autocomplete\",\"off\"],[5,[\"action\"],[[28,[null]],\"register\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"sep-cont\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"firstName\"],[13],[0,\"First Name:\"],[14],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"text\",\"firstName\",[28,[\"firstName\"]],\"Enter your first name\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"lastName\"],[13],[0,\"Last Name:\"],[14],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"text\",\"lastName\",[28,[\"lastName\"]],\"Enter your last name\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"registerPno\"],[13],[0,\"Phone Number:\"],[14],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"number\",\"registerPno\",[28,[\"registerPno\"]],\"Enter your phone number\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"sep-cont\"],[13],[0,\"\\n    \\n\\n\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"city\"],[13],[0,\"City:\"],[14],[0,\"\\n \\n          \"],[11,\"select\",[]],[15,\"id\",\"city\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"city\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"required\",\"true\"],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a City\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"cities\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"city\",\"name\"]],null],[13],[1,[28,[\"city\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"city\"]},null],[0,\"          \"],[14],[0,\"\\n       \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group full-width\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"registerPassword\"],[13],[0,\"Password:\"],[14],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"password\",\"registerPassword\",[28,[\"registerPassword\"]],\"Enter your password\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group full-width\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"confirmPassword\"],[13],[0,\"Confirm Password:\"],[14],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\"],[\"password\",\"confirmPassword\",[28,[\"confirmPassword\"]],\"Confirm your password\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"register-btn\"],[5,[\"action\"],[[28,[null]],\"register\"]],[13],[0,\"Register\"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"login-footer\"],[13],[0,\"\\n    \"],[11,\"a\",[]],[15,\"href\",\"#\"],[5,[\"action\"],[[28,[null]],\"flipToLogin\"]],[13],[0,\"Sign in\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"showAlert\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"alert-message visible \"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"alert-box\"],[16,\"style\",[34,[\"background-color: \",[28,[null,\"alertColor\"]]]]],[13],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[1,[28,[null,\"alertSymbol\"]],false],[14],[0,\"\\n    \"],[11,\"span\",[]],[13],[1,[28,[null,\"alertMessage\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[11,\"div\",[]],[15,\"class\",\"alert-message hidden\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"alert-box\"],[16,\"style\",[34,[\"background-color: \",[28,[null,\"alertColor\"]]]]],[13],[0,\"\\n    \"],[11,\"span\",[]],[13],[1,[28,[null,\"alertMessage\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/application.hbs" } });
});
define("movie-booking-system/templates/bookings", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NB6j6X0l", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/bookings.hbs" } });
});
define("movie-booking-system/templates/bookings/booking", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lQ8l1qxk", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"sub-header\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"theatres.index\"],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"back-arrow\"],[13],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"arrow_back\"],[14],[0,\"\\n  \"],[14],[0,\"  \\n\"]],\"locals\":[]},null],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"booking-details\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"booking-left\"],[13],[0,\"\\n  \"],[11,\"img\",[]],[16,\"src\",[34,[[28,[\"bookings\",\"image_link\"]]]]],[16,\"alt\",[34,[[28,[\"bookings\",\"movie_name\"]],\" poster\"]]],[15,\"class\",\"booking-movie-image\"],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"booking-right\"],[13],[0,\"\\n  \"],[11,\"strong\",[]],[13],[0,\" \"],[11,\"h3\",[]],[13],[1,[28,[\"bookings\",\"movie_name\"]],false],[0,\" | \"],[1,[28,[\"bookings\",\"movie_language\"]],false],[14],[14],[0,\" \\n  \"],[11,\"h4\",[]],[13],[1,[28,[\"bookings\",\"movie_genre\"]],false],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[33,[\"mins-to-hours\"],[[28,[\"bookings\",\"movie_duration\"]]],null],false],[14],[0,\"\\n\"],[11,\"br\",[]],[13],[14],[0,\"\\n\"],[11,\"h5\",[]],[13],[0,\"Theatre Details:\"],[14],[0,\"\\n  \"],[11,\"h4\",[]],[13],[1,[28,[\"bookings\",\"theatre_name\"]],false],[14],[0,\"\\n  \"],[11,\"p\",[]],[13],[0,\"\\n    \"],[1,[28,[\"bookings\",\"theatre_door_no\"]],false],[0,\"\\n    \"],[1,[28,[\"bookings\",\"theatre_street_address\"]],false],[0,\"\\n    \"],[1,[33,[\"city-name\"],[[28,[\"bookings\",\"theatre_city\"]]],null],false],[0,\"\\n    \"],[1,[28,[\"bookings\",\"theatre_pincode\"]],false],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"br\",[]],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"show-details\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"show-time\"],[13],[0,\"\\n  \"],[11,\"h5\",[]],[13],[0,\"Show Timings:\"],[14],[0,\"\\n  \"],[11,\"h4\",[]],[13],[1,[33,[\"milli-to-show-timing\"],[[28,[\"bookings\",\"show_timing\"]]],null],false],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"show-booked\"],[13],[0,\"\\n  \"],[11,\"h2\",[]],[13],[0,\"Seats Booked :  \\n  \"],[11,\"h6\",[]],[13],[0,\" \\n\"],[6,[\"each\"],[[28,[\"bookings\",\"seats\"]]],null,{\"statements\":[[0,\"      \"],[1,[28,[\"seat\"]],false],[0,\"\\n\"]],\"locals\":[\"seat\"]},null],[0,\"  \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\" \\n\\n  \"],[11,\"table\",[]],[13],[0,\"\\n    \"],[11,\"h4\",[]],[13],[0,\"Payment Summary:\"],[14],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Total Payment\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"₹\"],[1,[28,[\"bookings\",\"price\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Tickets[x\"],[1,[33,[\"find-length\"],[[28,[\"bookings\",\"seats\"]]],null],false],[0,\"]\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[28,[\"bookings\",\"price\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Convenience Fee\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹30\"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Tax\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[33,[\"tax-value\"],[[28,[\"bookings\",\"price\"]]],null],false],[14],[0,\"\\n      \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"bookings\",\"is_cancelled\"]],\"false\"],null]],null,{\"statements\":[[6,[\"if\"],[[33,[\"time-difference\"],[[28,[\"bookings\",\"show_timing\"]],1],null]],null,{\"statements\":[[0,\"      \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"open\"]],[13],[0,\"\\n          Cancel Booking\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"time-difference\"],[[28,[\"bookings\",\"show_timing\"]],2],null]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"status finished\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[13],[0,\"finished \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"status unavailable-text\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[13],[0,\"Less than 24 hours \"],[14],[0,\" \\n    \"],[14],[0,\"\\n    \"]],\"locals\":[]}]],\"locals\":[]}]],\"locals\":[]},{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"status booking-cancelled\"],[13],[0,\"\\n    \"],[11,\"span\",[]],[13],[0,\"Booking Cancelled | Money Refunded\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n  \"],[14],[0,\"\\n  \\n\\n\\n\"],[6,[\"if\"],[[28,[\"isOpen\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n        \"],[11,\"h2\",[]],[13],[0,\"Cancel Ticket Confirmation\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"submit\"],[5,[\"action\"],[[28,[null]],\"cancelBooking\"]],[13],[0,\"Confirm\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"close\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/bookings/booking.hbs" } });
});
define("movie-booking-system/templates/bookings/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "x6hRrlQD", "block": "{\"statements\":[[0,\"  \"],[11,\"h2\",[]],[13],[0,\"Your Bookings\"],[14],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"      \"],[1,[33,[\"bookings-container\"],null,[[\"movie_name\",\"theatre_name\",\"show_timing\",\"movie_image\",\"is_cancelled\",\"id\"],[[28,[\"booking\",\"movie_name\"]],[28,[\"booking\",\"theatre_name\"]],[28,[\"booking\",\"show_timing\"]],[28,[\"booking\",\"image_link\"]],[28,[\"booking\",\"is_cancelled\"]],[28,[\"booking\",\"booking_id\"]]]]],false],[0,\"\\n\\n\"]],\"locals\":[\"booking\"]},{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"no-data\"],[13],[0,\"\\n  \"],[11,\"img\",[]],[15,\"src\",\"https://cdn.vectorstock.com/i/500p/04/25/no-data-empty-concept-vector-41830425.jpg\"],[15,\"class\",\"no-data-image\"],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[13],[0,\"No bookings available \"],[14],[0,\"  \\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/bookings/index.hbs" } });
});
define("movie-booking-system/templates/components/bookings-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "YHkbHlzH", "block": "{\"statements\":[[6,[\"link-to\"],[\"bookings.booking\",[28,[\"id\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"bordercontainer\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"is_cancelled\"]],\"true\"],null]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"cancelled-label\"],[13],[0,\"\\n        \"],[11,\"h4\",[]],[13],[0,\"CANCELLED\"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"time-difference\"],[[28,[\"show_timing\"]],0],null]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"finished-label\"],[13],[0,\"\\n        \"],[11,\"h4\",[]],[13],[0,\"FINISHED\"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"upcoming-label\"],[13],[0,\"\\n        \"],[11,\"h4\",[]],[13],[0,\"UPCOMING\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"]],\"locals\":[]}]],\"locals\":[]}],[0,\"  \\n    \"],[11,\"div\",[]],[15,\"class\",\"booking-details-left\"],[13],[0,\"\\n      \"],[11,\"img\",[]],[16,\"src\",[26,[\"movie_image\"]],null],[15,\"alt\",\"Movie Poster\"],[15,\"class\",\"booking-poster\"],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n    \\n    \"],[11,\"div\",[]],[15,\"class\",\"booking-details-right\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"mov-name\"],[13],[1,[26,[\"movie_name\"]],false],[14],[11,\"br\",[]],[13],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"timings\"],[13],[1,[26,[\"theatre_name\"]],false],[14],[11,\"br\",[]],[13],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"timings\"],[13],[1,[33,[\"milli-to-show-timing\"],[[28,[\"show_timing\"]]],null],false],[14],[0,\"\\n    \"],[14],[0,\"\\n              \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[13],[0,\"View More\"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/bookings-container.hbs" } });
});
define("movie-booking-system/templates/components/date-bar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "QRFRCy2r", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"date-scroll-bar\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"dateRange\"]]],null,{\"statements\":[[0,\"    \"],[11,\"button\",[]],[13],[1,[28,[\"date\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"date\"]},null],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/date-bar.hbs" } });
});
define("movie-booking-system/templates/components/movie-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "eXvDX7M6", "block": "{\"statements\":[[6,[\"link-to\"],[\"movies.shows\",[28,[\"movie_id\"]]],null,{\"statements\":[[0,\"  \"],[11,\"img\",[]],[16,\"src\",[26,[\"link\"]],null],[15,\"alt\",\"https://in.bmscdn.com/m6/images/common-modules/regions/chen.png\"],[15,\"class\",\"movie-image\"],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-details\"],[13],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[26,[\"name\"]],false],[0,\" | \"],[1,[26,[\"language\"]],false],[0,\" \"],[14],[0,\"\\n     \"],[11,\"p\",[]],[13],[1,[26,[\"genre\"]],false],[0,\" | \"],[1,[26,[\"director\"]],false],[0,\" \"],[11,\"br\",[]],[13],[14],[0,\" \"],[1,[33,[\"mins-to-hours\"],[[28,[\"duration\"]]],null],false],[14],[0,\"  \\n    \\n    \"],[11,\"button\",[]],[13],[0,\"Book Now\"],[14],[0,\"\\n\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/movie-container.hbs" } });
});
define("movie-booking-system/templates/components/screen-layout", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "phv5tOuT", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"screen\"],[13],[0,\"SCREEN\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"seating-area\"],[13],[0,\"\\n\"],[6,[\"each\"],[[33,[\"format-seats\"],[[28,[\"screenRows\"]],[28,[\"screenColumns\"]],[28,[\"seats\"]]],null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"seat-row\"],[16,\"style\",[34,[\"grid-template-columns: repeat(\",[26,[\"screenColumns\"]],\", 1fr);\"]]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"rows\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[16,\"class\",[34,[\"seat \",[33,[\"if\"],[[28,[\"seat\",\"seat_is_available\"]],\"vacant\",\"booked\"],null],\" \",[33,[\"if\"],[[28,[\"seat\",\"isSelected\"]],\"selected\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectSeat\",[28,[\"seat\"]]]],[13],[0,\"\\n          \"],[1,[28,[\"seat\",\"seat_number\"]],false],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"seat\"]},null],[0,\"    \"],[14],[0,\"\\n\"]],\"locals\":[\"rows\"]},null],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"legend\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"legend-item\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"legend-box vacant-box\"],[13],[14],[0,\"\\n    \"],[11,\"p\",[]],[13],[0,\"Vacant\"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"legend-item\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"legend-box selected-box\"],[13],[14],[0,\"\\n    \"],[11,\"p\",[]],[13],[0,\"Selected\"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"legend-item\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"legend-box booked-box\"],[13],[14],[0,\"\\n    \"],[11,\"p\",[]],[13],[0,\"Booked\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"button\",[]],[15,\"class\",\"book-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"book\"]],[13],[0,\"Book\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[0,\"Payment Invoice\"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"addmovieform\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"nsepcont\"],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"center-content\"],[13],[0,\"\\n          \"],[11,\"strong\",[]],[15,\"class\",\"seatselect\"],[13],[0,\"Seats Selected\"],[14],[0,\"\\n          \"],[11,\"ul\",[]],[15,\"class\",\"selectedseats\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"selectedSeats\"]]],null,{\"statements\":[[0,\"                       \"],[11,\"li\",[]],[13],[0,\" \"],[1,[28,[\"seat\",\"seat_number\"]],false],[0,\" \"],[14],[0,\"\\n\"]],\"locals\":[\"seat\"]},null],[0,\"            \"],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"table\",[]],[13],[0,\"\\n          \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"Total Price\"],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"₹\"],[1,[26,[\"finalPrice\"]],false],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"h4\",[]],[13],[0,\"Taxes and Fees\"],[14],[0,\"\\n          \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"Seat Price\"],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[26,[\"seatTotalPrice\"]],false],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"Convenience Fee\"],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"₹30\"],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"Tax(5%)\"],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[26,[\"taxAmount\"]],false],[14],[0,\"\\n          \"],[14],[0,\"\\n                \"],[11,\"br\",[]],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"addmovie\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[5,[\"action\"],[[28,[null]],\"confirm\"]],[13],[0,\"Confirm\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[5,[\"action\"],[[28,[null]],\"open\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/screen-layout.hbs" } });
});
define("movie-booking-system/templates/components/show-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "v9SbQ6+i", "block": "{\"statements\":[[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"link\"]],\"theatres.shows.show\"],null]],null,{\"statements\":[[0,\"    \"],[11,\"img\",[]],[16,\"src\",[28,[\"shows\",\"0\",\"movie_link\"]],null],[15,\"alt\",\"ddd\"],[15,\"class\",\"show-timings-image\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[11,\"h4\",[]],[13],[1,[26,[\"name\"]],false],[14],[0,\" \\n\"],[11,\"ul\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"shows\"]]],null,{\"statements\":[[6,[\"link-to\"],[[28,[\"link\"]],[28,[\"show\",\"show_id\"]]],null,{\"statements\":[[0,\"        \"],[11,\"li\",[]],[13],[0,\"\\n          \"],[1,[33,[\"format-time\"],[[28,[\"show\",\"timing\"]]],null],false],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"show\"]},null],[14],[0,\"\\n \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/show-container.hbs" } });
});
define("movie-booking-system/templates/components/theatre-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "k+e8UtVA", "block": "{\"statements\":[[6,[\"link-to\"],[\"theatres.shows\",[28,[\"theatre_id\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"theatre\"],[13],[0,\"\\n  \"],[11,\"img\",[]],[15,\"src\",\"https://t4.ftcdn.net/jpg/04/04/87/39/360_F_404873968_1EjhQM3nja9YCEkzsDYmd6an9jJJ9hy0.jpg\"],[15,\"alt\",\"https://images.pexels.com/photos/918281/pexels-photo-918281.jpeg?cs=srgb&dl=pexels-obregonia-d-toretto-325418-918281.jpg&fm=jpg\"],[15,\"class\",\"movie-image\"],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"theatre-details\"],[13],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[26,[\"name\"]],false],[0,\" | \"],[11,\"span\",[]],[13],[1,[26,[\"location\"]],false],[14],[14],[0,\"\\n    \"],[11,\"button\",[]],[13],[0,\"View All Movies\"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/components/theatre-container.hbs" } });
});
define("movie-booking-system/templates/movies", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "N5Nqvgbn", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/movies.hbs" } });
});
define("movie-booking-system/templates/movies/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3C35+6Bd", "block": "{\"statements\":[[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_type\"]],3],null]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"user-options\"],[13],[0,\"\\n    \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"open\"]],[13],[0,\" \\n      \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"Add\"],[14],[0,\" Movie\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"hasFilteredMovies\"]]],null,{\"statements\":[[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredMovies\"]]],null,{\"statements\":[[0,\"      \"],[1,[33,[\"movie-container\"],null,[[\"movie_id\",\"name\",\"language\",\"genre\",\"director\",\"duration\",\"link\"],[[28,[\"movie\",\"movie_movie_id\"]],[28,[\"movie\",\"movie_movie_name\"]],[28,[\"movie\",\"movie_language\"]],[28,[\"movie\",\"movie_genre\"]],[28,[\"movie\",\"movie_director\"]],[28,[\"movie\",\"movie_duration\"]],[28,[\"movie\",\"movie_image_link\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"movie\"]},null],[0,\"  \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"      \"],[1,[33,[\"movie-container\"],null,[[\"movie_id\",\"name\",\"language\",\"genre\",\"director\",\"duration\",\"link\"],[[28,[\"movie\",\"movie_movie_id\"]],[28,[\"movie\",\"movie_movie_name\"]],[28,[\"movie\",\"movie_language\"]],[28,[\"movie\",\"movie_genre\"]],[28,[\"movie\",\"movie_director\"]],[28,[\"movie\",\"movie_duration\"]],[28,[\"movie\",\"movie_image_link\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"movie\"]},null],[0,\"  \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[null,\"isOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[0,\"Add Movie\"],[14],[0,\"\\n      \"],[11,\"form\",[]],[15,\"class\",\"addmovie\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"sepcont\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"movieName\"],[13],[0,\"Movie Name:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"movieName\",[28,[null,\"movieName\"]],\"Enter the movie name\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"language\"],[13],[0,\"Language:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"language\",[28,[null,\"language\"]],\"Enter the language\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"duration\"],[13],[0,\"Duration (minutes):\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"number\",\"duration\",[28,[null,\"duration\"]],\"Enter the duration\",true]]],false],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"sepcont\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"movieGenre\"],[13],[0,\"Genre:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"movieGenre\",[28,[null,\"movieGenre\"]],\"Enter the genre\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"director\"],[13],[0,\"Director:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"director\",[28,[null,\"director\"]],\"Enter the director's name\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"link\"],[13],[0,\"Image link:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"link\",[28,[null,\"link\"]],\"Enter the image link\",true]]],false],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[null,\"link\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"image-preview\"],[13],[0,\"\\n              \"],[11,\"img\",[]],[16,\"src\",[28,[null,\"link\"]],null],[15,\"onerror\",\"this.onerror=null;this.src='https://marincateringcompany.com/wp-content/themes/pacc/images/no-preview.jpg';\"],[15,\"class\",\"preview-image\"],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"add-buttons\"],[13],[0,\"\\n\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"submit\"],[5,[\"action\"],[[28,[null]],\"addMovie\"]],[13],[0,\"Add Movie\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"close\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/movies/index.hbs" } });
});
define("movie-booking-system/templates/movies/shows", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9GNEyNkW", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/movies/shows.hbs" } });
});
define("movie-booking-system/templates/movies/shows/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ob0SL1Ao", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"sub-header\"],[13],[0,\"\\n\\n\"],[6,[\"link-to\"],[\"movies.index\"],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"back-arrow\"],[13],[0,\"\\n  \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"arrow_back\"],[14],[0,\"\\n\"],[14],[0,\"  \\n\"]],\"locals\":[]},null],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"movie-info\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-image\"],[13],[0,\" \\n     \"],[11,\"img\",[]],[16,\"src\",[28,[\"currentMovie\",\"movie_image_link\"]],null],[15,\"alt\",\"https://images.pexels.com/photos/918281/pexels-photo-918281.jpeg?cs=srgb&dl=pexels-obregonia-d-toretto-325418-918281.jpg&fm=jpg\"],[15,\"class\",\"movie-image\"],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-details\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[1,[28,[\"currentMovie\",\"movie_movie_name\"]],false],[0,\" \"],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[33,[\"mins-to-hours\"],[[28,[\"currentMovie\",\"movie_duration\"]]],null],false],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[28,[\"currentMovie\",\"movie_genre\"]],false],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[28,[\"currentMovie\",\"movie_language\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"date-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[33,[\"date-generator\"],null,null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[16,\"class\",[34,[\"date-box \",[33,[\"if\"],[[33,[\"equal-to\"],[[28,[\"date\"]],[28,[\"selectedDate\"]]],null],\"selected-date\"],null]]]],[5,[\"action\"],[[28,[null]],\"getShows\",[28,[\"date\"]]]],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"class\",\"date-btn\"],[13],[1,[33,[\"format-date\"],[[28,[\"date\"]]],null],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"date\"]},null],[14],[0,\"\\n\\n\\n\\n\\n\"],[6,[\"each\"],[[33,[\"-each-in\"],[[28,[\"shows\"]]],null]],null,{\"statements\":[[0,\"  \"],[1,[33,[\"show-container\"],null,[[\"link\",\"name\",\"shows\"],[\"movies.shows.show\",[28,[\"theatreName\"]],[28,[\"show\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"theatreName\",\"show\"]},{\"statements\":[[11,\"div\",[]],[15,\"class\",\"no-data\"],[13],[0,\"\\n  \"],[11,\"img\",[]],[15,\"src\",\"https://cdn.vectorstock.com/i/500p/04/25/no-data-empty-concept-vector-41830425.jpg\"],[15,\"class\",\"no-data-image\"],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[13],[0,\"No shows available \"],[14],[0,\"  \\n\"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/movies/shows/index.hbs" } });
});
define("movie-booking-system/templates/movies/shows/show", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yyOwF+l7", "block": "{\"statements\":[[6,[\"link-to\"],[\"theatres.index\"],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"back-arrow\"],[13],[0,\"\\n  \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"arrow_back\"],[14],[0,\"\\n\"],[14],[0,\"  \\n\"]],\"locals\":[]},null],[0,\"\\n\"],[1,[33,[\"screen-layout\"],null,[[\"screenRows\",\"screenColumns\",\"seats\"],[[28,[\"model\",\"screenRows\"]],[28,[\"model\",\"screenColumns\"]],[28,[\"model\",\"seats\"]]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/movies/shows/show.hbs" } });
});
define("movie-booking-system/templates/page-not-found", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GNBOM7PK", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"page-not-found-image\"],[13],[0,\"\\n    \"],[11,\"img\",[]],[15,\"src\",\"https://wallpapercave.com/wp/wp8639682.jpg\"],[15,\"class\",\"page-not-found-image\"],[13],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/page-not-found.hbs" } });
});
define("movie-booking-system/templates/theatres", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ox63TYfT", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/theatres.hbs" } });
});
define("movie-booking-system/templates/theatres/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "V0UOWrk3", "block": "{\"statements\":[[0,\"\\n\\n\\n\"],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_type\"]],3],null]],null,{\"statements\":[[0,\"    \\n      \"],[11,\"div\",[]],[15,\"class\",\"user-options\"],[13],[0,\"\\n           \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"open\"]],[13],[0,\"\\n          \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"Add\"],[14],[0,\" Theatre\\n        \"],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"city\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"selectCity\"],[[\"value\"],[\"target.value\"]]],null],[15,\"required\",\"true\"],[13],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a City\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"cities\"]]],null,{\"statements\":[[0,\"      \"],[11,\"option\",[]],[16,\"value\",[28,[\"city\",\"value\"]],null],[13],[1,[28,[\"city\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"city\"]},null],[0,\"  \"],[14],[0,\"\\n     \\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n \\n\"],[6,[\"each\"],[[28,[\"theatres\"]]],null,{\"statements\":[[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"theatre\",\"theatre_manager_id\"]],[28,[\"currentUser\",\"USER_user_id\"]]],null]],null,{\"statements\":[[11,\"h2\",[]],[13],[0,\"My Theatre\"],[14],[0,\"\\n    \"],[1,[33,[\"theatre-container\"],null,[[\"theatre_id\",\"name\",\"location\",\"manager_id\"],[[28,[\"theatre\",\"theatre_theatre_id\"]],[28,[\"theatre\",\"theatre_theatre_name\"]],[28,[\"theatre\",\"address_city_name\"]],[28,[\"theatre\",\"theatre_manager_id\"]]]]],false],[0,\"\\n    \"],[11,\"hr\",[]],[15,\"width\",\"100%;\"],[15,\"color\",\"red\"],[15,\"size\",\"3\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"theatre\"]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"hasFilteredTheatres\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"theatre-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredTheatres\"]]],null,{\"statements\":[[6,[\"if\"],[[33,[\"not-equal-to\"],[[28,[\"theatre\",\"theatre_manager_id\"]],[28,[\"currentUser\",\"USER_user_id\"]]],null]],null,{\"statements\":[[0,\"        \"],[1,[33,[\"theatre-container\"],null,[[\"theatre_id\",\"name\",\"location\",\"manager_id\"],[[28,[\"theatre\",\"theatre_theatre_id\"]],[28,[\"theatre\",\"theatre_theatre_name\"]],[28,[\"theatre\",\"address_city_name\"]],[28,[\"theatre\",\"theatre_manager_id\"]]]]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"theatre\"]},null],[0,\"  \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"theatre-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"theatres\"]]],null,{\"statements\":[[6,[\"if\"],[[33,[\"not-equal-to\"],[[28,[\"theatre\",\"theatre_manager_id\"]],[28,[\"currentUser\",\"USER_user_id\"]]],null]],null,{\"statements\":[[0,\"        \"],[1,[33,[\"theatre-container\"],null,[[\"theatre_id\",\"name\",\"location\",\"manager_id\"],[[28,[\"theatre\",\"theatre_theatre_id\"]],[28,[\"theatre\",\"theatre_theatre_name\"]],[28,[\"theatre\",\"address_city_name\"]],[28,[\"theatre\",\"theatre_manager_id\"]]]]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"theatre\"]},null],[0,\"  \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[0,\"Add Theatre\"],[14],[0,\"\\n      \"],[11,\"form\",[]],[15,\"class\",\"addmovie\"],[5,[\"action\"],[[28,[null]],\"addTheatre\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"sepcont\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"theatreName\"],[13],[0,\"Theatre Name:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"theatreName\",[28,[\"theatreName\"]],\"Enter the Theatre name\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"doorNo\"],[13],[0,\"Door No:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"doorNo\",[28,[\"doorNo\"]],\"Enter the Door No\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"streetAddress\"],[13],[0,\"Street Address:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"text\",\"streetAddress\",[28,[\"streetAddress\"]],\"Enter the street address\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"city\"],[13],[0,\"City:\"],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"city\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"city\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"required\",\"true\"],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a City\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"cities\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"city\",\"name\"]],null],[13],[1,[28,[\"city\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"city\"]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"sepcont\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"pincode\"],[13],[0,\"Pincode:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"number\",\"pincode\",[28,[\"pincode\"]],\"Enter the pincode\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"screenRows\"],[13],[0,\"Screen Rows:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"number\",\"screenRows\",[28,[\"screenRows\"]],\"Enter the screen rows\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"screenColumns\"],[13],[0,\"Screen Columns:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"number\",\"screenColumns\",[28,[\"screenColumns\"]],\"Enter the screen columns\",true]]],false],[0,\"\\n\\n          \"],[11,\"label\",[]],[15,\"for\",\"managerId\"],[13],[0,\"Manager:\"],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"managerId\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"managerId\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"required\",\"true\"],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a Manager\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"managers\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"manager\",\"USER_user_id\"]],null],[13],[0,\"\\n                \"],[1,[28,[\"manager\",\"USER_first_name\"]],false],[0,\" \"],[1,[28,[\"manager\",\"USER_last_name\"]],false],[0,\" - \"],[1,[28,[\"manager\",\"USER_pno\"]],false],[0,\" (\"],[1,[28,[\"manager\",\"address_city\"]],false],[0,\")\\n              \"],[14],[0,\"\\n\"]],\"locals\":[\"manager\"]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"add-buttons\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"submit\"],[5,[\"action\"],[[28,[null]],\"addTheatre\"]],[13],[0,\"Add Theatre\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"close\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n      \"],[14],[0,\"\\n      \\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/theatres/index.hbs" } });
});
define("movie-booking-system/templates/theatres/shows", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9w1JLzLu", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/theatres/shows.hbs" } });
});
define("movie-booking-system/templates/theatres/shows/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HCXc3Nji", "block": "{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"sub-header\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"theatres.index\"],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"back-arrow\"],[13],[0,\"\\n  \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"arrow_back\"],[14],[0,\"\\n\"],[14],[0,\"  \\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"movie-info\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-image\"],[13],[0,\" \\n     \"],[11,\"img\",[]],[15,\"src\",\"https://t4.ftcdn.net/jpg/04/04/87/39/360_F_404873968_1EjhQM3nja9YCEkzsDYmd6an9jJJ9hy0.jpg\"],[15,\"alt\",\"https://images.pexels.com/photos/918281/pexels-photo-918281.jpeg?cs=srgb&dl=pexels-obregonia-d-toretto-325418-918281.jpg&fm=jpg\"],[15,\"class\",\"movie-image\"],[13],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"movie-details\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[1,[28,[\"currentTheatre\",\"theatre_theatre_name\"]],false],[0,\" \"],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[28,[\"currentTheatre\",\"address_city_name\"]],false],[0,\" \"],[14],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[28,[\"currentTheatre\",\"address_door_no\"]],false],[0,\", \"],[1,[28,[\"currentTheatre\",\"address_street_address\"]],false],[0,\", \"],[1,[28,[\"currentTheatre\",\"address_city_name\"]],false],[0,\" - \"],[1,[28,[\"currentTheatre\",\"address_pincode\"]],false],[0,\" \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\\n\"],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_type\"]],2],null]],null,{\"statements\":[[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_user_id\"]],[28,[\"currentTheatre\",\"theatre_manager_id\"]]],null]],null,{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"user-options\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"open\"]],[13],[0,\" \\n    \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"Add\"],[14],[0,\"Show\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"date-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[33,[\"date-generator\"],null,null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[16,\"class\",[34,[\"date-box \",[33,[\"if\"],[[33,[\"equal-to\"],[[28,[\"date\"]],[28,[\"selectedDate\"]]],null],\"selected-date\"],null]]]],[5,[\"action\"],[[28,[null]],\"getShows\",[28,[\"date\"]]]],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"class\",\"date-btn\"],[13],[1,[33,[\"format-date\"],[[28,[\"date\"]]],null],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"date\"]},null],[14],[0,\"\\n\\n\"],[6,[\"each\"],[[33,[\"-each-in\"],[[28,[\"shows\"]]],null]],null,{\"statements\":[[0,\"  \"],[1,[33,[\"show-container\"],null,[[\"link\",\"name\",\"shows\"],[\"theatres.shows.show\",[28,[\"movieName\"]],[28,[\"show\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"movieName\",\"show\"]},{\"statements\":[[11,\"div\",[]],[15,\"class\",\"no-data\"],[13],[0,\"\\n  \"],[11,\"img\",[]],[15,\"src\",\"https://cdn.vectorstock.com/i/500p/04/25/no-data-empty-concept-vector-41830425.jpg\"],[15,\"class\",\"no-data-image\"],[13],[14],[0,\"\\n  \"],[11,\"div\",[]],[13],[0,\"No shows available \"],[14],[0,\"  \\n\"],[14],[0,\"\\n\"]],\"locals\":[]}],[6,[\"if\"],[[28,[\"isOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[0,\"Add Show\"],[14],[0,\"\\n      \"],[11,\"form\",[]],[15,\"class\",\"addmovieform\"],[5,[\"action\"],[[28,[null]],\"submit\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"showTiming\"],[13],[0,\"Show Timing:\"],[14],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"required\"],[\"datetime-local\",\"showTiming\",[28,[\"showTiming\"]],true]]],false],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"movieId\"],[13],[0,\"Movie:\"],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"managerId\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"movieId\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"required\",\"true\"],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a movie\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"movies\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"movie\",\"movie_movie_id\"]],null],[13],[0,\"\\n              \"],[1,[28,[\"movie\",\"movie_movie_name\"]],false],[0,\" | (\"],[1,[28,[\"movie\",\"movie_language\"]],false],[0,\")\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"movie\"]},null],[0,\"        \"],[14],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"price\"],[13],[0,\"Price :\"],[14],[0,\"\\n        \"],[1,[33,[\"input\"],null,[[\"type\",\"id\",\"value\",\"placeholder\",\"required\"],[\"number\",\"price\",[28,[\"price\"]],\"Enter the price\",true]]],false],[0,\"\\n      \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"add-buttons\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"submit\"],[5,[\"action\"],[[28,[null]],\"addShow\"]],[13],[0,\"Add Show\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"close\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/theatres/shows/index.hbs" } });
});
define("movie-booking-system/templates/theatres/shows/show", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Uy6BiDVr", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"sub-header\"],[13],[0,\"\\n\"],[6,[\"link-to\"],[\"theatres.index\"],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"back-arrow\"],[13],[0,\"\\n  \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"arrow_back\"],[14],[0,\"\\n\"],[14],[0,\"  \\n\"]],\"locals\":[]},null],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"user-options\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_user_id\"]],[28,[\"currentTheatre\",\"theatre_manager_id\"]]],null]],null,{\"statements\":[[0,\"  \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"openCancelShow\"]],[13],[0,\" \\n   \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"close\"],[14],[0,\" Cancel Show\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"equal-to\"],[[28,[\"currentUser\",\"USER_user_id\"]],[28,[\"currentTheatre\",\"theatre_manager_id\"]]],null]],null,{\"statements\":[[0,\"    \"],[11,\"button\",[]],[15,\"class\",\"option-button\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"getCollection\"]],[13],[0,\" \\n     \"],[11,\"span\",[]],[15,\"class\",\"material-symbols-outlined\"],[13],[0,\"info\"],[14],[0,\"  View Collection\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[14],[0,\"\\n\\n\\n\\n\\n\"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isCancelShowOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[0,\"Cancel Show Confirmation\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"addmov\"],[15,\"type\",\"submit\"],[5,[\"action\"],[[28,[null]],\"cancelShow\"]],[13],[0,\"Confirm\"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"closeCancelShow\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"cancelShowPopup\"]]],null,{\"statements\":[[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"],[1,[33,[\"screen-layout\"],null,[[\"screenRows\",\"screenColumns\",\"seats\"],[[28,[\"model\",\"screenRows\"]],[28,[\"model\",\"screenColumns\"]],[28,[\"model\",\"seats\"]]]]],false],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isCollectionOpen\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"popup-overlay\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"popup-content\"],[13],[0,\"\\n        \"],[11,\"table\",[]],[13],[0,\"\\n    \"],[11,\"h4\",[]],[13],[0,\"Payment Summary:\"],[14],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Total Tickets \"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[26,[\"total_tickets\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Total Tickets Sold\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[26,[\"total_tickets_sold\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Tickets Collection \"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[26,[\"ticket_collection\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Convenience Fee\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[26,[\"fee_collection\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"Tax Collection\"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"₹\"],[1,[26,[\"tax_collection\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n  \\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Total Collection\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"₹\"],[1,[26,[\"total\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \\n  \"],[14],[0,\"\\n      \\n        \"],[11,\"button\",[]],[15,\"class\",\"cancel\"],[15,\"type\",\"button\"],[5,[\"action\"],[[28,[null]],\"close\"]],[13],[0,\"Close\"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "movie-booking-system/templates/theatres/shows/show.hbs" } });
});
define('movie-booking-system/utils/colors', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var colors = exports.colors = {
        success: '#46cf34',
        error: '#c50812',
        info: '#007bff',
        warning: '#ffc107'
    };
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
