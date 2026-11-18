
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("dreamclub-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const darkMode = document.body.classList.contains("dark");
    themeToggle.textContent = darkMode ? "☀" : "☾";
    localStorage.setItem("dreamclub-theme", darkMode ? "dark" : "light");
});




const filterButtons = document.querySelectorAll(".filter");
const originalPosters = document.querySelectorAll("#favorites .poster");
const favoriteGroups = document.querySelectorAll("#favorites .favorite-group");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;
        filterButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        originalPosters.forEach(poster => {
            const matches = category === "all" || poster.dataset.category === category;
            poster.classList.toggle("hidden", !matches);
        });

        favoriteGroups.forEach(group => {
            const visible = group.querySelectorAll(".poster:not(.hidden)");
            group.style.display = visible.length > 0 ? "" : "none";
        });
    });
});


const savedFavoritesContainer = document.getElementById("savedFavorites");
const favoritesCount = document.getElementById("favoritesCount");
const clearFavoritesButton = document.getElementById("clearFavorites");

let savedFavorites = [];

try {
    savedFavorites = JSON.parse(localStorage.getItem("dreamclub-favorites") || "[]");
    if (!Array.isArray(savedFavorites)) savedFavorites = [];
} catch (error) {
    savedFavorites = [];
}

originalPosters.forEach(poster => {
    const button = document.createElement("button");
    button.className = "favorite-toggle";
    button.type = "button";
    button.textContent = "♡ FAVORITAR";
    poster.appendChild(button);
});

function renderSavedFavorites() {
    savedFavoritesContainer.innerHTML = "";
    favoritesCount.textContent = savedFavorites.length;

    if (savedFavorites.length === 0) {
        savedFavoritesContainer.innerHTML = `
            <p class="empty-favorites">
                ♡ Sua coleção ainda está vazia!<br>
                Explore os cards acima e clique em "Favoritar".
            </p>`;
        return;
    }

    savedFavorites.forEach(imagePath => {
        const originalCard = Array.from(originalPosters).find(poster =>
            poster.querySelector("img").getAttribute("src") === imagePath
        );

        if (originalCard) {
            const copy = originalCard.cloneNode(true);
            copy.classList.remove("hidden");
            savedFavoritesContainer.appendChild(copy);
        }
    });
}

function updateFavorites() {
    originalPosters.forEach(poster => {
        const imagePath = poster.querySelector("img").getAttribute("src");
        const button = poster.querySelector(".favorite-toggle");
        const isSaved = savedFavorites.includes(imagePath);
        button.textContent = isSaved ? "♥ SALVO" : "♡ FAVORITAR";
        button.classList.toggle("is-saved", isSaved);
    });

    renderSavedFavorites();
    localStorage.setItem("dreamclub-favorites", JSON.stringify(savedFavorites));
}

document.addEventListener("click", event => {
    const button = event.target.closest(".favorite-toggle");
    if (!button) return;

    const poster = button.closest(".poster");
    if (!poster || !poster.querySelector("img")) return;

    const imagePath = poster.querySelector("img").getAttribute("src");

    if (savedFavorites.includes(imagePath)) {
        savedFavorites = savedFavorites.filter(item => item !== imagePath);
    } else {
        savedFavorites.push(imagePath);
    }

    updateFavorites();
});

clearFavoritesButton.addEventListener("click", () => {
    if (savedFavorites.length === 0) return;

    if (confirm("Tem certeza que deseja limpar todos os seus favoritos?")) {
        savedFavorites = [];
        updateFavorites();
    }
});

updateFavorites();


const thoughts = [
    "Às vezes, tudo que a gente precisa é de uma música boa e um novo episódio.",
    "Meu tipo favorito de descoberta é encontrar uma música que vira obsessão.",
    "Um dia ainda vou organizar todas as minhas referências em pastinhas perfeitas.",
    "DREAMCLUB: meu cantinho cor-de-rosa na internet. ♡",
    "Só mais uma partida... ou mais um episódio. Talvez os dois.",
    "A vida fica melhor com uma trilha sonora de K-pop.",
    "Entre códigos, animes e música, sempre existe alguma coisa nova para descobrir."
];

