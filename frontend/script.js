/* =========================================================
   GO TRIP - FRONTEND SCRIPT
   Java Spring Boot + MySQL Integration Ready
   ========================================================= */


/* ================= BASIC HELPERS ================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector)
];

const API_URL = "http://localhost:8080/api/tours";

const toast = $("#toast");


function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = $(".menu-btn");
const mobileMenu = $(".mobile-menu");

if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

        const open = mobileMenu.classList.toggle("open");

        menuBtn.setAttribute(
            "aria-expanded",
            String(open)
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            String(!open)
        );

        menuBtn.textContent = open ? "×" : "☰";
    });


    $$(".mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.textContent = "☰";
        });

    });

}


/* =========================================================
   DATE VALIDATION
   ========================================================= */

const dateInput = $("#travelDate");

const today = new Date();

today.setHours(
    0,
    0,
    0,
    0
);


function toDateInputValue(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


if (dateInput) {

    dateInput.min =
        toDateInputValue(today);

}


/* =========================================================
   TOUR DOM REFERENCES
   ========================================================= */

const searchForm = $("#searchForm");
const destinationInput = $("#destination");
const tourGrid = $("#tourGrid");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const clearSearch = $("#clearSearch");
const showAll = $("#showAll");
const sortTours = $("#sortTours");


/*
   IMPORTANT:

   tourCards ko const ke through ek baar store nahi kar rahe.

   Kyunki backend se naye cards dynamically create honge.
*/

function getTourCards() {

    return $$(".tour-card");
}


/* =========================================================
   TOUR DATA - FALLBACK
   =========================================================

   Agar Spring Boot backend abhi start nahi hai,
   to frontend ke existing HTML cards use honge.

   Backend banne ke baad ye data MySQL se aayega.
   ========================================================= */

const fallbackTourData = {

    /* =====================================================
       1. JAIPUR
       ===================================================== */

    "Royal Jaipur Escape": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hawa_Mahal_in_Jaipur%2C_Rajasthan.jpg?width=1200",

        location:
            "Jaipur, Rajasthan",

        duration:
            "5 Days / 4 Nights",

        price:
            "₹25,999",

        rating:
            "4.9",

        highlights:
            "Amber Fort • City Palace • Hawa Mahal • Local Market"
    },


    /* =====================================================
       2. GOA
       ===================================================== */

    "Goa Beach Getaway": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Goa-sea-beach.jpg?width=1200",

        location:
            "Goa, India",

        duration:
            "4 Days / 3 Nights",

        price:
            "₹16,999",

        rating:
            "4.8",

        highlights:
            "Beach Time • Sunset • Local Cafés • North Goa"
    },


    /* =====================================================
       3. MANALI
       ===================================================== */

    "Manali Mountain Escape": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Beas_River_in_Manali.jpg?width=1200",

        location:
            "Manali, Himachal Pradesh",

        duration:
            "6 Days / 5 Nights",

        price:
            "₹18,999",

        rating:
            "4.9",

        highlights:
            "Mountain Views • Beas River • Valleys • Nature"
    },


    /* =====================================================
       4. KERALA
       ===================================================== */

    "Kerala Backwater Escape": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kerala_backwaters_houseboat.jpg?width=1200",

        location:
            "Kerala, India",

        duration:
            "6 Days / 5 Nights",

        price:
            "₹22,999",

        rating:
            "4.9",

        highlights:
            "Backwaters • Houseboat • Munnar • Alleppey"
    },


    /* =====================================================
       5. KASHMIR
       ===================================================== */

    "Magical Kashmir Journey": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/DalLake.jpeg?width=1200",

        location:
            "Srinagar, Kashmir",

        duration:
            "7 Days / 6 Nights",

        price:
            "₹29,999",

        rating:
            "4.9",

        highlights:
            "Dal Lake • Shikara Ride • Valleys • Scenic Views"
    },


    /* =====================================================
       6. VARANASI
       ===================================================== */

    "Spiritual Varanasi": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Varanasi_ganga.jpg?width=1200",

        location:
            "Varanasi, Uttar Pradesh",

        duration:
            "3 Days / 2 Nights",

        price:
            "₹12,999",

        rating:
            "4.7",

        highlights:
            "Ganga Ghats • Heritage • Local Culture • Spiritual Experience"
    },


    /* =====================================================
       7. UDAIPUR
       ===================================================== */

    "Udaipur Royal Retreat": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_Palace%2CUdaipur.jpg?width=1200",

        location:
            "Udaipur, Rajasthan",

        duration:
            "4 Days / 3 Nights",

        price:
            "₹19,999",

        rating:
            "4.8",

        highlights:
            "Lake Palace • Lake Pichola • City Palace • Royal Heritage"
    },


    /* =====================================================
       8. RISHIKESH
       ===================================================== */

    "Rishikesh Adventure": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lakshman_Jhula_Rishikesh.jpg?width=1200",

        location:
            "Rishikesh, Uttarakhand",

        duration:
            "4 Days / 3 Nights",

        price:
            "₹14,999",

        rating:
            "4.8",

        highlights:
            "Lakshman Jhula • Ganga • River Rafting • Yoga"
    },


    /* =====================================================
       9. LADAKH
       ===================================================== */

    "Ladakh Expedition": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pangong_lake_in_Ladakh.jpg?width=1200",

        location:
            "Leh-Ladakh, India",

        duration:
            "7 Days / 6 Nights",

        price:
            "₹32,999",

        rating:
            "4.9",

        highlights:
            "Pangong Lake • Leh • Nubra Valley • Mountain Passes"
    },


    /* =====================================================
       10. DARJEELING
       ===================================================== */

    "Darjeeling Tea Escape": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tea_gardens_of_Darjeeling.jpg?width=1200",

        location:
            "Darjeeling, West Bengal",

        duration:
            "5 Days / 4 Nights",

        price:
            "₹17,999",

        rating:
            "4.7",

        highlights:
            "Tea Gardens • Kanchenjunga • Tiger Hill • Toy Train"
    },


    /* =====================================================
       11. ANDAMAN
       ===================================================== */

    "Andaman Island Escape": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/BEACH_AT_ANDAMAN.jpg?width=1200",

        location:
            "Andaman & Nicobar Islands",

        duration:
            "6 Days / 5 Nights",

        price:
            "₹27,999",

        rating:
            "4.8",

        highlights:
            "Beaches • Port Blair • Island Hopping • Water Activities"
    },


    /* =====================================================
       12. AGRA
       ===================================================== */

    "Agra Heritage Tour": {

        image:
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Taj_Mahal%2CAgra.jpg?width=1200",

        location:
            "Agra, Uttar Pradesh",

        duration:
            "3 Days / 2 Nights",

        price:
            "₹11,999",

        rating:
            "4.7",

        highlights:
            "Taj Mahal • Agra Fort • Mughal Heritage • Local Market"
    }

};


/* =========================================================
   ESCAPE HTML
   =========================================================

   Backend se data aane par unsafe HTML avoid karne ke liye.
   ========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {

    if (
        typeof price === "number" &&
        Number.isFinite(price)
    ) {

        return `₹${price.toLocaleString("en-IN")}`;

    }

    if (!price) {
        return "₹0";
    }

    const cleanPrice =
        String(price).replace(/[₹,]/g, "");

    const number =
        Number(cleanPrice);

    if (Number.isFinite(number)) {

        return `₹${number.toLocaleString("en-IN")}`;

    }

    return String(price);
}


/* =========================================================
   NORMALIZE BACKEND TOUR
   ========================================================= */

