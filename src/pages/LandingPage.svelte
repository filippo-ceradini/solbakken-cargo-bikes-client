<script>
    import Login from "../components/Login.svelte";
    import Signup from "../components/Signup.svelte";
    import Modal from "../components/Modal.svelte";
    import {preferences} from '../stores/globalStore.js'
    import toastr from "toastr";
    import io from "socket.io-client"
    let showLogin = false;
    let showSignUp = false;
    preferences.subscribe(value => {
        showLogin = value.showLogin;
    });


    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.on('broadcast-log-messages', (data) => {
        if (data.success) {
            toastr.success(`${data.email} logged in`);

        } else {
            toastr.error("problem", data.error);
        }
    })

    const onShowLogin = () => {
        console.log("show login")
        preferences.update(value => {
            return {...value, showLogin: true};
        });
    }

    const onShowSignUp = () => {
        showSignUp = true;
    }

     export const onPopupClose = () => {
        preferences.update(value => {
            return {...value, showLogin: false};
        });
        showSignUp = false;
    }


</script>


<main>
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <h1>Solbakken Cargo Bikes</h1>
    <p>
        You can use this website to check the availability of the bikes here at Solbakken.
        <br/>

        Login and have Fun!


    </p>
    <button on:click={() => {
        socket.emit("testLogin", 'test');
        console.log('testing Login Session');
    }}>Test Login</button>
    <button on:click={() => {
        socket.emit("test", 'test');
        socket.emit("testAuth", 'testAuth');
        console.log('asking for status');
    }}>Check Socket</button>
    <!--    div that displays the buttons vertically-->
    <div class="btn-group-vertical">
        <button type="button" class="btn-dark" on:click={onShowLogin}>Login</button>
        <button type="button" class="btn-dark" on:click={onShowSignUp}>Sign-up</button>
    </div>


    <Modal bind:open={showLogin} title="Login" onClosed={(data) => onPopupClose(data)}>
        <Login/>
    </Modal>
    <Modal open={showSignUp} title="Sign-up" onClosed={(data) => onPopupClose(data)}>
        <Signup/>
    </Modal>

</main>

<style>
    .btn-group-vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .btn-dark {
        margin: 5px;
    }
</style>