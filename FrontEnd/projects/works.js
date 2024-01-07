// URL

const urlWorks = "http://localhost:5678/api/works";
const urlCategory = "http://localhost:5678/api/categories";

// FICHIER JSON

const fetchData = (url, callback) => {
  return fetch(url)
    .then((r) => r.json())
    .then((data) => callback(data));
};

// AFFICHAGE WORKS

const showWorks = (data) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  data.forEach((item) => {
    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure");
    const imgElement = document.createElement("img");
    imgElement.src = item.imageUrl;
    const figElement = document.createElement("figcaption");
    figElement.innerText = item.title;

    gallery.appendChild(figureElement);
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figElement);
  });
};
fetchData(urlWorks, showWorks);

// AFFICHAGE CATEGORY

const showCategory = (data) => {
  const categories = document.querySelector(".category");
  const listeCategories = document.querySelector(".liste-category");
  listeCategories.innerHTML = "";
  const btnAll = document.createElement("li");
  btnAll.classList.add("btnSelectionne", "btn");
  btnAll.setAttribute("id", 0);
  btnAll.innerText = "Tous";
  listeCategories.appendChild(btnAll);
  clicCategory(data);
  categories.appendChild(listeCategories);
  clicCouleur();
};

fetchData(urlCategory, showCategory);

// CHANGEMENT DE COULEUR AU CLIC DES FILTRES

const clicCouleur = () => {
  const listeFiltres = document.querySelectorAll(".category li");
  listeFiltres.forEach((element) => {
    element.addEventListener("click", () => {
      listeFiltres.forEach((element) => {
        element.classList.remove("btnSelectionne");
      });
      element.classList.add("btnSelectionne");
    });
  });
};

// FILTRE DE PROJETS

const clicCategory = (data) => {
  const listeCategories = document.querySelector(".liste-category");
  data.forEach((element) => {
    const btnCategories = document.createElement("li");
    btnCategories.setAttribute("id", element.id);
    btnCategories.classList.add("btn");
    btnCategories.innerText = element.name;
    listeCategories.appendChild(btnCategories);
  });
};

const filtreCategories = (btnFiltre) => {
  fetch(urlWorks)
    .then((r) => r.json())
    .then((data) => {
      const dataFiltres = data.filter(
        (element) => element.category.id == btnFiltre
      );

      btnFiltre !== "0" ? showWorks(dataFiltres) : showWorks(data);
    });
};

fetchData(urlWorks, showWorks);

fetchData(urlCategory, showCategory).then(() => {
  const listeFiltres = document.querySelectorAll(".category li");
  listeFiltres.forEach((element) => {
    element.addEventListener("click", (e) => {
      filtreCategories(element.id);
    });
  });
});

// AFFICHER / FERMER LA MODALE

const overlayModalContent = document.querySelector(".overlay-modal-content");
const modalGallery = document.querySelector(".modal-gallery");
const modalPhoto = document.querySelector("#modal-photo");
const modalContent = document.querySelector("#modal-content");

// OUVERTURE MODALE SUR BOUTON MODIFIER

const btnModifier = document.querySelector("#btn-modifier");

btnModifier.addEventListener("click", (e) => {
  e.preventDefault();
  overlayModalContent.style.display = "flex";
  modalContent.style.display = "flex";
  fetchData(urlWorks, showProjectModalGallery);
});

// FERMETURE MODAL CONTENT SUR LA CROIX

document.querySelector("#modal-close").addEventListener("click", (e) => {
  e.preventDefault();
  overlayModalContent.style.display = "none";
  modalContent.style.display = "none";
});

// FERMETURE MODALE AU CLIC SUR LE COTE

window.onclick = (event) => {
  if (event.target == overlayModalContent) {
    overlayModalContent.style.display = "none";
    modalPhoto.style.display = "none";
    modalContent.style.display = "none";
    resetForm();
  }
};

// OUVERTURE MODAL PHOTO

document.querySelector("#new-photo").addEventListener("click", (e) => {
  e.preventDefault();
  modalPhoto.style.display = "flex";
  modalContent.style.display = "none";
  fetchData(urlCategory, showCategoriesModal);
});

// FERMETURE MODALE PHOTO SUR LA CROIX

document.querySelector("#modal-photo-close").addEventListener("click", (e) => {
  e.preventDefault();
  modalPhoto.style.display = "none";
  modalContent.style.display = "none";
  overlayModalContent.style.display = "none";
  resetForm();
});

// FLECHE RETOUR POUR REVENIR SUR MODAL CONTENT

document.querySelector("#modal-return").addEventListener("click", (e) => {
  e.preventDefault();
  modalPhoto.style.display = "none";
  modalContent.style.display = "flex";
  overlayModalContent.style.display = "flex";
  fetchData(urlWorks, showProjectModalGallery);
  resetForm();
});

// FONCTION AFFICHER LES PROJETS