function normalizeTour(tour) {

    return {

        id:
            tour.id ?? "",

        name:
            tour.name ??
            tour.title ??
            "Indian Tour",

        location:
            tour.location ??
            "",

        duration:
            tour.duration ??
            "3 Days / 2 Nights",

        price:
            tour.price ?? 0,

        rating:
            tour.rating ?? 4.5,

        image:
            tour.image ??
            tour.imageUrl ??
            "",

        highlights:
            tour.highlights ??
            "Sightseeing • Local Culture • Nature",

        search:
            tour.search ??
            `${tour.name ?? ""} ${tour.location ?? ""}`,

        description:
            tour.description ??
            "Explore this beautiful destination with Go Trip."

    };

}


/* =========================================================
   RENDER TOURS FROM BACKEND
   ========================================================= */

function renderTours(tours) {

    if (!tourGrid) return;

    if (!Array.isArray(tours)) {

        console.error(
            "Invalid tours data:",
            tours
        );

        return;
    }


    tourGrid.innerHTML = "";


    tours.forEach(tourItem => {

        const tour =
            normalizeTour(tourItem);


        const card =
            document.createElement("article");

        card.className = "tour-card";


        card.dataset.id =
            tour.id;

        card.dataset.name =
            tour.name;

        card.dataset.search =
            `${tour.name} ${tour.location} ${tour.search}`.toLowerCase();

        card.dataset.price =
            Number(
                String(tour.price)
                    .replace(/[₹,]/g, "")
            ) || 0;

        card.dataset.duration =
            parseDuration(tour.duration);

        card.dataset.rating =
            Number(tour.rating) || 0;


        card.innerHTML = `

            <div class="tour-image">

                <img
                    src="${escapeHtml(tour.image)}"
                    alt="${escapeHtml(tour.name)}"
                    loading="lazy"
                >

                <button
                    class="heart-btn"
                    type="button"
                    aria-label="Add to wishlist"
                >
                    ♡
                </button>

            </div>


            <div class="tour-content">

                <span class="tour-location">
                    📍 ${escapeHtml(tour.location)}
                </span>

                <h3>
                    ${escapeHtml(tour.name)}
                </h3>


                <div class="tour-meta">

                    <span>
                        🕓 ${escapeHtml(tour.duration)}
                    </span>

                    <span>
                        ⭐ ${escapeHtml(tour.rating)}
                    </span>

                </div>


                <div class="tour-footer">

                    <div>

                        <small>
                            Starting from
                        </small>

                        <strong>
                            ${formatPrice(tour.price)}
                        </strong>

                        <small>
                            / person
                        </small>

                    </div>


                    <button
                        class="outline-small"
                        type="button"
                        data-tour-id="${escapeHtml(tour.id)}"
                        data-tour-name="${escapeHtml(tour.name)}"
                    >
                        View Details
                    </button>

                </div>

            </div>
        `;


        tourGrid.appendChild(card);

    });


    updateResultCount();

    attachTourEvents();

    setupImageFallbacks();

}


/* =========================================================
   DURATION PARSER
   ========================================================= */

function parseDuration(duration) {

    if (!duration) {
        return 0;
    }


    const match =
        String(duration).match(/(\d+)/);

    return match
        ? Number(match[1])
        : 0;
}


/* =========================================================
   UPDATE RESULT COUNT
   ========================================================= */

function updateResultCount() {

    if (!resultCount) return;

    const cards =
        getTourCards();

    const visible =
        cards.filter(
            card => !card.hidden
        ).length;

    resultCount.textContent =
        visible;

    if (emptyState) {

        emptyState.hidden =
            visible !== 0;

    }

}


/* =========================================================
   SEARCH / FILTER
   ========================================================= */

function filterTours() {

    const query =
        destinationInput
            ?.value
            .trim()
            .toLowerCase() || "";


    const cards =
        getTourCards();


    let visible = 0;


    cards.forEach(card => {

        const searchable =
            `${card.dataset.name || ""}
             ${card.dataset.search || ""}`
                .toLowerCase();


        const matches =
            !query ||
            searchable.includes(query);


        card.hidden =
            !matches;


        if (matches) {
            visible++;
        }

    });


    if (resultCount) {

        resultCount.textContent =
            visible;

    }


    if (emptyState) {

        emptyState.hidden =
            visible !== 0;

    }

}


/* =========================================================
   SEARCH FORM
   ========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                !destinationInput ||
                !destinationInput.value.trim()
            ) {

                showToast(
                    "Please enter a destination first."
                );

                destinationInput?.focus();

                return;
            }


            if (
                dateInput &&
                !dateInput.value
            ) {

                showToast(
                    "Please choose your travel date."
                );

                dateInput.focus();

                return;
            }


            if (
                dateInput &&
                dateInput.value
            ) {

                const selected =
                    new Date(
                        `${dateInput.value}T00:00:00`
                    );


                if (selected < today) {

                    showToast(
                        "Please select today or a future travel date."
                    );

                    dateInput.focus();

                    return;
                }

            }


            filterTours();


            $("#tours")
                ?.scrollIntoView({
                    behavior: "smooth"
                });


            const count =
                Number(
                    resultCount?.textContent || 0
                );


            if (count === 0) {

                showToast(
                    "No exact package found. Try another Indian destination."
                );

            } else {

                showToast(
                    `${count} matching tour${count > 1 ? "s" : ""} found.`
                );

            }

        }
    );

}


/* =========================================================
   DESTINATION INPUT
   ========================================================= */

if (destinationInput) {

    destinationInput.addEventListener(
        "input",
        () => {

            if (
                destinationInput.value.trim() === ""
            ) {

                const cards =
                    getTourCards();


                cards.forEach(
                    card => card.hidden = false
                );


                if (resultCount) {

                    resultCount.textContent =
                        cards.length;

                }


                if (emptyState) {

                    emptyState.hidden =
                        true;

                }

            }

        }
    );

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (destinationInput) {
                destinationInput.value = "";
            }


            if (dateInput) {
                dateInput.value = "";
            }


            const travellers =
                $("#travellers");


            if (travellers) {
                travellers.value = "2";
            }


            const cards =
                getTourCards();


            cards.forEach(
                card => card.hidden = false
            );


            if (resultCount) {

                resultCount.textContent =
                    cards.length;

            }


            if (emptyState) {

                emptyState.hidden =
                    true;

            }


            showToast(
                "Search cleared."
            );

        }
    );

}


/* =========================================================
   SHOW ALL
   ========================================================= */

if (showAll) {

    showAll.addEventListener(
        "click",
        () => {

            clearSearch?.click();

        }
    );

}


/* =========================================================
   SORT TOURS
   ========================================================= */

if (sortTours) {

    sortTours.addEventListener(
        "change",
        () => {

            const value =
                sortTours.value;


            const sorted =
                [...getTourCards()];


            if (value === "price-low") {

                sorted.sort(
                    (a, b) =>
                        Number(a.dataset.price) -
                        Number(b.dataset.price)
                );

            }


            else if (value === "price-high") {

                sorted.sort(
                    (a, b) =>
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                );

            }


            else if (value === "duration") {

                sorted.sort(
                    (a, b) =>
                        Number(a.dataset.duration) -
                        Number(b.dataset.duration)
                );

            }


            else {

                sorted.sort(
                    (a, b) =>
                        Number(b.dataset.rating) -
                        Number(a.dataset.rating)
                );

            }


            sorted.forEach(
                card => tourGrid.appendChild(card)
            );

        }
    );

}


/* =========================================================
   WISHLIST
   ========================================================= */

function attachWishlistEvents() {

    $$(".heart-btn").forEach(button => {

        if (button.dataset.listenerAttached === "true") {
            return;
        }


        button.dataset.listenerAttached =
            "true";


        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                const saved =
                    button.classList.toggle("saved");


                button.textContent =
                    saved ? "♥" : "♡";


                button.setAttribute(
                    "aria-label",
                    saved
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                );


                showToast(
                    saved
                        ? "Tour saved to wishlist."
                        : "Removed from wishlist."
                );

            }
        );

    });

}


