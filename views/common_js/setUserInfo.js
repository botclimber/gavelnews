const generateRandomString = (len) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
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