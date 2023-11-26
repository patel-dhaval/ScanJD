import { googleLogout } from "@react-oauth/google"; // Use "GoogleLogout" with an uppercase 'G'

const clientid = "144470612270-j2joq0cse01psn4i4ht1q90bftnt51ni.apps.googleusercontent.com";

function NewLogout() {
    const onSucces = () => {
        console.log("logged out");
    }

    return (
        <div id="signOutButton">
            <googleLogout 
                clientId={clientid}
                buttonText={"Logout"}
                onLogoutSuccess={onSucces}
            />

        </div>
    );
}

export default NewLogout;