/* =========================================================
   MODAL FUNCTIONS
   ========================================================= */

function openModal(modal) {

    if (!modal) return;


    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );


    const close =
        $(".modal-close", modal);


    setTimeout(
        () => close?.focus(),
        50
    );

}


function closeModal(modal) {

    if (!modal) return;


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (!$(".modal.open")) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   MODAL CLOSE EVENTS
   ========================================================= */

$$("[data-close-modal]").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.closest(".modal")
                );

            }
        );

    }
);


$$(".modal").forEach(
    modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(modal);

                }

            }
        );

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            const open =
                $(".modal.open");


            if (open) {

                closeModal(open);

            }

        }

    }
);


/* =========================================================
   LOGIN
   ========================================================= */

/* =========================================================
   LOGIN - SPRING BOOT + JWT
========================================================= */

/* =========================================================
   LOGIN + USER SESSION
========================================================= */

const loginModal = $("#loginModal");


/* =========================================================
   GET LOGGED-IN USER
========================================================= */

function getLoggedInUser() {

    const userData = localStorage.getItem("goTripUser");

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("User data error:", error);
        return null;
    }
}


/* =========================================================
   UPDATE LOGIN BUTTON
========================================================= */

function updateAuthUI() {

    const user = getLoggedInUser();

    const loginButtons = $$("[data-open-login]");


    loginButtons.forEach(button => {

        /* =================================================
           USER LOGGED IN
        ================================================= */

        if (user) {

            button.textContent =
                `👤 ${user.name || "Profile"}`;


            button.classList.add(
                "user-profile-btn"
            );


            /* Remove login behavior */

            button.removeAttribute(
                "data-open-login"
            );


            /* Profile click */

            button.onclick = function(event) {

                event.preventDefault();

                event.stopPropagation();

                toggleProfileMenu(button);

            };


        }


        /* =================================================
           USER NOT LOGGED IN
        ================================================= */

        else {

            button.textContent = "Login";


            button.classList.remove(
                "user-profile-btn"
            );


            button.setAttribute(
                "data-open-login",
                ""
            );


            button.onclick = null;

        }

    });

}


/* =========================================================
   OPEN LOGIN
========================================================= */

$$("[data-open-login]").forEach(button => {

    button.addEventListener("click", () => {

        const user = getLoggedInUser();

        /* Already logged in */
        if (user) {

            showToast(
                `You are logged in as ${user.name}.`
            );

            return;
        }


        mobileMenu?.classList.remove("open");

        openModal(loginModal);

    });

});


/* =========================================================
   LOGIN FORM
========================================================= */

const loginForm = $("#loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const emailInput =
                loginForm.querySelector(
                    'input[type="email"]'
                );


            const passwordInput =
                loginForm.querySelector(
                    'input[type="password"]'
                );


            const email =
                emailInput?.value.trim() || "";


            const password =
                passwordInput?.value || "";


            if (!email || !password) {

                showToast(
                    "Please enter email and password."
                );

                return;
            }


            try {

                showToast("Logging in...");


                /* =========================================
                   SEND LOGIN REQUEST TO SPRING BOOT
                ========================================= */

                const response = await fetch(
                    "http://localhost:8080/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                const responseText =
    await response.text();

let data;

try {

    data = JSON.parse(responseText);

} catch (error) {

    data = responseText;
}

                /* =========================================
                   LOGIN ERROR
                ========================================= */

                if (!response.ok) {

                    throw new Error(
                        typeof data === "string"
                            ? data
                            : "Invalid email or password."
                    );
                }


                /* =========================================
                   SAVE JWT TOKEN
                ========================================= */

                localStorage.setItem(
                    "goTripToken",
                    data.token
                );


                /* =========================================
                   SAVE USER DETAILS
                ========================================= */

                localStorage.setItem(
                    "goTripUser",
                    JSON.stringify({

                        id: data.id,

                        name: data.name,

                        email: data.email,

                        role: data.role

                    })
                );


                /* =========================================
                   UPDATE NAVBAR
                ========================================= */

                updateAuthUI();


                /* =========================================
                   CLOSE LOGIN
                ========================================= */

                closeModal(loginModal);


                loginForm.reset();


                /* =========================================
                   SUCCESS MESSAGE
                ========================================= */

                showToast(
                    `Welcome ${data.name}! Login successful.`
                );


                console.log(
                    "Go Trip Login Successful:",
                    data
                );

                if (data.role === "ADMIN") {

    window.location.href = "admin.html";

    return;
}


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                showToast(
                    error.message ||
                    "Login failed. Please try again."
                );

            }

        }
    );

}


/* =========================================================
   RESTORE LOGIN AFTER PAGE REFRESH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAuthUI();

    }
);


/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function toggleProfileMenu(button) {

    let menu =
        document.getElementById("goTripProfileMenu");


    /* Agar menu already open hai to close karo */

    if (menu) {

        menu.remove();

        return;
    }


    const user = getLoggedInUser();


    if (!user) {

        openModal(loginModal);

        return;
    }


    /* =====================================================
       CREATE PROFILE MENU
    ===================================================== */

    menu = document.createElement("div");

    menu.id = "goTripProfileMenu";


    menu.innerHTML = `

        <div class="profile-menu-header">

            <div class="profile-avatar">
                ${(user.name || "U")
                    .charAt(0)
                    .toUpperCase()}
            </div>

            <div class="profile-user-info">

                <strong>
                    ${escapeHtml(user.name || "User")}
                </strong>

                <small>
                    ${escapeHtml(user.email || "")}
                </small>

            </div>

        </div>


        <div class="profile-menu-divider"></div>


        <button type="button" id="myProfileBtn">

            👤 My Profile

        </button>


        <button type="button" id="myBookingsBtn">

            📋 My Bookings

        </button>


        <div class="profile-menu-divider"></div>


        <button
            type="button"
            id="logoutBtn"
            class="logout-btn"
        >

            🚪 Logout

        </button>

    `;


    document.body.appendChild(menu);


    /* =====================================================
       POSITION MENU
    ===================================================== */

    const rect =
        button.getBoundingClientRect();


    menu.style.position = "fixed";

    menu.style.top =
        `${rect.bottom + 10}px`;

    menu.style.right =
        `${window.innerWidth - rect.right}px`;


    /* =====================================================
       MY PROFILE
    ===================================================== */

    document
        .getElementById("myProfileBtn")
        ?.addEventListener(
            "click",
            () => {

                menu.remove();

                showUserProfile();

            }
        );


    /* =====================================================
       MY BOOKINGS
    ===================================================== */

    document
    .getElementById("myBookingsBtn")
    ?.addEventListener(
        "click",
        () => {

            menu.remove();

            window.location.href = "my-bookings.html";

        }
    );

    /* =====================================================
       LOGOUT
    ===================================================== */

    document
        .getElementById("logoutBtn")
        ?.addEventListener(
            "click",
            () => {

                logoutGoTrip();

            }
        );

}


/* =========================================================
   USER PROFILE
========================================================= */

function showUserProfile() {

    const user = getLoggedInUser();

    if (!user) {

        openModal(loginModal);

        return;
    }

    window.location.href = "profile.html";
}


/* =========================================================
   LOGOUT
========================================================= */

function logoutGoTrip() {

    localStorage.removeItem(
        "goTripToken"
    );

    localStorage.removeItem(
        "goTripUser"
    );


    document
        .getElementById(
            "goTripProfileMenu"
        )
        ?.remove();


    updateAuthUI();


    showToast(
        "You have been logged out successfully."
    );

}



/* =========================================================
   TOUR DETAILS
   ========================================================= */

const tourModal =
    $("#tourModal");

const tourModalContent =
    $("#tourModalContent");


/* ---------------------------------------------------------
   Open details from a card
   --------------------------------------------------------- */

