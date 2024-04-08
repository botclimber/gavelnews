const generateRandomString = (len) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

const getChatIcon = () => {
    const getIcon = localStorage.getItem("chatIcon")

    if(!getIcon){
        const nrOfIcons = chatIcons.length
        const selIcon = Math.floor(Math.random() * nrOfIcons);
        
        localStorage.setItem("chatIcon", selIcon);

        return selIcon
    } 

    return getIcon
}

const getUserInfo = () => {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if(userInfo === null){

        const userKey = generateRandomString(8)
        const userId = generateRandomString(8)

        const newUserInfo = {[userKey]: userId}

        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

        return newUserInfo
    }

    return userInfo
}
  
const userInfo = getUserInfo()
const chatIcon = getChatIcon()