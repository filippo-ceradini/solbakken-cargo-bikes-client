<script>
    import {Route, Router} from "svelte-navigator";
    import Navbar from "./components/Navbar.svelte";
    import HomePage from "./pages/HomePage.svelte";
    import io from "socket.io-client"
    import LandingPage from "./pages/LandingPage.svelte";
    import About from "./pages/About.svelte";

    import Contact from "./pages/Contact.svelte";
    import Account from "./pages/Account.svelte";
    import {preferences, socketConfig} from './stores/globalStore.js';
    import Calendar from "./components/Calendar.svelte";
    import fourOfour from "./components/fourOfour.svelte";
    import Report from "./pages/Report.svelte";
    import Verification from "./pages/Verification.svelte";
    import ResetPassword from "./pages/ResetPassword.svelte";
    import {onMount} from "svelte";
    import toastr from "toastr";

    const socket = io(socketConfig
        , {
            withCredentials: true
        });

    onMount(async () => {
            $preferences = {
                theme: 'dark',
                loggedIn: false,
                username: null,
                showLogin: false
            }
            //Retrieve session if Present
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            // This will log the response data (the user's email) to the console
            if (data.user !== undefined) {
                toastr.success("You are logged in as " + data.user.email);
                $preferences = {
                    theme: 'dark',
                    loggedIn: true,
                    username: data.user.email,
                    showLogin: false
                }

            } else {
                toastr.info("You are not logged in");
                $preferences.loggedIn = false;
            }
        }
    )

    let loggedIn;
    preferences.subscribe(value => {
        loggedIn = value.loggedIn
    })
</script>

<main>

    <Navbar/>

</main>


<Router>

    {#if loggedIn}
        <Route path="/" component={HomePage}/>
        <Route path="/account" component={Account}/>
        <Route path="/book/:item" component={Calendar}/>
        <Route path="/report" component={Report}/>
    {:else}
        <Route path="/" component={LandingPage}/>
    {/if}
    <Route path="/verify/:userId/:uniqueString" let:params component={Verification}/>
    <Route path="/reset-password/:userId/:uniqueString" let:params component={ResetPassword}/>
    <Route path="/about" component={About}/>
    <Route path="/contact" component={Contact}/>
    <Route path="*" component={fourOfour}/>
</Router>


<style>

</style>


