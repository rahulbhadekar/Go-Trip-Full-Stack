document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // AUTH CHECK
    // =========================

    const token =
        localStorage.getItem("goTripToken");

    const userData =
        localStorage.getItem("goTripUser");

    if (!token || !userData) {

        alert("Please login as Admin.");

        window.location.href =
            "index.html";

        return;
    }


    let currentUser;

    try {

        currentUser =
            JSON.parse(userData);

    } catch (error) {

        alert("Invalid login session.");

        window.location.href =
            "index.html";

        return;
    }


    if (currentUser.role !== "ADMIN") {

        alert("Access Denied! Admin only.");

        window.location.href =
            "index.html";

        return;
    }


    // =========================
    // ELEMENTS
    // =========================

    const usersContainer =
        document.getElementById(
            "adminUsersContainer"
        );

    const searchInput =
        document.getElementById(
            "userSearchInput"
        );

    const totalUsersCount =
        document.getElementById(
            "totalUsersCount"
        );

    const normalUsersCount =
        document.getElementById(
            "normalUsersCount"
        );

    const adminUsersCount =
        document.getElementById(
            "adminUsersCount"
        );

    const logoutButton =
        document.getElementById(
            "adminUsersLogoutBtn"
        );


    let allUsers = [];


    // =========================
    // LOAD USERS
    // =========================

    loadUsers();


    async function loadUsers() {

        usersContainer.innerHTML = `
            <div class="users-loading">
                Loading users...
            </div>
        `;

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/users",
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
                    `Unable to load users: HTTP ${response.status}`
                );
            }


            allUsers =
                await response.json();


            updateUserStats();

            renderUsers(allUsers);


        } catch (error) {

            console.error(
                "Admin Users Error:",
                error
            );


            usersContainer.innerHTML = `
                <div class="users-loading">
                    Unable to load users.
                    <br>
                    Please make sure the Spring Boot backend is running.
                </div>
            `;
        }
    }


    // =========================
    // UPDATE STATS
    // =========================

    function updateUserStats() {

        const total =
            allUsers.length;


        const normalUsers =
            allUsers.filter(
                user =>
                    user.role !== "ADMIN"
            ).length;


        const admins =
            allUsers.filter(
                user =>
                    user.role === "ADMIN"
            ).length;


        totalUsersCount.textContent =
            total;

        normalUsersCount.textContent =
            normalUsers;

        adminUsersCount.textContent =
            admins;
    }


    // =========================
    // RENDER USERS
    // =========================

    function renderUsers(users) {

        if (!users.length) {

            usersContainer.innerHTML = `
                <div class="users-loading">
                    No users found.
                </div>
            `;

            return;
        }


        usersContainer.innerHTML =
            users.map(user => {

                const role =
                    user.role || "USER";


                const isAdmin =
                    role === "ADMIN";


                const userName =
                    user.name || "Unknown User";


                const firstLetter =
                    userName
                        .charAt(0)
                        .toUpperCase();


                /*
                 * Current logged-in admin ko
                 * delete button nahi denge.
                 */

                const isCurrentAdmin =
                    currentUser.email ===
                    user.email;


                return `
                    <article
                        class="admin-user-card">

                        <!-- USER HEADER -->

                        <div
                            class="user-card-header">

                            <div
                                class="user-avatar">

                                ${escapeHtml(
                                    firstLetter
                                )}

                            </div>


                            <div>

                                <h3>
                                    ${escapeHtml(
                                        userName
                                    )}
                                </h3>

                                <p>
                                    ${escapeHtml(
                                        user.email ||
                                        "-"
                                    )}
                                </p>

                            </div>


                            <span
                                class="user-role ${
                                    isAdmin
                                        ? "admin"
                                        : "user"
                                }">

                                ${escapeHtml(
                                    role
                                )}

                            </span>

                        </div>


                        <!-- USER DETAILS -->

                        <div
                            class="user-details">

                            <div
                                class="user-detail">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #${user.id}
                                </strong>

                            </div>


                            <div
                                class="user-detail">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        user.phone ||
                                        "Not provided"
                                    )}
                                </strong>

                            </div>


                            <div
                                class="user-detail">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        user.email ||
                                        "-"
                                    )}
                                </strong>

                            </div>


                            <div
                                class="user-detail">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    ${
                                        isAdmin
                                            ? "Administrator"
                                            : "Customer"
                                    }
                                </strong>

                            </div>

                        </div>


                        <!-- ACTION -->

                        ${
                            !isCurrentAdmin
                                ? `
                                    <div
                                        class="user-card-actions">

                                        <button
                                            type="button"
                                            class="delete-user-btn"
                                            onclick="deleteUser(${user.id})">

                                            🗑️ Delete User

                                        </button>

                                    </div>
                                  `
                                : `
                                    <div
                                        class="user-card-actions">

                                        <span
                                            style="
                                                color:#64748b;
                                                font-size:12px;
                                                font-weight:600;
                                            ">

                                            Current Admin

                                        </span>

                                    </div>
                                  `
                        }

                    </article>
                `;

            }).join("");
    }


    // =========================
    // SEARCH USERS
    // =========================

    searchInput.addEventListener(
        "input",
        () => {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                renderUsers(allUsers);

                return;
            }


            const filteredUsers =
                allUsers.filter(user => {

                    const name =
                        String(
                            user.name || ""
                        ).toLowerCase();


                    const email =
                        String(
                            user.email || ""
                        ).toLowerCase();


                    const phone =
                        String(
                            user.phone || ""
                        ).toLowerCase();


                    return (
                        name.includes(searchValue) ||
                        email.includes(searchValue) ||
                        phone.includes(searchValue)
                    );
                });


            renderUsers(filteredUsers);

        }
    );


    // =========================
    // DELETE USER
    // =========================

    window.deleteUser =
        async function (userId) {

            const user =
                allUsers.find(
                    item =>
                        Number(item.id) ===
                        Number(userId)
                );


            if (!user) {

                alert(
                    "User not found."
                );

                return;
            }


            if (
                user.email ===
                currentUser.email
            ) {

                alert(
                    "You cannot delete your own admin account."
                );

                return;
            }


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${user.name}"?`
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `http://localhost:8080/api/users/${userId}`,
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


                alert(
                    "User deleted successfully. 🗑️"
                );


                await loadUsers();


            } catch (error) {

                console.error(
                    "Delete User Error:",
                    error
                );


                alert(
                    "Unable to delete user."
                );
            }
        };


    // =========================
    // LOGOUT
    // =========================

    logoutButton.addEventListener(
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


    // =========================
    // HTML ESCAPE
    // =========================

    function escapeHtml(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

});