function attachTourDetailsEvents() {

    $$(".tour-card").forEach(card => {

        const button =
            $(".outline-small", card);


        if (!button) return;

        const id = card.dataset.id;
        const name = card.dataset.name;


        if (
            button.dataset.detailsAttached === "true"
        ) {

            return;

        }


        button.dataset.detailsAttached =
            "true";


        button.addEventListener(
            "click",
            () => {

                
const askButton = $("#askFromDetails");

if (askButton) {
    askButton.dataset.tourId = id || "";
    askButton.dataset.tourName = name || "";
}



                /*
                   Backend ID available:
                   load details from Spring Boot.

                   No ID:
                   use fallback data.
                */

                if (id) {

                    loadTourDetails(
                        id,
                        name
                    );

                } else {

                    openFallbackTourDetails(
                        name
                    );

                }

            }
        );

    });

}


/* =========================================================
   LOAD TOUR DETAILS FROM BACKEND
   ========================================================= */

async function loadTourDetails(
    id,
    fallbackName = ""
) {

    try {

        showToast(
            "Loading tour details..."
        );


        const response =
            await fetch(
                `${API_URL}/${encodeURIComponent(id)}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        const tour =
            normalizeTour(data);


        showTourDetails(
            tour
        );

    }


    catch (error) {

        console.error(
            "Tour details error:",
            error
        );


        /*
           Backend details fail hone par
           fallback data show karenge.
        */

        if (fallbackName) {

            openFallbackTourDetails(
                fallbackName
            );

        } else {

            showToast(
                "Unable to load tour details."
            );

        }

    }

}


/* =========================================================
   SHOW TOUR DETAILS
   ========================================================= */

function showTourDetails(tour) {

    window.currentTour = tour;

    if (
        !tourModal ||
        !tourModalContent
    ) {

        return;

    }


    const name =
        tour.name;


    tourModalContent.innerHTML = `

        <div class="tour-detail-image">

            <img
                src="${escapeHtml(tour.image)}"
                alt="${escapeHtml(name)}"
            >

        </div>


        <span class="eyebrow">
            TOUR DETAILS
        </span>


        <h2>
            ${escapeHtml(name)}
        </h2>


        <div class="rating">

            ★★★★★

            <span>
                ${escapeHtml(tour.rating)}
                guest rating
            </span>

        </div>


        <div class="detail-grid">

            <div class="detail-box">

                <small>
                    Location
                </small>

                <strong>
                    📍 ${escapeHtml(tour.location)}
                </strong>

            </div>


            <div class="detail-box">

                <small>
                    Duration
                </small>

                <strong>
                    🕓 ${escapeHtml(tour.duration)}
                </strong>

            </div>


            <div class="detail-box">

                <small>
                    Starting Price
                </small>

                <strong>
                    ${formatPrice(tour.price)}
                    / person
                </strong>

            </div>

        </div>


        <p
            style="
                color:#747c8e;
                line-height:1.7;
                font-size:13px;
            "
        >

            ${escapeHtml(
                tour.description ||
                "Explore this beautiful destination with Go Trip."
            )}

        </p>


        <p
            style="
                margin-top:15px;
                color:#3f4658;
                font-size:13px;
            "
        >

            <strong>
                Highlights:
            </strong>

            ${escapeHtml(tour.highlights)}

        </p>


        <div
            style="
                margin-top:22px;
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            "
        >

            <button
                class="primary-btn"
                type="button"
                id="bookFromDetails"
            >
                Book The Tour
            </button>


            <button
                class="outline-btn"
                type="button"
                id="askFromDetails"
            >
                View Full Details
            </button>

        </div>

    `;


    
setupImageFallbacks();

// BOOK THIS TOUR
const bookButton = $("#bookFromDetails");

if (bookButton) {
    bookButton.addEventListener("click", () => {
        const token = localStorage.getItem("goTripToken");

        if (!token) {
            closeModal(tourModal);
            openModal(loginModal);
            showToast("Please login to book this tour.");
            return;
        }

        closeModal(tourModal);
        openBookingModal(window.currentTour);
    });
}

// VIEW FULL DETAILS
const askButton = $("#askFromDetails");

if (askButton) {
    askButton.addEventListener("click", () => {
        const currentTour = window.currentTour;

        if (!currentTour) {
            showToast("Please select a destination first.");
            return;
        }

        const params = new URLSearchParams();

        if (currentTour.id != null) {
            params.set("id", currentTour.id);
        } else if (currentTour.name) {
            params.set("name", currentTour.name);
        } else {
            showToast("Destination details are unavailable.");
            return;
        }

        window.location.href =
            `destination-details.html?${params.toString()}`;
    });
}

openModal(tourModal);
}


/* =========================================================
   FALLBACK TOUR DETAILS
   ========================================================= */

function openFallbackTourDetails(
    name
) {

    const tour =
        fallbackTourData[name];


    if (!tour) {

        showToast(
            "Tour details are not available yet."
        );

        return;

    }


    showTourDetails({

        name,

        image:
            tour.image,

        location:
            tour.location,

        duration:
            tour.duration,

        price:
            tour.price,

        rating:
            tour.rating,

        highlights:
            tour.highlights,

        description:
            "This is the frontend tour preview. The final Spring Boot version will load full description, itinerary, hotel, inclusions, availability, cancellation policy and live price from MySQL."

    });

}



/* =========================================================
   ATTACH ALL TOUR EVENTS
   ========================================================= */

function attachTourEvents() {

    attachWishlistEvents();

    attachTourDetailsEvents();

}


/* =========================================================
   LOAD TOURS FROM SPRING BOOT
   ========================================================= */

async function loadToursFromBackend() {

    /*
       Backend available nahi hai to existing HTML cards
       automatically remain visible.
    */

    try {

        console.log(
            "Connecting to:",
            API_URL
        );


        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Backend response is not an array."
            );

        }


        console.log(
            "Tours loaded from Spring Boot:",
            data
        );


        renderTours(
            data
        );


        showToast(
            `${data.length} tours loaded from backend.`
        );

    }


    catch (error) {

        console.warn(
            "Backend unavailable. Using existing frontend tours.",
            error
        );


        /*
           Existing HTML cards remain visible.

           This is useful while Spring Boot API
           is still under development.
        */

        const cards =
            getTourCards();


        if (resultCount) {

            resultCount.textContent =
                cards.length;

        }


        attachTourEvents();


        setupImageFallbacks();

    }

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm = $("#contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        const form = event.target;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const originalText = submitButton.textContent;

        const enquiry = {
            name: $("#name").value.trim(),
            email: $("#email").value.trim(),
            phone: $("#phone").value.trim(),
            subject: $("#subject").value,
            message: $("#message").value.trim()
        };

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            const response = await fetch(
                "http://localhost:8080/api/contact-enquiries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(enquiry)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Enquiry submission failed.");
            }

            showToast(
                "Your enquiry has been submitted successfully!"
            );

            form.reset();

        } catch (error) {
            console.error("Contact Enquiry Error:", error);

            showToast(
                "Unable to submit enquiry. Please try again."
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

function setupImageFallbacks() {

    $$("img").forEach(img => {

        if (
            img.dataset.fallbackAttached === "true"
        ) {

            return;

        }


        img.dataset.fallbackAttached =
            "true";


        img.addEventListener(
            "error",
            () => {

                img.style.opacity =
                    "0";


                img.closest(
                    ".tour-image, .about-image, .hero, .service-card"
                )?.classList.add(
                    "image-fallback"
                );

            }
        );

    });

}


/* =========================================================
   TRANSPARENT HEADER / SCROLL STATE
   ========================================================= */

const navbar =
    document.querySelector(".navbar");


function updateNavbarState() {

    if (!navbar) return;


    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 35
    );

}


updateNavbarState();


window.addEventListener(
    "scroll",
    updateNavbarState,
    {
        passive: true
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeGoTrip() {

    /*
       First attach events to current HTML cards.
    */

    attachTourEvents();


    /*
       Image fallback.
    */

    setupImageFallbacks();


    /*
       Then try Spring Boot backend.

       If backend exists:
       MySQL tours -> Spring Boot -> frontend

       If backend doesn't exist:
       Existing HTML cards remain.
    */

    loadToursFromBackend();

}


initializeGoTrip();






/* =========================================================
   BOOKING SYSTEM
========================================================= */

/* =========================================================
   BOOKING SYSTEM
========================================================= */




/* Open Booking Modal */

/* =========================================================
   GO TRIP - BOOKING SYSTEM
========================================================= */

let selectedBookingTour = null;


/* =========================================================
   OPEN BOOKING MODAL
========================================================= */

function openBookingModal(tour) {

    selectedBookingTour = tour;

    const bookingModal =
        document.getElementById("bookingModal");

    if (!bookingModal) {
        console.error("Booking modal not found.");
        return;
    }

    // Tour details
    document.getElementById("bookingTourId").value =
        tour.id || "";

    document.getElementById("bookingTourName").textContent =
        tour.name || "Book Your Tour";

    document.getElementById("bookingTourInfo").textContent =
        `${tour.location || ""} • ${tour.duration || ""} Days`;


    // Price
    const price = Number(tour.price) || 0;

    document.getElementById("bookingPrice").textContent =
        `₹${price.toLocaleString("en-IN")}`;


    // Prevent past dates
    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("bookingDate").min = today;


    // Default travellers
    document.getElementById("bookingTravellers").value = 1;


    // Load logged-in user
    const userData =
        localStorage.getItem("goTripUser");

    if (userData) {

        try {

            const user = JSON.parse(userData);

            document.getElementById("bookingName").value =
                user.name || "";

            document.getElementById("bookingEmail").value =
                user.email || "";

        } catch (error) {

            console.error(
                "User data error:",
                error
            );
        }
    }


    // Generate first passenger
    generatePassengerFields();


    // Update total
    updateBookingTotal();


    // Open modal
    bookingModal.classList.add("active");
}


/* =========================================================
   GENERATE PASSENGER FIELDS
========================================================= */

function generatePassengerFields() {

    const container =
        document.getElementById("passengersContainer");

    if (!container) {
        return;
    }

    const travellers =
        Number(
            document.getElementById("bookingTravellers").value
        ) || 1;

    let html = "";


    for (let i = 1; i <= travellers; i++) {

        html += `

            <div class="passenger-card">

                <div class="passenger-card-header">

                    <span class="passenger-number">
                        PASSENGER ${i}
                    </span>

                    <h4>
                        Traveller ${i}
                    </h4>

                </div>


                <div class="form-row">

                    <div class="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            class="passenger-name"
                            placeholder="Passenger ${i} name"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Age
                        </label>

                        <input
                            type="number"
                            class="passenger-age"
                            min="1"
                            max="120"
                            placeholder="Age"
                            required
                        >

                    </div>

                </div>


                <div class="form-row">

                    <div class="form-group">

                        <label>
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            class="passenger-mobile"
                            maxlength="10"
                            placeholder="10-digit mobile"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            class="passenger-email"
                            placeholder="Passenger email (optional)"
                        >

                    </div>

                </div>

            </div>

        `;
    }

    container.innerHTML = html;
}



/* =========================================================
   HANDLE TRAVELLER COUNT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    const travellersInput =
        document.getElementById("bookingTravellers");

    if (!travellersInput) {
        console.error("Booking travellers input not found.");
        return;
    }

    travellersInput.addEventListener("input", () => {

        let travellers =
            Number(travellersInput.value) || 1;

        if (travellers < 1) {
            travellers = 1;
            travellersInput.value = 1;
        }

        if (travellers > 20) {
            travellers = 20;
            travellersInput.value = 20;
        }

        generatePassengerFields();
        updateBookingTotal();
    });

});


/* =========================================================
   UPDATE BOOKING TOTAL
========================================================= */

function updateBookingTotal() {

    if (!selectedBookingTour) {
        return;
    }

    const travellers =
        Number(
            document.getElementById("bookingTravellers").value
        ) || 1;

    const price =
        Number(selectedBookingTour.price) || 0;

    const total =
        price * travellers;


    // Price per person
    document.getElementById("bookingPrice").textContent =
        `₹${price.toLocaleString("en-IN")}`;


    // Traveller count
    const travellerCount =
        document.getElementById(
            "bookingTravellerCount"
        );

    if (travellerCount) {
        travellerCount.textContent = travellers;
    }


    // Total
    document.getElementById("bookingTotal").textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


/* =========================================================
   CLOSE BOOKING MODAL
========================================================= */

function closeBookingModal() {

    const bookingModal =
        document.getElementById("bookingModal");

    if (bookingModal) {

        bookingModal.classList.remove("active");
    }
}


/* =========================================================
   TRAVELLER COUNT CHANGE
========================================================= */



/* =========================================================
   BOOKING FORM SUBMIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const bookingForm =
            document.getElementById("bookingForm");

        if (!bookingForm) {
            return;
        }


        bookingForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                /* -----------------------------------------
                   CHECK TOUR
                ----------------------------------------- */

                if (!selectedBookingTour) {

                    alert(
                        "Please select a tour first."
                    );

                    return;
                }


                /* -----------------------------------------
                   CHECK LOGIN
                ----------------------------------------- */

                const userData =
                    localStorage.getItem("goTripUser");

                if (!userData) {

                    alert(
                        "Please login before booking."
                    );

                    return;
                }


                let user;

                try {

                    user = JSON.parse(userData);

                } catch (error) {

                    alert(
                        "Your login session is invalid. Please login again."
                    );

                    return;
                }


                /* -----------------------------------------
                   PRIMARY CONTACT
                ----------------------------------------- */

                const name =
                    document.getElementById(
                        "bookingName"
                    ).value.trim();

                const phone =
                    document.getElementById(
                        "bookingPhone"
                    ).value.trim();

                const email =
                    document.getElementById(
                        "bookingEmail"
                    ).value.trim();


                /* Phone validation */

                if (!/^[0-9]{10}$/.test(phone)) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    return;
                }


                /* -----------------------------------------
                   TRAVEL DATE
                ----------------------------------------- */

                const date =
                    document.getElementById(
                        "bookingDate"
                    ).value;

                if (!date) {

                    alert(
                        "Please select your travel date."
                    );

                    return;
                }


                /* -----------------------------------------
                   TRAVELLERS
                ----------------------------------------- */

               /* -----------------------------------------
   TRAVELLERS
----------------------------------------- */

const travellers =
    Number(
        document.getElementById(
            "bookingTravellers"
        ).value
    );


if (
    !travellers ||
    travellers < 1 ||
    travellers > 20
) {

    alert(
        "Please select between 1 and 20 travellers."
    );

    return;
}


/* -----------------------------------------
   PASSENGERS
----------------------------------------- */

const passengerNames =
    document.querySelectorAll(
        ".passenger-name"
    );

const passengerAges =
    document.querySelectorAll(
        ".passenger-age"
    );

const passengerMobiles =
    document.querySelectorAll(
        ".passenger-mobile"
    );

const passengerEmails =
    document.querySelectorAll(
        ".passenger-email"
    );

const passengers = [];


/* Check passenger fields */

if (
    passengerNames.length < travellers ||
    passengerAges.length < travellers ||
    passengerMobiles.length < travellers ||
    passengerEmails.length < travellers
) {

    alert(
        "Passenger details are not ready. Please try again."
    );

    generatePassengerFields();

    return;
}


/* Validate passengers */

for (let i = 0; i < travellers; i++) {

    const passengerName =
        passengerNames[i].value.trim();

    const passengerAge =
        Number(
            passengerAges[i].value
        );

    const passengerMobile =
        passengerMobiles[i].value.trim();

    const passengerEmail =
        passengerEmails[i].value.trim();


    /* Name */

    if (!passengerName) {

        alert(
            `Please enter name for Passenger ${i + 1}.`
        );

        return;
    }


    /* Age */

    if (
        !passengerAge ||
        passengerAge < 1 ||
        passengerAge > 120
    ) {

        alert(
            `Please enter a valid age for Passenger ${i + 1}.`
        );

        return;
    }


    /* Mobile */

    if (
        !/^[0-9]{10}$/.test(
            passengerMobile
        )
    ) {

        alert(
            `Please enter a valid 10-digit mobile number for Passenger ${i + 1}.`
        );

        return;
    }


    /* Optional Email */

    if (
        passengerEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            passengerEmail
        )
    ) {

        alert(
            `Please enter a valid email for Passenger ${i + 1}.`
        );

        return;
    }


    passengers.push({

        name: passengerName,

        age: passengerAge,

        mobile: passengerMobile,

        email:
            passengerEmail || null

    });

}


/* -----------------------------------------
   PRICE
----------------------------------------- */

const price =
    Number(
        selectedBookingTour.price
    ) || 0;

const total =
    price * travellers;


/* -----------------------------------------
   BOOKING DATA
----------------------------------------- */

const bookingData = {

    tourId:
        selectedBookingTour.id,

    tourName:
        selectedBookingTour.name,

    customerName:
        name,

    phone:
        phone,

    email:
        email,

    travelDate:
        date,

    travellers:
        travellers,

    pricePerPerson:
        price,

    totalAmount:
        total,

    passengersJson:
        JSON.stringify(passengers),

    status:
        "PENDING",

    cancellationReason:
        null

};


console.log(
    "Booking Data:",
    bookingData
);


                /* -----------------------------------------
                   JWT TOKEN
                ----------------------------------------- */

                const token =
                    localStorage.getItem(
                        "goTripToken"
                    );


                try {

                    const response =
                        await fetch(
                            "http://localhost:8080/api/bookings",
                            {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`

                                },

                                body:
                                    JSON.stringify(
                                        bookingData
                                    )
                            }
                        );


                    /* -------------------------------------
                       BACKEND ERROR
                    ------------------------------------- */

                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        console.error(
                            "Booking API Error:",
                            errorText
                        );

                        throw new Error(
                            "Booking could not be created."
                        );
                    }


                    /* -------------------------------------
                       SAVED BOOKING
                    ------------------------------------- */

                    const savedBooking =
                        await response.json();


                    console.log(
                        "Booking Saved:",
                        savedBooking
                    );


                    /* Close modal */

                    closeBookingModal();


                    /* Success */

                    showBookingSuccessModal(savedBooking);


                    /* Reset */

                    bookingForm.reset();

                    document.getElementById(
                        "travellers"
                    ).value = 1;

                    generatePassengerFields();

                    updateBookingTotal();


                } catch (error) {

                    console.error(
                        "Booking Error:",
                        error
                    );

                    alert(
                        "Booking failed. Please make sure the Spring Boot backend is running."
                    );
                }

            }
        );

    }
);


