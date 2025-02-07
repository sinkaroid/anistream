function render(elementId, endpoint, imageType = "@405w_645h_1e_1c_90q.webp") {
  const animeListContainer = document.querySelector(`#${elementId}`);
  let loaderElement;

  function showLoader() {
    loaderElement = document.createElement("div");
    loaderElement.className = "col mx-auto text-center";
    loaderElement.innerHTML = `
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      `;
    animeListContainer.appendChild(loaderElement);
  }

  function hideLoader() {
    if (loaderElement) {
      loaderElement.remove();
    }
  }

  function showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "col mx-auto text-center";
    errorElement.innerHTML = `
        <button type="button" class="btn btn-primary btn-reload">
          <i class="fas fa-redo"></i> ${message}
        </button>
      `;
    animeListContainer.appendChild(errorElement);

    const reloadButton = errorElement.querySelector(".btn-reload");
    reloadButton.addEventListener("click", () => {
      animeListContainer.innerHTML = "";
      showLoader();
      fetchAnimeList();
    });
  }

  function fetchAnimeList() {
    fetch(`${BACKEND_URL}/${endpoint}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        hideLoader();

        const animeList = data.list.map((item) => {
          const animeItem = document.createElement("div");
          animeItem.className = "col";

          const animeLink = document.createElement("a");
          animeLink.href = `/details.html?id=${item.season_id}`;
          animeLink.className = "card h-100 d-flex";

          const animeImageContainer = document.createElement("div");
          animeImageContainer.className = "position-relative";

          const animeImage = document.createElement("img");
          animeImage.src = `${BACKEND_URL}/image/${item.cover}${imageType}`;
          animeImage.className = "card-img-top";
          animeImage.alt = item.title;
          animeImage.title = item.title;
          animeImage.loading = "lazy";
          animeImage.onerror = () => {
            animeImage.src = `${BACKEND_URL}/image/${item.cover}@405w_645h_1e_1c_90q.webp`;
          };
          animeImage.style.cssText =
            "height: 100%; width: 100%; object-fit: cover; transition: opacity 0.2s ease-in-out;";

          const animeBadgeContainer = document.createElement("div");
          animeBadgeContainer.className = "position-absolute top-0 end-0 m-0";

          const animeBadge = document.createElement("div");
          animeBadge.className = "badge rounded-pill bg-primary";
          animeBadge.style.transform = "scale(0.8)";
          animeBadge.innerText = item.index_show ?? item.subtitle;

          const animeTextBox = document.createElement("div");
          animeTextBox.className = "text-box";

          const animeTitle = document.createElement("p");
          animeTitle.className = "title";
          animeTitle.title = item.title;
          animeTitle.innerText = item.title;
          animeListContainer.appendChild(animeItem);
          animeItem.appendChild(animeLink);
          animeLink.appendChild(animeImageContainer);
          animeImageContainer.appendChild(animeImage);
          animeImageContainer.appendChild(animeBadgeContainer);
          animeBadgeContainer.appendChild(animeBadge);
          animeLink.appendChild(animeTextBox);
          animeTextBox.appendChild(animeTitle);

          return animeItem;
        });

        animeListContainer.innerHTML = "";
        animeListContainer.append(...animeList);
      })
      .catch(function (error) {
        console.error(`Failed to fetch anime list from ${endpoint}`, error);
        hideLoader();
        showError(`Click to reload.`);
      });
  }

  showLoader();
  fetchAnimeList();
}
