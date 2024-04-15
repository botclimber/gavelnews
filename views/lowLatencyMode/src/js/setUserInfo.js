const generateRandomString = (len) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("userFullName")
    localStorage.removeItem("userImg")
    localStorage.removeItem("userEmail")

    window.location.reload()
}

function eitherLoginOrLogout() {
    const menuLL = document.getElementById("buttonLL")

    if (userGoogleCredentials.token && !isTokenExpired(userGoogleCredentials.token)) menuLL.innerHTML = /* html */`<button onclick="logout()" class="ml-[5px] filter-btn" style="background-color: #2c2c2c"><svg class="w-5 h-5" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z" fill="#ffffff"></path> </g></svg></button>`

    else menuLL.innerHTML = /*html */ `
    <button id="googleAuth" onclick="googleLogin()" class="ml-[5px] filter-btn flex gap-2" style="background-color: #2c2c2c;">
                    <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                    <span>Login</span>
                </button>
    `
}

function isTokenExpired(token) {
    const decodedToken = decodeJwtResponse(token);
    const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    const currentTime = Date.now();
    return currentTime >= expirationTime;
}

function decodeJwtResponse(credential) {
    return JSON.parse(atob(credential.split('.')[1]));
}

function handleCredentialResponse(response) {

    const responsePayload = decodeJwtResponse(response.credential);

    localStorage.setItem("token", response.credential)
    localStorage.setItem("userFullName", responsePayload.name)
    localStorage.setItem("userEmail", responsePayload.email)
    localStorage.setItem("userImg", responsePayload.picture)

    window.location.reload();
}

function googleLogin() {
    google.accounts.id.initialize({
        client_id: "866181257750-3ta2ucj0q5ca06qoa42dvfo5mpf6mhh0.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleAuth"),
        { theme: "outline", size: "large" }  // customization attributes
    );

    google.accounts.id.prompt();
}

const getChatIcon = () => {
    const getIcon = localStorage.getItem("chatIcon")

    if (!getIcon) {
        const nrOfIcons = chatIcons.length
        const selIcon = Math.floor(Math.random() * nrOfIcons);

        localStorage.setItem("chatIcon", selIcon);

        return selIcon
    }

    return getIcon
}

const getUserInfo = () => {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (userInfo === null) {

        const userKey = generateRandomString(8)
        const userId = generateRandomString(8)

        const newUserInfo = { [userKey]: userId }

        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

        return newUserInfo
    }

    return userInfo
}

const userInfo = getUserInfo()
const chatIcon = getChatIcon()

const userGoogleCredentials = { token: localStorage.getItem("token"), name: localStorage.getItem("userFullName"), email: localStorage.getItem("userEmail"), img: localStorage.getItem("userImg") }
const headerWithToken = {
    'Content-Type': 'application/json',
    'Authorization': userGoogleCredentials.token || ""
}