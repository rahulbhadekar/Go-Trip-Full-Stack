document.addEventListener("DOMContentLoaded", () => {

    // ================= SECURITY =================

    const token = localStorage.getItem("goTripToken");
    const userData = localStorage.getItem("goTripUser");

    if (!token || !userData) {
        alert("Please login as Admin.");
        window.location.href = "index.html";
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        alert("Invalid login session.");
        window.location.href = "index.html";
        return;
    }

    if (user.role !== "ADMIN") {
        alert("Access Denied! Admin only.");
        window.location.href = "index.html";
        return;
    }


    // ================= ELEMENTS =================

    const toursContainer =
        document.getElementById("adminToursContainer");

    const tourCount =
        document.getElementById("tourCount");

    const tourModal =
        document.getElementById("tourModal");

    const tourForm =
        document.getElementById("tourForm");

    const openAddTourBtn =
        document.getElementById("openAddTourBtn");

    const closeTourModal =
        document.getElementById("closeTourModal");

    const cancelTourFormBtn =
        document.getElementById("cancelTourFormBtn");

    const logoutBtn =
        document.getElementById("adminToursLogoutBtn");


    // ================= LOAD TOURS =================

    loadTours();


    async function loadTours() {

        toursContainer.innerHTML = `
            <div class="admin-tour-loading">
                Loading tours...
            </div>
        `;

        try {

            const response = await fetch(
                "http://localhost:8080/api/tours",
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load tours: HTTP ${response.status}`
                );
            }

            const tours = await response.json();

            renderTours(tours);

        } catch (error) {

            console.error(
                "Load Tours Error:",
                error
            );

            toursContainer.innerHTML = `
                <div class="admin-tour-loading">
                    Unable to load tours.
                    Please make sure the Spring Boot backend is running.
                </div>
            `;
        }
    }


    // ================= RENDER TOURS =================

    function renderTours(tours) {

        tourCount.textContent =
            `${tours.length} ${tours.length === 1 ? "Tour" : "Tours"}`;


        if (!tours.length) {

            toursContainer.innerHTML = `
                <div class="admin-tour-loading">
                    No tours available.
                </div>
            `;

            return;
        }


        toursContainer.innerHTML =
            tours.map(tour => {

                return `
                    <article class="admin-tour-card">

                        <div class="admin-tour-image-wrap">

                            <img
                                src="${escapeHtml(tour.image || "")}"
                                alt="${escapeHtml(tour.name || "Tour")}"
                                class="admin-tour-image"
                                onerror="this.src='https://via.placeholder.com/800x500?text=Go+Trip'"
                            >

                            <span class="admin-tour-category">
                                ${escapeHtml(
                                    tour.category || "Travel"
                                )}
                            </span>

                        </div>


                        <div class="admin-tour-content">

                            <div class="admin-tour-location">
                                ${escapeHtml(
                                    tour.location || "-"
                                )}
                            </div>

                            <h3>
                                ${escapeHtml(
                                    tour.name || "Unnamed Tour"
                                )}
                            </h3>

                            <p class="admin-tour-description">
                                ${escapeHtml(
                                    tour.description || "No description available."
                                )}
                            </p>


                            <div class="admin-tour-meta">

                                <span class="admin-tour-duration">
                                    🕐 ${tour.duration || 0} Days
                                </span>

                                <span class="admin-tour-rating">
                                    ⭐ ${tour.rating || 0}
                                </span>

                            </div>


                            <div class="admin-tour-price">
                                ₹${Number(
                                    tour.price || 0
                                ).toLocaleString("en-IN")}

                                <span>
                                    / person
                                </span>
                            </div>


                            <div class="admin-tour-actions">

                                <button
                                    type="button"
                                    class="admin-tour-edit-btn"
                                    onclick="editTour(${tour.id})">
                                    ✏️ Edit
                                </button>

                                <button
                                    type="button"
                                    class="admin-tour-delete-btn"
                                    onclick="deleteTour(${tour.id})">
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    </article>
                `;

            }).join("");
    }


    // ================= ADD TOUR =================

    openAddTourBtn.addEventListener(
        "click",
        () => {

            resetTourForm();

            document.getElementById(
                "tourModalTitle"
            ).textContent = "Add New Tour";

            document.getElementById(
                "saveTourBtn"
            ).textContent = "Save Tour";

            openModal();
        }
    );


    // ================= CLOSE MODAL =================

    closeTourModal.addEventListener(
        "click",
        closeModal
    );

    cancelTourFormBtn.addEventListener(
        "click",
        closeModal
    );


    tourModal.addEventListener(
        "click",
        event => {

            if (
                event.target === tourModal
            ) {
                closeModal();
            }

        }
    );


    function openModal() {

        tourModal.classList.add("open");

        tourModal.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeModal() {

        tourModal.classList.remove("open");

        tourModal.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    // ================= EDIT TOUR =================

    window.editTour = async function(id) {

        try {

            const response = await fetch(
                `http://localhost:8080/api/tours/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load tour."
                );
            }

            const tour =
                await response.json();


            document.getElementById(
                "tourId"
            ).value = tour.id;

            document.getElementById(
                "tourName"
            ).value = tour.name || "";

            document.getElementById(
                "tourLocation"
            ).value = tour.location || "";

            document.getElementById(
                "tourDescription"
            ).value = tour.description || "";

            document.getElementById(
                "tourDuration"
            ).value = tour.duration || "";

            document.getElementById(
                "tourPrice"
            ).value = tour.price || "";

            document.getElementById(
                "tourRating"
            ).value = tour.rating || "";

            document.getElementById(
                "tourCategory"
            ).value = tour.category || "";

            document.getElementById(
                "tourImage"
            ).value = tour.image || "";


            document.getElementById(
                "tourModalTitle"
            ).textContent = "Edit Tour";

            document.getElementById(
                "saveTourBtn"
            ).textContent = "Update Tour";


            openModal();

        } catch (error) {

            console.error(
                "Edit Tour Error:",
                error
            );

            alert(
                "Unable to load tour details."
            );
        }
    };


    // ================= SAVE / UPDATE =================

    tourForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "tourId"
                ).value;


            const tourData = {

                name:
                    document.getElementById(
                        "tourName"
                    ).value.trim(),

                location:
                    document.getElementById(
                        "tourLocation"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "tourDescription"
                    ).value.trim(),

                duration:
                    Number(
                        document.getElementById(
                            "tourDuration"
                        ).value
                    ),

                price:
                    Number(
                        document.getElementById(
                            "tourPrice"
                        ).value
                    ),

                rating:
                    Number(
                        document.getElementById(
                            "tourRating"
                        ).value
                    ),

                image:
                    document.getElementById(
                        "tourImage"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "tourCategory"
                    ).value.trim()
            };


            const saveButton =
                document.getElementById(
                    "saveTourBtn"
                );

            saveButton.disabled = true;

            saveButton.textContent =
                id
                    ? "Updating..."
                    : "Saving...";


            try {

                const url = id
                    ? `http://localhost:8080/api/tours/${id}`
                    : "http://localhost:8080/api/tours";


                const method = id
                    ? "PUT"
                    : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify(
                                    tourData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        `Request failed: HTTP ${response.status}`
                    );
                }


                closeModal();

                resetTourForm();

                await loadTours();


                alert(
                    id
                        ? "Tour updated successfully! ✅"
                        : "Tour added successfully! 🎉"
                );


            } catch (error) {

                console.error(
                    "Save Tour Error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save tour."
                );

            } finally {

                saveButton.disabled = false;

                saveButton.textContent =
                    "Save Tour";
            }

        }
    );


    // ================= DELETE TOUR =================

    window.deleteTour = async function(id) {

        const confirmed =
            confirm(
                "Are you sure you want to permanently delete this tour?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/tours/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Delete failed: HTTP ${response.status}`
                );
            }


            await loadTours();


            alert(
                "Tour deleted successfully. 🗑️"
            );


        } catch (error) {

            console.error(
                "Delete Tour Error:",
                error
            );

            alert(
                "Unable to delete tour. Please try again."
            );
        }
    };


    // ================= RESET FORM =================

    function resetTourForm() {

        tourForm.reset();

        document.getElementById(
            "tourId"
        ).value = "";

        document.getElementById(
            "tourModalTitle"
        ).textContent = "Add New Tour";

        document.getElementById(
            "saveTourBtn"
        ).textContent = "Save Tour";
    }


    // ================= LOGOUT =================

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "goTripToken"
            );

            localStorage.removeItem(
                "goTripUser"
            );

            window.location.href =
                "index.html";
        }
    );


    // ================= HTML ESCAPE =================

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});