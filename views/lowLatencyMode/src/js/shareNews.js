function share(media) {

    switch (media) {
        case "mail":
            const subject = "Someone is sharing a new with you from Gavel News platform."
            window.open(`mailto:?subject=${subject}&body=${modalLastClickedNew.toShareLink}`, "_blank");; break;

        case "whatsapp": window.open(`whatsapp://send?text=${modalLastClickedNew.toShareLink}`, "_blank"); break;

        case "telegram": window.open(`https://t.me/share/url?url=${modalLastClickedNew.toShareLink}&text=Gavel News shared new!`); break;

        case "copy": navigator.clipboard.writeText(modalLastClickedNew.toShareLink); break;

        default: return
    }

}

async function getNewById(newId, date){
    const response = await fetch(`${api}/news/${date}/getNew/${newId}`, {
        method: 'GET',
        headers: headerWithToken // maybe its not necessary
      });
      const newData = await response.json();

      if (response.ok) {
        
        window.history.replaceState("", "", `${api}/`);
        loadBtn.classList.add('hidden');
        await setContent([newData])
        
      } else if (response.status === 403) {
        // If the error is 403, clear the body and show an error message
        blockedUser()
      
    } else {
        // For other errors, show an error message
        showErrorMessage(news.msg);
      }
}

checkUrlForNewId()