const showProjectModalGallery = (data) => {
  modalGallery.innerHTML = "";
  for (const project of data) {
    const figure = document.createElement("figure");
    figure.classList.add("modal-gallery-modifier");
    figure.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <i class="fa-solid fa-trash-can"></i>
        `;
    modalGallery.appendChild(figure);

    const deleteIcon = figure.querySelector(".fa-trash-can");
    deleteIcon.addEventListener("click", (e) => {
      e.preventDefault();
      deleteWork(project.id, project.title);
    });
  }
};

// FONCTION AFFICHER LES CATEGORIES

const categorySelect = document.querySelector("#modal-photo-category");
const showCategoriesModal = (data) => {
  categorySelect.innerHTML = "";
  categorySelect.innerHTML = `
    <option value="" hidden></option>
    `;
  for (const category of data) {
    const option = document.createElement("option");
    option.setAttribute("id", category.id);
    option.innerHTML = `
        ${category.name}
        `;
    categorySelect.appendChild(option);
  }
};

// AJOUTER PROJETS

const btnNewPhoto = document.querySelector("#image");
const photoBox = document.querySelector("#form-photo");
const allContentPhotoBox = photoBox.querySelectorAll(".display-none");

btnNewPhoto.addEventListener("change", (e) => {
  e.preventDefault();
  const objectURL = URL.createObjectURL(btnNewPhoto.files[0]);
  allContentPhotoBox.forEach((content) => {
    content.style.display = "none";
  });
  const ajoutImage = document.createElement("img");
  ajoutImage.setAttribute("src", objectURL);
  ajoutImage.setAttribute("alt", btnNewPhoto.files[0].name);
  photoBox.appendChild(ajoutImage);
  checkForm();
});

// VERIFICATION FORMULAIRE COMPLET

const modalPhotoTitle = document.querySelector("#modal-photo-title");
const btnFormValider = document.querySelector(".modal-valider");
function checkForm() {
  if (
    modalPhotoTitle.value !== "" &&
    btnNewPhoto.files[0] !== undefined &&
    categorySelect.value !== ""
  ) {
    btnFormValider.classList.add("form-btn-valider");
    const btnFormValiderCheck = document.querySelector(".form-btn-valider");
    btnFormValiderCheck.addEventListener("click", sendWork);
  }
}

// RESET FORMULAIRE

function resetForm() {
  document.querySelector("#modal-photo-title").value = "";

  allContentPhotoBox.forEach((content) => {
    content.style.display = "block";
    if (document.querySelector("#form-photo img")) {
      document.querySelector("#form-photo img").remove();
      btnFormValider.classList.remove("form-btn-valider");
    }
  });
}

let categorySelectId = "";
categorySelect.addEventListener("change", () => {
  categorySelectId = categorySelect.selectedIndex;
  checkForm();
});

modalPhotoTitle.addEventListener("change", () => {
  checkForm();
});

// AJOUTER DES PROJETS

const msgSuccesErrorSlot = document.querySelector(
  ".msg-add-photo-success-error"
);
const msgBadSizeFormatImg = document.querySelector(".msg-bad-size-format-img");

// FONCTION VERIFICATION TAILLE ET FORMAT IMAGE

const imageInput = document.querySelector("#image");
imageInput.addEventListener("change", function checkImg() {
  const selectedImage = imageInput.files[0];

  if (selectedImage) {
    if (selectedImage.size > 4 * 1024 * 1024) {
      resetForm();
      msgBadSize();
      return;
    }

    const allowedFormats = ["image/jpeg", "image/png"];
    if (!allowedFormats.includes(selectedImage.type)) {
      resetForm();
      msgBadFormat();
      return;
    }
  }
});

// FONCTION AJOUT DE PROJETS

const token = sessionStorage.getItem("Token");

const sendWork = async (event) => {
  event.preventDefault();
  const image = document.querySelector("#image").files[0];
  const title = document.querySelector("#modal-photo-title").value;

  let formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", categorySelectId);

  const response = await fetch(urlWorks, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.ok) {
    msgAddSuccessF();
    resetForm();
    fetchData(urlWorks, showWorks);
  } else {
    msgAddErrorF();
  }
};

// SUPPRIMER PROJETS

function deleteWork(projectId, projectTitle) {
  const deleteConfirm = window.confirm(
    `Êtes-vous sûr de vouloir supprimer le projet : ${projectTitle} ?`
  );
  if (deleteConfirm) {
    const fetchDelete = fetch(`${urlWorks}/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    fetchDelete.then((response) => {
      if (response.ok) {
        fetchData(urlWorks, showWorks);
        msgDeleteOkF();
        fetchData(urlWorks, showProjectModalGallery);
      } else {
        // MESSAGE DE SUPPRESSION OK
      }
    });
  }
}

const msgDeleteOkSlot = document.querySelector(".msg-delete-ok");
const msgDeleteOk = "Le projet a bien été supprimé.";

function msgDeleteOkF() {
  msgDeleteOkSlot.textContent = msgDeleteOk;

  setTimeout(() => {
    msgDeleteOkSlot.textContent = "";
  }, 3000);
}

// ON VERIFIE SI ON EST CONNECTER POUR AFFICHER LOGIN OU LOGOUT

document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector(".login");
  const logoutLink = document.querySelector(".logout");
  const categories = document.querySelector(".category");
  const logoModifier = document.querySelector(".logo-modifier");
  const editionMod = document.querySelector("#logged");

  const isConnected = sessionStorage.getItem("isConnected");

  if (isConnected === "true") {
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
    categories.style.display = "none";
    logoModifier.style.display = "block";
    editionMod.style.display = "flex";
  } else {
    loginLink.style.display = "block";
    logoutLink.style.display = "none";
    logoModifier.style.display = "none";
  }
  // EVENT AU CLIC SUR LOGOUT POUR SE DECONNECTER
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("isConnected");
    window.location.replace("index.html");
  });
});