document.getElementById("randomButton").addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * thoughts.length);
    document.getElementById("randomText").textContent = thoughts[randomIndex];
});


const liveClock = document.getElementById("liveClock");
const clockDate = document.getElementById("clockDate");

function updateClock() {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString("pt-BR", { hour12: false });
    clockDate.textContent = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);


const calendarMonth = document.getElementById("calendarMonth");
const calendarDays = document.getElementById("calendarDays");
const calendarNote = document.getElementById("calendarNote");
const today = new Date();

let displayedMonth = today.getMonth();
let displayedYear = today.getFullYear();

function renderCalendar() {
    const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

    const monthName = new Date(displayedYear, displayedMonth).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    calendarMonth.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("span");
        empty.className = "calendar-day empty";
        calendarDays.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.className = "calendar-day";
        dayElement.textContent = day;

        if (
            day === today.getDate() &&
            displayedMonth === today.getMonth() &&
            displayedYear === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        calendarDays.appendChild(dayElement);
    }

    calendarNote.textContent =
        displayedMonth === today.getMonth() && displayedYear === today.getFullYear()
            ? "✿ Hoje é um ótimo dia para novas ideias!"
            : "♡ Explore este mês no seu Dreamclub!";
}

document.getElementById("prevMonth").addEventListener("click", () => {
    displayedMonth--;
    if (displayedMonth < 0) {
        displayedMonth = 11;
        displayedYear--;
    }
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    displayedMonth++;
    if (displayedMonth > 11) {
        displayedMonth = 0;
        displayedYear++;
    }
    renderCalendar();
});

renderCalendar();


const statusSelect = document.getElementById("statusSelect");
const statusEmoji = document.getElementById("statusEmoji");
const statusText = document.getElementById("statusText");

function updateStatus(value) {
    const [emoji, text] = value.split("|");
    statusEmoji.textContent = emoji;
    statusText.textContent = text;
    statusSelect.value = value;
    localStorage.setItem("dreamclub-status", value);
}

const savedStatus = localStorage.getItem("dreamclub-status");
const validStatus = Array.from(statusSelect.options).some(option => option.value === savedStatus);

updateStatus(validStatus ? savedStatus : statusSelect.value);

statusSelect.addEventListener("change", () => updateStatus(statusSelect.value));


const dailyMessages = [
    "A little magic happens every day. ♡",
    "Your dreams deserve a little space to grow.",
    "Make today a beautiful memory.",
    "You are creating your own little universe.",
    "Every new day is another page of your story.",
    "Keep collecting moments, music and memories.",
    "There is beauty in the little things.",
    "Your imagination is your favorite destination.",
    "Let yourself bloom at your own pace.",
    "A new day, a new playlist, a new possibility."
];

function updateDailyMessage() {
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    let hash = 0;

    for (let i = 0; i < dateKey.length; i++) {
        hash = ((hash << 5) - hash + dateKey.charCodeAt(i)) | 0;
    }

    document.getElementById("dailyMessage").textContent =
        dailyMessages[Math.abs(hash) % dailyMessages.length];

    document.getElementById("dailyDate").textContent =
        now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" }).toUpperCase() + " ♡";
}

updateDailyMessage();


const linkForm = document.getElementById("linkForm");
const linksGrid = document.getElementById("linksGrid");

const defaultLinks = [
    {
        name: "Pinterest",
        url: "https://www.pinterest.com/",
        description: "Inspirações, referências e moodboards."
    },
    {
        name: "GitHub",
        url: "https://github.com/",
        description: "Projetos, códigos e ideias de programação."
    },
    {
        name: "Spotify",
        url: "https://open.spotify.com/",
        description: "Minhas playlists e descobertas musicais."
    }
];

let favoriteLinks = [];

try {
    const storedLinks = JSON.parse(localStorage.getItem("dreamclub-links") || "null");
    favoriteLinks = Array.isArray(storedLinks) ? storedLinks : defaultLinks;
} catch (error) {
    favoriteLinks = defaultLinks;
}