/* =========================================================
   ASK A QUESTION
========================================================= */

let selectedQuestionTour = null;


/* Open Question Modal */

function openQuestionModal(tour) {

    selectedQuestionTour = tour;

    document
        .getElementById("questionModal")
        .classList.add("active");

    document.getElementById("questionTourId").value =
        tour.id || "";

    document.getElementById("questionTourName").textContent =
        `Ask us anything about "${tour.name}".`;
}


/* Close Question Modal */

function closeQuestionModal() {

    document
        .getElementById("questionModal")
        .classList.remove("active");
}


/* Question Form Submit */

document.addEventListener("DOMContentLoaded", () => {

    const questionForm =
        document.getElementById("questionForm");

    if (!questionForm) return;

    questionForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("questionName").value.trim();

        const email =
            document.getElementById("questionEmail").value.trim();

        const question =
            document.getElementById("questionText").value.trim();

        if (!name || !email || !question) {

            alert(
                "Please fill all fields."
            );

            return;
        }

        closeQuestionModal();

        alert(
            `Question Sent Successfully! ✅\n\n` +
            `Tour: ${selectedQuestionTour?.name || "Tour"}\n\n` +
            `Thank you ${name}. Our team will contact you soon.`
        );

        questionForm.reset();

    });

});


/* =========================================================
   TOUR DETAILS → ASK QUESTION
========================================================= */

