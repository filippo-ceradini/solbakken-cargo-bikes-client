<script>
    import {socket} from '../stores/globalStore.js';
    import {useParams} from "svelte-navigator";
    import toastr from 'toastr';
    let now = new Date()

    let hours = Array(24).fill(null).map((_, i) => i);
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Start the week on Monday

    let selectedBike = '64675ee4253ddd95f01b580e'; // The currently selected bike
    let availability = writable({}); // Availability status
    let weekOffset = writable(0); // Current week offset
    let currentDay = writable(0)
    let currentHour = writable(0)
    let dayDates = writable(0)
    let daysDates = writable(0)
    let dayOfTheWeek = now.getDay(); // 0 (for Sunday) through 6 (for Saturday)
    let daysUntilNextMonday;


    // Initialize the component
    initialize();

    // Function to initialize the component
    function initialize() {
        let now = new Date();

        $currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
        currentHour = now.getHours();

        // Calculate days until next Monday
        let dayOfTheWeek = now.getDay();
        daysUntilNextMonday = dayOfTheWeek === 0 ? 1 : (7 - dayOfTheWeek + 1) % 7;


        updateWeekAvailability();
    }

    // Function to update week availability
    function updateWeekAvailability() {
        $availability = generateAvailabilityMap();
        fetchBookings();
    }

    // Function to generate availability map
    function generateAvailabilityMap() {
        let avMap = {};
        let dayDates = getDayDates();

        days.forEach((day, index) => {
            let dayDate = dayDates[index];
            let now = new Date();
            if (dayDate < now) {
                avMap[day] = Array(24).fill('Past');
            } else if (dayDate.getDate() === now.getDate() && dayDate.getMonth() === now.getMonth() && dayDate.getFullYear() === now.getFullYear()) {
                avMap[day] = Array(24).fill('Available').map((_, hour) => hour >= currentHour ? 'Available' : 'Past');
            } else {
                avMap[day] = Array(24).fill('Available');
            }
        });

        return avMap;
    }

    // Function to fetch bookings
    async function fetchBookings() {
        // Get the start and end dates of the current week
        let startDate = $daysDates[0];
        let endDate = $daysDates[6]

        try {
            let response = await fetch(import.meta.env.VITE_API_URL + '/api/weekly-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                }),
            });
            let body = {
                startDate: startDate,
                endDate: endDate,
            }

            let data = await response.json();
            if (data.status === 200) {
                bookings = data.bookings;
                updateAvailability();  // Update the availability map with the fetched bookings
            } else {
                toastr.error(data.message);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }



    // Function to get day dates
    function getDayDates() {
        let d = new Date();
        let currentWeekOffset = $weekOffset;
        if (d.getDay() === 0 && $weekOffset === 0) {
            currentWeekOffset = 0;
        }
        $daysDates = Array(7).fill(null).map((_, i) => {
            let d = new Date();
            d.setDate((now.getDate() + i - 7 + daysUntilNextMonday) + currentWeekOffset * 7); // add 'i' days plus days until next Monday to the current date
            return d;
        });
        return Array(7).fill(null).map((_, i) => {
            let newDate = new Date();
            newDate.setDate((d.getDate() + i - 7 + daysUntilNextMonday) + currentWeekOffset * 7);
            return newDate;
        });

    }

    // if today is Sunday
    if (dayOfTheWeek === 0) {
        daysUntilNextMonday = 1;
    } else {
        // otherwise
        daysUntilNextMonday = (7 - dayOfTheWeek + 1) % 7;
    }


    dayDates = Array(7).fill(null).map((_, i) => {
        let d = new Date();
        d.setDate(now.getDate() + i - 7 + daysUntilNextMonday); // add 'i' days plus days until next Monday to the current date
        return d;
    });

    $daysDates = Array(7).fill(null).map((_, i) => {
        let d = new Date();
        d.setDate(now.getDate() + i - 7 + daysUntilNextMonday); // add 'i' days plus days until next Monday to the current date
        return d;
    });


    // Function to format the date in European format (dd.mm.yyyy)
    function formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }


    import {writable} from "svelte/store";

    let bookings = []; // The current bookings


    function updateAvailability() {
        bookings.forEach(booking => {
            let bookingDate = new Date(booking.startTime);
            let day = days[bookingDate.getDay() === 0 ? 6 : bookingDate.getDay() - 1]; // Adjust for starting the week on Monday
            let hour = bookingDate.getHours();
            $availability[day][hour] = 'Booked';
        });
    }


    let cleanupFunction;

    // Function to navigate to the next/previous week
    function navigateWeek(offset) {
        // Clean up the old event listeners
        if (cleanupFunction) {
            cleanupFunction();
        }
        $weekOffset += offset;
        // Update the week and create new event listeners
        cleanupFunction = updateWeekAvailability();
    }

    async function bookBike(day, hour) {
        toastr.success(`Bike booked for ${day} at ${hour}:00`);
        if ($availability[day][hour] !== 'Booked' && $availability[day][hour] !== 'Past') {
            let bookingDate = dayDates[days.indexOf(day)]; // Get the date for the selected day
            let year = bookingDate.getFullYear();
            let month = bookingDate.getMonth();
            let date = bookingDate.getDate();
            $socket.emit("ciao")
            console.log('createBooking', {
                startTime: new Date(year, month, date, hour),
                endTime: new Date(year, month, date, hour + 1),
                itemID: selectedBike,
                userID: "murray88mph@gmail.com"
            });
            $socket.emit('createBooking', {
                startTime: new Date(year, month, date, hour),
                endTime: new Date(year, month, date, hour + 1),
                itemID: selectedBike,
                userID: "murray88mph@gmail.com"
            });
        }
    }


    async function createBooking(day, hour) {
        if ($availability[day][hour] !== 'Booked' && $availability[day][hour] !== 'Past') {
            let bookingDate = dayDates[days.indexOf(day)]; // Get the date for the selected day
            let year = bookingDate.getFullYear();
            let month = bookingDate.getMonth();
            let date = bookingDate.getDate();
            const response = await fetch(import.meta.env.VITE_API_URL+'/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startTime: new Date(year, month, date, hour),
                    endTime: new Date(year, month, date, hour + 1),
                    itemID: '64675ee4253ddd95f01b580e',
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message);
                await fetchBookings()
            } else {
                console.error(result.message);
            }
        }
    }