function saveLinks() {
    localStorage.setItem("dreamclub-links", JSON.stringify(favoriteLinks));
}

function renderLinks() {
    linksGrid.innerHTML = "";

    if (favoriteLinks.length === 0) {
        linksGrid.innerHTML = '<p class="empty-links">♡ Nenhum link por aqui ainda. Adicione seu primeiro favorito!</p>';
        return;
    }

    favoriteLinks.forEach((link, index) => {
        const card = document.createElement("article");
        card.className = "link-card";

        const title = document.createElement("h4");
        title.textContent = link.name;

        const description = document.createElement("p");
        description.textContent = link.description || "Um link especial do meu cantinho.";

        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = "VISIT WEBSITE ↗";

        const remove = document.createElement("button");
        remove.className = "remove-link";
        remove.type = "button";
        remove.setAttribute("aria-label", `Remover ${link.name}`);
        remove.textContent = "×";
        remove.addEventListener("click", () => {
            favoriteLinks.splice(index, 1);
            saveLinks();
            renderLinks();
        });

        card.append(remove, title, description, anchor);
        linksGrid.appendChild(card);
    });
}

linkForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("linkName").value.trim();
    const rawUrl = document.getElementById("linkUrl").value.trim();
    const description = document.getElementById("linkDescription").value.trim();

    try {
        const parsedUrl = new URL(rawUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("URL inválida");
        }

        favoriteLinks.push({
            name,
            url: parsedUrl.href,
            description
        });

        saveLinks();
        renderLinks();
        linkForm.reset();
    } catch (error) {
        alert("Digite um endereço válido começando com https://");
    }
});

renderLinks();


const quizzes = {
    vibe: {
        title: "Qual é a sua vibe?",
        questions: [
            {
                question: "Escolha seu rolê perfeito:",
                answers: [
                    { text: "Uma tarde ouvindo música e criando playlists.", type: "dreamer" },
                    { text: "Uma maratona de jogos com amigos.", type: "player" },
                    { text: "Cobertor, snacks e vários episódios.", type: "cozy" }
                ]
            },
            {
                question: "Qual estética combina com seu cantinho?",
                answers: [
                    { text: "Rosa, brilho, colagens e nostalgia Y2K.", type: "dreamer" },
                    { text: "Neon, tecnologia e referências gamer.", type: "player" },
                    { text: "Pastéis, livros e uma atmosfera tranquila.", type: "cozy" }
                ]
            },
            {
                question: "Escolha um item indispensável:",
                answers: [
                    { text: "Fones de ouvido.", type: "dreamer" },
                    { text: "Meu setup.", type: "player" },
                    { text: "Uma bebida quentinha.", type: "cozy" }
                ]
            }
        ],
        results: {
            dreamer: ["THE DREAMER ✧", "Você transforma músicas, ideias e referências em um universo só seu."],
            player: ["THE PLAYER ☆", "Você gosta de desafios, diversão e de explorar novos mundos."],
            cozy: ["THE COZY SOUL ♡", "Você encontra felicidade nos pequenos momentos e nos seus cantinhos favoritos."]
        }
    },
    fandom: {
        title: "Que tipo de fã você é?",
        questions: [
            {
                question: "Quando encontra um grupo novo, você:",
                answers: [
                    { text: "Vai ouvir a discografia inteira.", type: "music" },
                    { text: "Procura performances, edits e fancams.", type: "visual" },
                    { text: "Decora nomes, histórias e curiosidades.", type: "lore" }
                ]
            },
            {
                question: "Seu conteúdo favorito é:",
                answers: [
                    { text: "Álbuns, músicas e playlists.", type: "music" },
                    { text: "Fotos, conceitos e videoclipes.", type: "visual" },
                    { text: "Teorias, personagens e universos.", type: "lore" }
                ]
            },
            {
                question: "Seu jeito de demonstrar carinho pelo fandom:",
                answers: [
                    { text: "Escutar e recomendar músicas.", type: "music" },
                    { text: "Salvar imagens e montar pastinhas.", type: "visual" },
                    { text: "Conversar sobre detalhes e teorias.", type: "lore" }
                ]
            }
        ],
        results: {
            music: ["THE MUSIC LOVER ♫", "Você vive pela trilha sonora e sempre tem uma recomendação na ponta da língua."],
            visual: ["THE CONCEPT COLLECTOR ✿", "Você ama conceitos, visuais, fotografias e toda a estética dos seus fandoms."],
            lore: ["THE LORE KEEPER ✧", "Você mergulha nos detalhes, histórias e curiosidades de cada universo."]
        }
    }
};