document.addEventListener("click", function (e) {

    if (e.target.closest("#askQuestionBtn")) {

        if (window.currentTour) {

            openQuestionModal(
                window.currentTour
            );

        } else {

            alert(
                "Please select a tour first."
            );
        }
    }

});


/* =========================================================
   TOUR DETAILS → BOOK THIS TOUR
========================================================= */

document.addEventListener("click", function (e) {

    if (e.target.closest("#bookTourBtn")) {

        if (window.currentTour) {

            openBookingModal(
                window.currentTour
            );

        } else {

            alert(
                "Please select a tour first."
            );
        }
    }

});





/* =========================================================
   TRAVELLER COUNT - FINAL HANDLER
========================================================= */


/* =========================================================
   MY BOOKINGS PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const bookingsContainer =
        document.getElementById("bookingsContainer");

    if (!bookingsContainer) {
        return;
    }

    const userData =
        localStorage.getItem("goTripUser");

    if (!userData) {
        bookingsContainer.innerHTML = `
            <p>Please login to view your bookings.</p>
        `;
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        bookingsContainer.innerHTML = `
            <p>Login session is invalid. Please login again.</p>
        `;
        return;
    }

    if (!user.email) {
        bookingsContainer.innerHTML = `
            <p>User email not found. Please login again.</p>
        `;
        return;
    }

    try {

        const token = localStorage.getItem("goTripToken");

if (!token) {
    bookingsContainer.innerHTML = `
        <p>Please login again to view your bookings.</p>
    `;
    return;
}

const response = await fetch(
    `http://localhost:8080/api/bookings/email/${encodeURIComponent(user.email)}`,
    {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
);

        if (!response.ok) {
            throw new Error("Failed to load bookings.");
        }

        const bookings = await response.json();

        console.log("My Bookings API Response:", bookings);

console.log(
    "Booking statuses:",
    bookings.map(b => ({
        id: b.id,
        status: b.status
    }))
);

        if (!bookings.length) {

            bookingsContainer.innerHTML = `
                <div class="empty-bookings">
                    <h3>No bookings yet</h3>
                    <p>Your Go Trip journeys will appear here.</p>
                </div>
            `;

            return;
        }

        bookingsContainer.innerHTML = bookings.map(booking => `

            <div class="booking-card">

                <div class="booking-card-header">

                    <div>
                        <span class="eyebrow">TRIP</span>

                        <h2>
                            ${booking.tourName || "Go Trip Tour"}
                        </h2>
                    </div>

                    <span class="booking-status">
                        ${booking.status || "PENDING"}
                    </span>

                </div>


                <div class="booking-card-info">

                    <div>
                        <span>Booking ID</span>
                        <strong>#${booking.id}</strong>
                    </div>

                    <div>
                        <span>Travel Date</span>
                        <strong>${booking.travelDate || "-"}</strong>
                    </div>

                    <div>
                        <span>Travellers</span>
                        <strong>${booking.travellers || 0}</strong>
                    </div>

                    <div>
                        <span>Price / Person</span>
                        <strong>
                            ₹${Number(
                                booking.pricePerPerson || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>Total Amount</span>
                        <strong>
                            ₹${Number(
                                booking.totalAmount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>


                <div class="booking-card-actions">

    ${
        booking.status === "CANCELLED"
            ? `
                <button
                    type="button"
                    class="ticket-btn ticket-disabled-btn"
                    disabled>
                    🚫 Ticket Unavailable
                </button>

                <button
                    type="button"
                    class="cancel-booking-btn already-cancelled-btn"
                    disabled>
                    ✓ Already Cancelled
                </button>

                <button
                    type="button"
                    class="delete-booking-btn"
                    onclick="deleteBooking(${booking.id})">
                    🗑 Delete
                </button>
              `
            : `
                <button
                    type="button"
                    class="ticket-btn"
                    onclick="viewBookingTicket(${booking.id})">
                    🎫 View Ticket
                </button>

                <button
                    type="button"
                    class="cancel-booking-btn"
                    onclick="cancelBooking(${booking.id})">
                    Cancel Booking
                </button>
              `
    }

</div>

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "My Bookings Error:",
            error
        );

        bookingsContainer.innerHTML = `
            <p>
                Unable to load bookings.
                Please make sure the Spring Boot backend is running.
            </p>
        `;
    }

});

/* =========================================================
   VIEW BOOKING TICKET
========================================================= */

