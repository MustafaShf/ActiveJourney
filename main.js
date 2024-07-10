class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(distance, duration, coords, calories = 0, speed = 0) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.calories = calories;
    this.speed = speed;
  }

  _setDescription() {
    // later
  }
}

class Running extends Workout {
  type = 'running';

  constructor(distance, duration, coords, calories = 0, speed = 0) {
    super(distance, duration, coords, calories, speed);
  }
}

class Walking extends Workout {
  type = 'walking';

  constructor(distance, duration, coords, calories = 0, speed = 0) {
    super(distance, duration, coords, calories, speed);
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(distance, duration, coords, calories = 0, speed = 0) {
    super(distance, duration, coords, calories, speed);
  }
}

class App {
  #map;
  #distance = 0;
  #markerA;
  #markerB;
  #markerCurrent;
  #pointA;
  #pointB;
  #pointCurrent;
  #routingControl;
  #workouts = [];
  #timerInterval;
  #hours = 0;
  #minutes = 0;
  #seconds = 0;
  #currentWorkout; 
  _watchId;

  constructor() {
    this._getPosition();
    this._attachEventHandlers();
    this._loadWorkoutsFromLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Cannot get your location");
        }
      );
    }
  }

  _loadMap(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let coords = [lat, long];
    this.#map = L.map("map").setView(coords, 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#pointA = coords;
    this.#markerA = L.marker(this.#pointA).addTo(this.#map);

    this._updateCurrentPosition();

    this._renderWorkoutMarker();
  }

  _newWorkout(type) {
    let workout;
    if (type === 'walking') {
      workout = new Walking(0, 0, this.#pointA);
    } else if (type === 'running') {
      workout = new Running(0, 0, this.#pointA);
    } else if (type === 'cycling') {
      workout = new Cycling(0, 0, this.#pointA);
    }

    this.#workouts.push(workout);
    this.#currentWorkout = workout; 
  }

  _renderWorkout() {
    // later
  }

  _renderWorkoutMarker() {
    this.#map.on("click", (e) => {
      if (!this.#pointB) {
        this.#pointB = e.latlng;
        this.#markerB = L.marker(this.#pointB).addTo(this.#map);

        if (this.#routingControl) {
          this.#map.removeControl(this.#routingControl);
        }

        this.#routingControl = L.Routing.control({
          waypoints: [L.latLng(this.#pointA), L.latLng(this.#pointB)],
          createMarker: () => null,
          routeWhileDragging: true,
        }).addTo(this.#map);
      }
    });
  }

  _updateCurrentPosition() {
    if (navigator.geolocation) {
        this._watchId = navigator.geolocation.watchPosition(
            (position) => {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                this.#pointCurrent = [lat, long];

                if (this.#markerCurrent) {
                    this.#map.removeLayer(this.#markerCurrent);
                }

                const currentPositionIcon = L.icon({
                    iconUrl: "./user.png",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                });

                this.#markerCurrent = L.marker(this.#pointCurrent, {
                    icon: currentPositionIcon,
                }).addTo(this.#map);

                if (this.#pointA && this.#currentWorkout) {
                    this.#distance = this.#map.distance(this.#pointA, this.#pointCurrent);
                    this.#currentWorkout.distance = this.#distance / 1000;
                    this.#currentWorkout.speed = this._calculateSpeed();
                    this.#currentWorkout.calories = this._calculateCalories();
                    this._updateUI();
                }
            },
            function () {
                alert("Cannot get your location");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
  }

  _timer() {
    const timerElement = document.querySelector(".timer-text");

    const updateTimer = () => {
      this.#seconds++;

      if (this.#seconds >= 60) {
        this.#seconds = 0;
        this.#minutes++;

        if (this.#minutes >= 60) {
          this.#minutes = 0;
          this.#hours++;
        }
      }

      const formattedTime = `${this.#hours.toString().padStart(2, "0")}:${this.#minutes
        .toString()
        .padStart(2, "0")}:${this.#seconds.toString().padStart(2, "0")}`;

      timerElement.textContent = formattedTime;
    };

    this.#timerInterval = setInterval(updateTimer, 1000);
  }

  _calculateSpeed() {
    if (this.#distance > 0 && this.#seconds > 0) {
      return (this.#distance / 1000) / (this.#seconds / 3600);
    }
    return 0;
  }

  _calculateCalories() {
    const MET = 2; // will change
    const weight = 55; 
    const durationInHours = this.#seconds/3600 ;  //for real project it must divide by 3600
    return MET * weight * durationInHours;
  }

  _updateUI() {
    document.querySelector('.distance-text').textContent = this.#currentWorkout.distance.toFixed(2);
    document.querySelector('.calories-text').textContent = this.#currentWorkout.calories.toFixed(2);
    document.querySelector('.speed-text').textContent = this.#currentWorkout.speed.toFixed(2);
  }

  _saveWorkoutsToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _loadWorkoutsFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (data) {
      this.#workouts = data.map(workout => {
        let restoredWorkout;
        if (workout.type === 'running') {
          restoredWorkout = new Running(workout.distance, workout.duration, workout.coords, workout.calories, workout.speed);
        } else if (workout.type === 'walking') {
          restoredWorkout = new Walking(workout.distance, workout.duration, workout.coords, workout.calories, workout.speed);
        } else if (workout.type === 'cycling') {
          restoredWorkout = new Cycling(workout.distance, workout.duration, workout.coords, workout.calories, workout.speed);
        }
        restoredWorkout.date = new Date(workout.date);
        restoredWorkout.id = workout.id;
        return restoredWorkout;
      });
    }
  }

  _attachEventHandlers() {
    document.querySelector('.start').addEventListener('click', () => {
        const form = document.querySelector('.form__input');
        const type = form.value.toLowerCase();
        this._newWorkout(type);
        this._timer();
    });

    document.querySelector('.stop').addEventListener('click', () => {
        clearInterval(this.#timerInterval);
        navigator.geolocation.clearWatch(this._watchId);
        this._saveWorkoutsToLocalStorage();
    });
  }
}

let app = new App();
