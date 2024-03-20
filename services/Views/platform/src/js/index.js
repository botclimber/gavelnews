

const news_div = document.getElementById("news")

loadDataFromServer = async () => {
    const response = await fetch("http://localhost:3000/");
    const news = await response.json();
    console.log(news);

    news.data.map(r => {

        news_div.innerHTML += /* html */
        `<div class="mb-6 lg:mb-0">
        <div>
          <div class="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20"
            data-te-ripple-init data-te-ripple-color="light">
            <img src="${r.new_img}" class="w-full" alt="Louvre" />
            <a href="${r.new_link}">
              <div
                class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,.15)]">
              </div>
            </a>
          </div>

          <h5 class="mb-3 text-lg font-bold">${r.new_title}</h5>
          <div class="mb-3 flex items-center justify-center text-sm font-medium text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="mr-2 h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            ${r.new_type}
          </div>
          <p class="mb-6 text-neutral-500 dark:text-neutral-300">
            <small>Published <u>${r.new_date}</u> by
              <a href="#!">SOURCE</a></small>
          </p>
          <p class="text-neutral-500 dark:text-neutral-300">
            ${r.new_desc}
          </p>
        </div>
      </div>`
    })
}

loadDataFromServer()