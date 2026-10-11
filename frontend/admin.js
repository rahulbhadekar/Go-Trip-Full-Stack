document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("goTripToken");
    const userData = localStorage.getItem("goTripUser");

    // ================= SECURITY CHECK =================

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


    // ================= ADMIN NAME =================

    const adminName =
        document.getElementById("adminName");

    if (adminName) {
        adminName.textContent =
            user.name || "Go Trip Admin";
    }


    // ================= LOGOUT =================

    const logoutButton =
        document.getElementById("adminLogoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            localStorage.removeItem("goTripToken");
            localStorage.removeItem("goTripUser");

            window.location.href = "index.html";
        });
    }


    // ================= LOAD DASHBOARD =================

    loadAdminDashboard();
});


async function loadAdminDashboard() {

    const token =
        localStorage.getItem("goTripToken");

    try {

        const headers = {
            "Authorization": `Bearer ${token}`
        };


        // ================= FETCH TOURS =================

        const toursResponse = await fetch(
            "http://localhost:8080/api/tours",
            {
                headers: headers
            }
        );

        if (!toursResponse.ok) {
            throw new Error("Unable to load tours.");
        }

        const tours =
            await toursResponse.json();


        // ================= FETCH BOOKINGS =================

        const bookingsResponse = await fetch(
            "http://localhost:8080/api/bookings",
            {
                headers: headers
            }
        );

        if (!bookingsResponse.ok) {
            throw new Error("Unable to load bookings.");
        }

        const bookings =
            await bookingsResponse.json();


        // ================= FETCH USERS =================

        const usersResponse = await fetch(
            "http://localhost:8080/api/users",
            {
                headers: headers
            }
        );

        if (!usersResponse.ok) {
            throw new Error("Unable to load users.");
        }

        const users =
            await usersResponse.json();


        // ================= CALCULATE =================

        const totalTours =
            tours.length;

        const totalBookings =
            bookings.length;

        const totalUsers =
            users.length;

        const cancelledBookings =
            bookings.filter(
                booking =>
                    booking.status === "CANCELLED"
            ).length;


        // ================= UPDATE CARDS =================

        document.getElementById("totalTours").textContent =
            totalTours;

        document.getElementById("totalBookings").textContent =
            totalBookings;

        document.getElementById("totalUsers").textContent =
            totalUsers;

        document.getElementById("cancelledBookings").textContent =
            cancelledBookings;


        // ================= RECENT BOOKINGS =================

        loadRecentBookings(bookings);


    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

        document.getElementById("totalTours").textContent = "—";
        document.getElementById("totalBookings").textContent = "—";
        document.getElementById("totalUsers").textContent = "—";
        document.getElementById("cancelledBookings").textContent = "—";

        const recent =
            document.getElementById("recentBookings");

        if (recent) {

            recent.innerHTML = `
                <div class="admin-loading">
                    Unable to load dashboard data.
                    Please make sure the backend is running.
                </div>
            `;
        }
    }
}


// ================= RECENT BOOKINGS =================

function loadRecentBookings(bookings) {

    const container =
        document.getElementById("recentBookings");

    if (!container) return;


    if (!bookings || bookings.length === 0) {

        container.innerHTML = `
            <div class="admin-loading">
                No bookings available yet.
            </div>
        `;

        return;
    }


    // Latest bookings first
    const recentBookings =
        [...bookings]
            .sort(
                (a, b) =>
                    Number(b.id) - Number(a.id)
            )
            .slice(0, 5);


    container.innerHTML =
        recentBookings.map(booking => {

            const status =
                booking.status || "PENDING";

            return `
                <div class="admin-booking-row">

                    <div>
                        <span>Booking</span>
                        <strong>#${booking.id}</strong>
                    </div>

                    <div>
                        <span>Tour</span>
                        <strong>
                            ${booking.tourName || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Customer</span>
                        <strong>
                            ${booking.customerName || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Travellers</span>
                        <strong>
                            ${booking.travellers || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Total</span>
                        <strong>
                            ₹${Number(
                                booking.totalAmount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong class="admin-booking-status ${status.toLowerCase()}">
                            ${status}
                        </strong>
                    </div>

                </div>
            `;

        }).join("");
}