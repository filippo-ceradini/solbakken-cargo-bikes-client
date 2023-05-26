<script>
    import { navigate } from 'svelte-routing';
    import io from "socket.io-client"
    const socket = io(import.meta.env.VITE_SOCKET_URL);

    import {onMount} from 'svelte';
    import {preferences} from "../stores/globalStore.js";
    let bike1 = 'https://cykelgruppen.dk/wp-content/uploads/2021/01/DK10004-scaled.jpg';
    let bike2 = 'https://www.larryvsharry.com/media/wysiwyg/cms_pages/Homepage/new-Original.jpg'

    let statusBike1 = "Available";
    let statusBike2 = "Available";

    function grtStatus() {
        socket.emit("test", 'test');
        console.log('asking for status');
        socket.emit("getBikeStatus", '6467cf90314e17fe4414a17f');
        socket.emit("getBikeStatus", '64675ee4253ddd95f01b580e');
    }

    socket.on('bike-status', ({ bikeId, status }) => {
        if (bikeId === 'bike1') {
            statusBike1 = status;
            console.log(statusBike1)
        } else if (bikeId === 'bike2') {
            statusBike2 = status;
            console.log(statusBike2)
        }
    });

    function bookBike1() {
        navigate('/book/bike1');
    }

    function bookBike2() {
        navigate('/book/bike2');
    }
</script>

<div class="group-vertical">
    <div class="bike-container">
        <span class="status-label {statusBike1.toLowerCase()}">{statusBike1}</span>
        <img src={bike1} class="bike-image" alt="Bike 1" on:click={bookBike1} />
    </div>
    <button on:click={() => {
        socket.emit("test", 'test');
        socket.emit("testAuth", 'testAuth');
        console.log('asking for status');

    }}>Check Socket</button>
    <div class="bike-container">
        <span class="status-label {statusBike2.toLowerCase()}">{statusBike2}</span>
        <img src={bike2} class="bike-image" alt="Bike 2" on:click={bookBike2} />
    </div>
</div>

<style>
    .group-vertical {
        display: flex;
        flex-direction: column; /* To arrange the images vertically */
        align-items: center;
        justify-content: center;
    }

    .bike-container {
        position: relative;
    }

    .status-label {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 10px;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 5px;
    }

    .status-label.available {
        background-color: green;
    }

    .status-label.booked {
        background-color: red;
    }

    .bike-image {
        padding: 5%;
        width: 90%; /* larger width for small screens */
        height: auto; /* This maintains the aspect ratio */
        transition: transform 0.3s ease-in-out; /* This will animate the scale effect */
    }

    @media screen and (min-width: 768px) {
        .bike-image {
            width: 30%; /* smaller width for larger screens */
        }
    }

    .bike-image:hover {
        transform: scale(1.05); /* Scale the image to 105% when hovered */
        cursor: pointer; /* Change the cursor to a hand when hovering over the image */
    }
</style>

