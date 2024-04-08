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

const getUserId = () => {

    const userId = localStorage.getItem("userId")

    if(userId === null){
        const newUserId = generateRandomString(8)
        localStorage.setItem("userId", newUserId)

        return newUserId
    }

    return userId
}
  

const userId = getUserId()
const chatIcon = getChatIcon()