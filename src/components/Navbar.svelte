<script>
    import {preferences, socket} from '../stores/globalStore.js'
    import toastr from 'toastr';
    import 'toastr/build/toastr.min.css';
    import {onMount} from 'svelte';
    import {navigate} from "svelte-navigator";

    let username = null;
    preferences.subscribe(value => {
        username = value.username;
    });
    let loggedIn = false;
    onMount(() => {
        preferences.subscribe(value => {
            loggedIn = value.loggedIn;
        });
    });
    let dropdown = false;

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


    function logout() {
        preferences.update(value => {
            if (value.username !== null) {
                $socket.emit("logout", value.username);
                return {
                    theme: 'dark',
                    loggedIn: false,
                    username: null,
                    showLogin: false
                };
            } else {
                toastr.error("You are not logged in");
                return value;
            }
        });
        toastr.info("Logged out successfully");
        navigate("/");
    }


</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3 fixed-top">
    <a class="navbar-brand" href="#" on:click|preventDefault={() => navigate('/')}>Home</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarCollapsible" aria-controls="navbarCollapsible"
            aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarCollapsible">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link" href="#" on:click|preventDefault={() => navigate('/contact')}>Contact</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" on:click|preventDefault={() => navigate('/about')}>About</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            {#if loggedIn}
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-expanded="false">
                        {username}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" on:click|preventDefault={() => navigate('/account')}>Profile</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" on:click={logout} on:keypress>Logout</a>
                    </div>

                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li></li>
                    </ul>
                </li>
            {:else}
                <li class="nav-item">
                    <a class="nav-link" on:click={openLoginModal}>Login</a>
                </li>
            {/if}
        </ul>
    </div>
</nav>


<style>
</style>