let currentQuiz = "vibe";
let currentQuestion = 0;
let selectedType = null;
let quizScores = {};
let quizHistory = [];

const quizTitle = document.getElementById("quizTitle");
const quizProgress = document.getElementById("quizProgress");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizNext = document.getElementById("quizNext");
const quizRestart = document.getElementById("quizRestart");
const quizResult = document.getElementById("quizResult");
const quizHistoryElement = document.getElementById("quizHistory");

try {
    quizHistory = JSON.parse(localStorage.getItem("dreamclub-quiz-history") || "[]");
    if (!Array.isArray(quizHistory)) quizHistory = [];
} catch (error) {
    quizHistory = [];
}

function renderQuizHistory() {
    quizHistoryElement.textContent = quizHistory.length
        ? quizHistory.slice(-5).reverse().join(" • ")
        : "Você ainda não terminou nenhum quiz.";
}

function loadQuizQuestion() {
    const quiz = quizzes[currentQuiz];
    const question = quiz.questions[currentQuestion];

    quizTitle.textContent = quiz.title;
    quizProgress.textContent = `Pergunta ${currentQuestion + 1} de ${quiz.questions.length}`;
    quizQuestion.textContent = question.question;
    quizAnswers.innerHTML = "";
    quizResult.classList.remove("show");
    quizResult.innerHTML = "";
    quizNext.disabled = true;
    selectedType = null;

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-answer";
        button.textContent = answer.text;

        button.addEventListener("click", () => {
            document.querySelectorAll(".quiz-answer").forEach(item => item.classList.remove("selected"));
            button.classList.add("selected");
            selectedType = answer.type;
            quizNext.disabled = false;
        });

        quizAnswers.appendChild(button);
    });

    quizNext.textContent = currentQuestion === quiz.questions.length - 1
        ? "VER RESULTADO ★"
        : "CONTINUAR →";
}

function finishQuiz() {
    const quiz = quizzes[currentQuiz];
    const winner = Object.keys(quizScores).sort((a, b) => quizScores[b] - quizScores[a])[0];
    const [resultTitle, resultDescription] = quiz.results[winner];

    quizQuestion.textContent = "Quiz concluído! ♡";
    quizAnswers.innerHTML = "";
    quizProgress.textContent = "YOUR RESULT";
    quizNext.disabled = true;
    quizNext.style.display = "none";

    quizResult.innerHTML = `<h4>${resultTitle}</h4><p>${resultDescription}</p>`;
    quizResult.classList.add("show");

    const historyItem = `${quiz.title}: ${resultTitle}`;
    quizHistory.push(historyItem);
    localStorage.setItem("dreamclub-quiz-history", JSON.stringify(quizHistory));
    renderQuizHistory();
}

quizNext.addEventListener("click", () => {
    if (!selectedType) return;

    quizScores[selectedType] = (quizScores[selectedType] || 0) + 1;

    if (currentQuestion < quizzes[currentQuiz].questions.length - 1) {
        currentQuestion++;
        loadQuizQuestion();
    } else {
        finishQuiz();
    }
});

function restartQuiz() {
    currentQuestion = 0;
    selectedType = null;
    quizScores = {};
    quizNext.style.display = "inline-block";
    loadQuizQuestion();
}

quizRestart.addEventListener("click", restartQuiz);

document.querySelectorAll(".quiz-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".quiz-tab").forEach(item => item.classList.remove("active"));
        tab.classList.add("active");
        currentQuiz = tab.dataset.quiz;
        restartQuiz();
    });
});

renderQuizHistory();
loadQuizQuestion();


console.log("★ DREAMCLUB carregado com sucesso! ♡");
console.log("Welcome to my little internet world!");
