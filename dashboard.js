document.addEventListener('DOMContentLoaded', () => {
    const workoutContainer = document.querySelector('.workout-logs');

    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

    if (workouts.length === 0) {
        const noRecordsDiv = document.createElement('div');
        noRecordsDiv.classList.add('no-records', 'text-center', 'text-white', 'mt-4');
        noRecordsDiv.textContent = 'No records';
        workoutContainer.appendChild(noRecordsDiv);
    } else {
        workouts.forEach(workout => {
            const workoutDiv = document.createElement('div');
            workoutDiv.classList.add('workout-box');
            workoutDiv.innerHTML = `
                <h3><span class="emoji">${workout.type === 'running' ? '🏃‍♂️' : workout.type === 'cycling' ? '🚴‍♀️' : '🚶‍♂️'}</span> ${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</h3>
                <p><strong>Calories Burned:</strong> ${workout.calories.toFixed(2)} kcal</p>
                <p><strong>Speed:</strong> ${workout.speed.toFixed(2)} km/h</p>
                <p><strong>Duration:</strong> ${(workout.duration / 3600).toFixed(2)} hrs</p>
                <p><strong>Distance:</strong> ${workout.distance.toFixed(2)} km</p>
            `;
            workoutContainer.appendChild(workoutDiv);
        });
    }
});
