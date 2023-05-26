<script>
    import {preferences} from '../stores/globalStore.js'
    import toastr from 'toastr';
    import 'toastr/build/toastr.min.css';
    import {onMount} from 'svelte';

    import io from "socket.io-client"
    import {navigate} from "svelte-routing";
    let username = null;
    preferences.subscribe(value => {
        console.log("navbar thinks",value.loggedIn, value)
        username = value.username;
    });
    let loggedIn = false;
    onMount(() => {
        preferences.subscribe(value => {
            loggedIn = value.loggedIn;
        });
    });

    function openLoginModal() {
        preferences.update(value => {
            return {...value, showLogin: true};
        });
    }


    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "1000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }


    const socket = io(import.meta.env.VITE_SOCKET_URL);

    function logout() {
        // preferences.update(value => {
        //     if (value.username !== null) {
        //         socket.emit("logout", value.username);
        //         return { theme: 'dark',
        //             loggedIn: false,
        //             username: null,
        //             showLogin: false };
        //     } else {
        //         toastr.error("You are not logged in");
        //         return value;
        //     }
        // });
        // toastr.info("Logged out successfully");
        // navigate("/");
    }


</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3 fixed-top">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" on:click|preventDefault={() => navigate('/')}>Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" on:click|preventDefault={() => navigate('/contact')}>Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" on:click|preventDefault={() => navigate('/about')}>About</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                {#if loggedIn}
                    <li>
                        <a class="nav-link" on:click={logout}  >Logout</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            {username}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" on:click|preventDefault={() => navigate('/account')}>Profile</a></li>
                        </ul>
                    </li>
                {:else}
                    <li class="nav-item">
                        <a class="nav-link" on:click={openLoginModal}>Login</a>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>


<style>
    .navbar {
        width: 100%;
        z-index: 1000;
    }

    .navbar-expand-lg .navbar-collapse {
        display: flex !important;
        justify-content: space-around;
        flex-basis: auto;
    }

</style>
