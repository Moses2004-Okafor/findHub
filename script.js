let inputUsername = document.querySelector("#userName");
let button = document.querySelector("#button");
let repositories = document.querySelector("#repositories");
let profileresult = document.querySelector(".profile-result");
let backToTopButton = document.getElementById("backToTop");
button.addEventListener("click", function () {
  let username = inputUsername.value;
  if ((inputUsername = "")) {
    profileresult.textContent = "Please enter a Github Username";
    return;
  }
  profileresult.textContent = "Loading...";
  fetch(`https://api.github.com/users/${username}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    })
    .then(function (data) {
      profileresult.innerHTML = `
<img src ="${data.avatar_url}" alt="${data.login}">
<h2>${data.name || data.login}</h2>
<p>@${data.login}</p>
<p>${data.bio || "No bio available."}</p>
<div>
<span>Followers: ${data.followers}</span>
<span>Following: ${data.following}</span>
<span>Repositories: ${data.public_repos}</span>
</div>
<a href="${data.html_url}"
target="_blank">
View Github Profile </a>
`;
      profileresult.style.display = "block";
      fetch(`https://api.github.com/users/${username}/repos`)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Could not load repositories");
          }
          return response.json();
        })
        .then(function (repos) {
          if (repos.length === 0) {
            repositories.textContent = "No public repositories found.";
            return;
          }
          repositories.innerHTML = "<h3>Public Repositories</h3>";
          repos.forEach(function (repo) {
            const repoCard = document.createElement("div");
            repoCard.classList.add("repository-card");
            const repoLink = document.createElement("a");
            repoLink.href = repo.html_url;
            repoLink.textContent = repo.name;
            repoLink.target = "_blank";
            repoLink.rel = "noopener noreferrer";

            const repoDescription = document.createElement("p");
            repoDescription.textContent =
              repo.description || "No description available.";

            const repoLanguage = document.createElement("p");
            repoLanguage.textContent =
              "Language: " + (repo.language || "Not specified");

            const repoStars = document.createElement("p");
            repoStars.textContent = "Stars: " + repo.stargazers_count;

            const repoForks = document.createElement("p");
            repoForks.textContent = "Forks: " + repo.forks_count;

            repoCard.appendChild(repoLink);
            repoCard.appendChild(repoDescription);
            repoCard.appendChild(repoLanguage);
            repoCard.appendChild(repoStars);
            repoCard.appendChild(repoForks);

            repositories.appendChild(repoCard);
          });
        })
        .catch(function (error) {
          repositories.textContent = "Could not load repositories";
        });
    })
    .catch(function (error) {
      profileresult.textContent = error.message;
    });
});
window.addEventListener("scroll", function () {
  if (window.scrollY > 250) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});
backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