</script>

<main>
    <div class="control-container">
        <div>
            {#if $weekOffset !== 0}
                <a on:click={() => navigateWeek(-1)}>⬅️</a> <!-- Navigate to previous week -->
            {:else}
                <a>⏹️</a> <!-- Navigate to next week -->
            {/if}
        </div>
        <div>
            <label>
                <input type="radio" bind:group={selectedBike} value="64675ee4253ddd95f01b580e">
                Bike 1
            </label>
            <label>
                <input type="radio" bind:group={selectedBike} value="6467cf90314e17fe4414a17f">
                Bike 2
            </label>
        </div>
        <div>

            <a on:click={() => navigateWeek(1)}>➡️</a> <!-- Navigate to next week -->
        </div>
    </div>


    <table class="table-container">
        <thead>
        <tr>

            {#each days as day, i (day)}
                <th class="cell">
                    <h4>{formatDate($daysDates[i])}</h4>
                    <h5>{day}</h5>
                </th>
            {/each}

        </tr>
        </thead>
        <tbody>
        {#each hours as hour}
            <tr>
                {#each days as day}
                    {#if $availability[day][hour] === 'Past'}
                        <td class="cell Past">
                            {hour}:00
                        </td>
                    {:else}
                        <td class="cell {$availability[day][hour]}"
                            on:click={() => createBooking(day, hour)}>
                            {hour}:00
                        </td>
                    {/if}
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
</main>


<style>

    body {
        min-width: 100vw;
        overflow-x: hidden;
        background-color: #222222;
    }

    main {
        padding-top: 70px;
    }

    /* Existing styles... */

    a {
        font-size: 1em; /* Set the initial size of the arrows */
    }

    input[type='radio'] {
        width: 1em; /* Set the initial size of the radio buttons */
        height: 1em; /* Set the initial size of the radio buttons */
    }

    @media (max-width: 600px) {
        a {
            font-size: 2em; /* Increase the size of the arrows on small screens */
        }

        input[type='radio'] {
            width: 2em; /* Increase the size of the radio buttons on small screens */
            height: 2em; /* Increase the size of the radio buttons on small screens */
        }
    }

    @media (max-width: 860px) {
        th h4, th h5 {
            font-size: smaller;
        }

        .cell {
            width: 4vmax;
        }

        main {
            padding-top: 10px; /* adjust as needed */
            padding-left: 0;
            padding-right: 0;
        }

        .table-container {
            width: 80%; /* adjust as needed */
        }
    }

    .cell {
        height: 3vh; /* smaller height */
        width: 11vmax; /* larger width */
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        box-sizing: border-box; /* makes sure the border is included in the element's total width and height */

    }

    .control-container {
        font-size: 2em;
        display: flex;
        justify-content: space-between;
    }

    .bike-selector {
        font-size: 2em;
    }

    .table-container {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .cell.Available {
        background-color: green;
        color: white;
        cursor: pointer;
    }

    .cell.Past {
        background-color: grey;
        color: white;
    }

    .cell.Booked {
        background-color: red;
        color: white;
    }

</style>