function viewBookingTicket(bookingId) {

    if (!bookingId) {
        return;
    }

    window.location.href =
        `ticket.html?id=${bookingId}`;
}


/* =========================================================
   GO TRIP - TRAVEL TICKET
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const ticketPassengers =
        document.getElementById("ticketPassengers");

    // Ye check karta hai ki hum ticket page par hain ya nahi
    if (!ticketPassengers) {
        return;
    }

    loadTravelTicket();

});


/* =========================================================
   LOAD TRAVEL TICKET
========================================================= */

async function loadTravelTicket() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const bookingId =
            params.get("id");


        if (!bookingId) {

            throw new Error(
                "Booking ID not found in URL."
            );

        }


        console.log(
            "Loading booking:",
            bookingId
        );


        const token =
            localStorage.getItem("goTripToken");


        const response =
            await fetch(
                `http://localhost:8080/api/bookings/${encodeURIComponent(bookingId)}`,
                {
                    method: "GET",

                    headers: token
                        ? {
                            "Authorization":
                                `Bearer ${token}`
                        }
                        : {}
                }
            );


        if (!response.ok) {

            throw new Error(
                `Booking API Error: HTTP ${response.status}`
            );

        }


        const booking =
            await response.json();


        console.log(
            "Ticket Booking Data:",
            booking
        );


        /* =================================================
           BASIC BOOKING DETAILS
        ================================================= */


        const statusElement =
            document.getElementById(
                "ticketStatus"
            );

        if (statusElement) {

            statusElement.textContent =
                booking.status || "PENDING";

        }


        const tourName =
            document.getElementById(
                "ticketTourName"
            );

        if (tourName) {

            tourName.textContent =
                booking.tourName ||
                "Go Trip Journey";

        }


        const travelDate =
            document.getElementById(
                "ticketTravelDate"
            );

        if (travelDate) {

            travelDate.textContent =
                `Travel Date: ${
                    booking.travelDate || "-"
                }`;

        }


        /* =================================================
           BOOKING SUMMARY
        ================================================= */


        const bookingIdElement =
            document.getElementById(
                "ticketBookingId"
            );

        if (bookingIdElement) {

            bookingIdElement.textContent =
                `#${booking.id || bookingId}`;

        }


        const travellersElement =
            document.getElementById(
                "ticketTravellers"
            );

        if (travellersElement) {

            travellersElement.textContent =
                booking.travellers || 0;

        }


        const priceElement =
            document.getElementById(
                "ticketPrice"
            );

        if (priceElement) {

            priceElement.textContent =
                `₹${Number(
                    booking.pricePerPerson || 0
                ).toLocaleString("en-IN")}`;

        }


        const totalElement =
            document.getElementById(
                "ticketTotal"
            );

        if (totalElement) {

            totalElement.textContent =
                `₹${Number(
                    booking.totalAmount || 0
                ).toLocaleString("en-IN")}`;

        }


        /* =================================================
           TRAVELLER BADGE
        ================================================= */


        const travellersBadge =
            document.getElementById(
                "ticketTravellersBadge"
            );

        if (travellersBadge) {

            travellersBadge.textContent =
                booking.travellers || 0;

        }


        /* =================================================
           PASSENGERS
        ================================================= */


        renderTicketPassengers(
            booking.passengers || []
        );


    } catch (error) {

        console.error(
            "Ticket Loading Error:",
            error
        );


        const ticketPassengers =
            document.getElementById(
                "ticketPassengers"
            );


        if (ticketPassengers) {

            ticketPassengers.innerHTML = `

                <div class="ticket-loading">

                    <p style="color:#d33b3b;font-weight:700;">
                        Unable to load ticket details.
                    </p>

                    <p>
                        Please make sure the booking
                        exists and Spring Boot is running.
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================================
   RENDER PASSENGERS
========================================================= */

function renderTicketPassengers(
    passengers
) {

    const container =
        document.getElementById(
            "ticketPassengers"
        );


    if (!container) {
        return;
    }


    if (
        !passengers ||
        passengers.length === 0
    ) {

        container.innerHTML = `

            <div class="ticket-loading">

                <p>
                    No passenger details available.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    passengers.forEach(
        (passenger, index) => {

            html += `

                <div class="ticket-passenger-card">

                    <div class="ticket-passenger-header">

                        <div>

                            <div class="ticket-passenger-number">
                                PASSENGER ${index + 1}
                            </div>

                            <div class="ticket-passenger-name">
                                ${escapeTicketText(
                                    passenger.name || "-"
                                )}
                            </div>

                        </div>

                    </div>


                    <div class="ticket-passenger-details">


                        <div class="ticket-passenger-detail">

                            <span>
                                Age
                            </span>

                            <strong>
                                ${passenger.age || "-"}
                            </strong>

                        </div>


                        <div class="ticket-passenger-detail">

                            <span>
                                Mobile
                            </span>

                            <strong>
                                ${escapeTicketText(
                                    passenger.mobile || "-"
                                )}
                            </strong>

                        </div>


                        <div class="ticket-passenger-detail">

                            <span>
                                Email
                            </span>

                            <strong>
                                ${escapeTicketText(
                                    passenger.email || "Not provided"
                                )}
                            </strong>

                        </div>


                        <div class="ticket-passenger-detail">

                            <span>
                                Passenger
                            </span>

                            <strong>
                                Traveller ${index + 1}
                            </strong>

                        </div>


                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;

}


/* =========================================================
   SAFE TEXT
========================================================= */

function escapeTicketText(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/* =========================================================
   CANCEL BOOKING
========================================================= */

/* =========================================================
   CANCEL BOOKING - PREMIUM GO TRIP MODAL
========================================================= */

async function cancelBooking(id) {

    // Remove existing modal if already present
    document.getElementById("cancelBookingModal")?.remove();

    const modal = document.createElement("div");

    modal.id = "cancelBookingModal";

    modal.innerHTML = `
        <div class="cancel-modal-overlay">

            <div class="cancel-modal-box">

                <button
                    type="button"
                    class="cancel-modal-close"
                    id="closeCancelModal">
                    ×
                </button>

                <div class="cancel-modal-icon">
                    ⚠️
                </div>

                <span class="cancel-modal-eyebrow">
                    CANCEL BOOKING
                </span>

                <h2>Are you sure?</h2>

                <p>
                    We’re sorry to see you cancel your trip.
                    Please tell us why you want to cancel this booking.
                </p>

                <div class="cancel-reason-group">

                    <label for="cancelReason">
                        Cancellation Reason
                    </label>

                    <textarea
                        id="cancelReason"
                        rows="4"
                        placeholder="Example: My travel plan has changed..."
                    ></textarea>

                </div>

                <div class="cancel-modal-actions">

                    <button
                        type="button"
                        class="cancel-back-btn"
                        id="closeCancelModalBtn">
                        Keep Booking
                    </button>

                    <button
                        type="button"
                        class="cancel-confirm-btn"
                        id="confirmCancelBtn">
                        Cancel Booking
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeCancelModal() {
        modal.remove();
    }

    document
        .getElementById("closeCancelModal")
        ?.addEventListener(
            "click",
            closeCancelModal
        );

    document
        .getElementById("closeCancelModalBtn")
        ?.addEventListener(
            "click",
            closeCancelModal
        );


    /* =====================================================
       CONFIRM CANCELLATION
    ===================================================== */

 document
    .getElementById("confirmCancelBtn")
    ?.addEventListener(
        "click",
        async () => {

            const reason =
                document
                    .getElementById("cancelReason")
                    .value
                    .trim();

            if (!reason) {

                alert(
                    "Please enter a cancellation reason."
                );

                return;
            }

            const confirmButton =
                document.getElementById(
                    "confirmCancelBtn"
                );

            confirmButton.disabled = true;

            confirmButton.textContent =
                "Cancelling...";


            try {

                const token =
    localStorage.getItem("goTripToken");

if (!token) {
    alert("Please login again.");
    return;
}

const response =
    await fetch(
        `http://localhost:8080/api/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );


                if (!response.ok) {

                    throw new Error(
                        "Cancellation failed"
                    );

                }


                closeCancelModal();

                alert(
                    "Your booking has been cancelled successfully. ✅"
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    "Cancel Booking Error:",
                    error
                );

                confirmButton.disabled = false;

                confirmButton.textContent =
                    "Cancel Booking";

                alert(
                    "Unable to cancel booking. Please try again."
                );
            }

        }
    );


    /* =====================================================
       CLOSE ON BACKDROP CLICK
    ===================================================== */

    document
        .querySelector(".cancel-modal-overlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.classList.contains(
                        "cancel-modal-overlay"
                    )
                ) {
                    closeCancelModal();
                }

            }
        );
}


/* =========================================
   REGISTER MODAL
========================================= */

/* =========================================
   OPEN REGISTER MODAL
========================================= */

function openRegisterModal() {

    const loginModal =
        document.getElementById("loginModal");

    const registerModal =
        document.getElementById("registerModal");

    if (loginModal) {
        loginModal.classList.remove("open", "active");
        loginModal.setAttribute("aria-hidden", "true");
    }

    if (registerModal) {
        registerModal.classList.add("open");
        registerModal.setAttribute("aria-hidden", "false");
    }
}

/* =========================================
   REGISTER USER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const phone =
            document.getElementById("registerPhone").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        // Mobile validation
        if (!/^\d{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        const button =
            registerForm.querySelector("button[type='submit']");

        button.disabled = true;
        button.textContent = "CREATING ACCOUNT...";

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    })
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                data = text;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data.message || "Registration failed."
                );
            }

            alert("Account created successfully! 🎉");

            // Reset form
            registerForm.reset();

            // Close Register Modal
            const registerModal =
                document.getElementById("registerModal");

            if (registerModal) {
                registerModal.classList.remove("open", "active");
                registerModal.setAttribute("aria-hidden", "true");
            }

            // Open Login Modal
            const loginModal =
                document.getElementById("loginModal");

            if (loginModal) {
                loginModal.classList.add("open");
                loginModal.setAttribute("aria-hidden", "false");
            }

            // Automatically fill registered email
            const loginEmail =
                document.getElementById("loginEmail");

            if (loginEmail) {
                loginEmail.value = email;
            }

        } catch (error) {

            console.error("Registration Error:", error);

            alert(
                error.message ||
                "Unable to create account. Please try again."
            );

        } finally {

            button.disabled = false;
            button.textContent = "CREATE ACCOUNT";

        }

    });

});

/* =========================================
   BOOKING SUCCESS MODAL
========================================= */

function showBookingSuccessModal(booking) {

    // Agar pehle se modal hai to remove karo
    document.getElementById("bookingSuccessModal")?.remove();

    const modal = document.createElement("div");

    modal.id = "bookingSuccessModal";

    modal.innerHTML = `
        <div class="booking-success-overlay">

            <div class="booking-success-box">

                <button
                    type="button"
                    class="booking-success-close"
                    id="closeBookingSuccess">
                    ×
                </button>

                <div class="booking-success-icon">
                    ✓
                </div>

                <span class="booking-success-eyebrow">
                    BOOKING CONFIRMED
                </span>

                <h2>
                    Booking Submitted Successfully!
                </h2>

                <p class="booking-success-subtitle">
                    Your journey has been booked successfully.
                    Keep your booking details safe.
                </p>

                <div class="booking-success-details">

                    <div class="success-detail">
                        <span>Booking ID</span>
                        <strong>#${booking.id}</strong>
                    </div>

                    <div class="success-detail">
                        <span>Tour</span>
                        <strong>${booking.tourName || "-"}</strong>
                    </div>

                    <div class="success-detail">
                        <span>Travellers</span>
                        <strong>${booking.travellers || 0}</strong>
                    </div>

                    <div class="success-detail">
                        <span>Travel Date</span>
                        <strong>${booking.travelDate || "-"}</strong>
                    </div>

                    <div class="success-detail">
                        <span>Total Amount</span>
                        <strong>
                            ₹${Number(
                                booking.totalAmount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div class="success-detail">
                        <span>Status</span>
                        <strong class="success-status">
                            PENDING
                        </strong>
                    </div>

                </div>

                <div class="booking-success-actions">

                    <button
                        type="button"
                        class="success-ticket-btn"
                        id="successViewTicket">
                        🎫 View Ticket
                    </button>

                    <button
                        type="button"
                        class="success-close-btn"
                        id="successContinue">
                        Continue Exploring
                    </button>

                </div>

                <p class="booking-success-footer">
                    🔒 Your booking information is secure.
                </p>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    // Close modal
    function closeSuccessModal() {
        modal.remove();
    }


    document
        .getElementById("closeBookingSuccess")
        ?.addEventListener(
            "click",
            closeSuccessModal
        );


    document
        .getElementById("successContinue")
        ?.addEventListener(
            "click",
            closeSuccessModal
        );


    // View ticket
    document
        .getElementById("successViewTicket")
        ?.addEventListener(
            "click",
            () => {

                if (booking.id) {

                    window.location.href =
                        `ticket.html?id=${booking.id}`;

                }

            }
        );


    // Outside click
    document
        .querySelector(".booking-success-overlay")
        ?.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.classList.contains(
                        "booking-success-overlay"
                    )
                ) {
                    closeSuccessModal();
                }

            }
        );

}

/* =========================================
   DELETE CANCELLED BOOKING
========================================= */

async function deleteBooking(id) {

    const confirmed = confirm(
        "Are you sure you want to permanently delete this cancelled booking?"
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("goTripToken");

    if (!token) {
        alert("Please login again.");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/bookings/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Delete failed: HTTP ${response.status}`
            );
        }

        alert("Booking deleted successfully. 🗑️");

        window.location.reload();

    } catch (error) {

        console.error(
            "Delete Booking Error:",
            error
        );

        alert(
            "Unable to delete booking. Please try again."
        );
    }
}



(function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get("openBooking") !== "1") return;

    const savedTour = sessionStorage.getItem(
        "selectedTourForBooking"
    );

    if (!savedTour) return;

    try {
        const tour = JSON.parse(savedTour);

        window.currentTour = tour;

        openBookingModal(tour);

        sessionStorage.removeItem("selectedTourForBooking");

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.hash
        );
    } catch (error) {
        console.error("Could not open selected tour booking:", error);
    }
})();
