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

    const bookingsContainer =
        document.getElementById("adminBookingsContainer");

    const statusFilter =
        document.getElementById("bookingStatusFilter");

    const passengerModal =
        document.getElementById("adminPassengerModal");

    const closePassengerModal =
        document.getElementById("closePassengerModal");

    const logoutButton =
        document.getElementById("adminBookingsLogoutBtn");


    let allBookings = [];


    // ================= LOAD BOOKINGS =================

    loadBookings();


    async function loadBookings() {

        bookingsContainer.innerHTML = `
            <div class="admin-booking-loading">
                Loading bookings...
            </div>
        `;

        try {

            const response = await fetch(
                "http://localhost:8080/api/bookings",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Unable to load bookings: HTTP ${response.status}`
                );
            }

            allBookings = await response.json();

            updateBookingStats();

            renderBookings(allBookings);

        } catch (error) {

            console.error(
                "Admin Bookings Error:",
                error
            );

            bookingsContainer.innerHTML = `
                <div class="admin-booking-loading">
                    Unable to load bookings.
                    Please make sure the Spring Boot backend is running.
                </div>
            `;
        }
    }


    // ================= STATISTICS =================

    function updateBookingStats() {

        const total =
            allBookings.length;

        const pending =
            allBookings.filter(
                booking =>
                    booking.status === "PENDING"
            ).length;

        const cancelled =
            allBookings.filter(
                booking =>
                    booking.status === "CANCELLED"
            ).length;

        const revenue =
            allBookings
                .filter(
                    booking =>
                        booking.status !== "CANCELLED"
                )
                .reduce(
                    (sum, booking) =>
                        sum + Number(
                            booking.totalAmount || 0
                        ),
                    0
                );


        document.getElementById(
            "bookingTotalCount"
        ).textContent = total;


        document.getElementById(
            "bookingPendingCount"
        ).textContent = pending;


        document.getElementById(
            "bookingCancelledCount"
        ).textContent = cancelled;


        document.getElementById(
            "bookingRevenue"
        ).textContent =
            `₹${revenue.toLocaleString("en-IN")}`;
    }


    // ================= RENDER BOOKINGS =================

    function renderBookings(bookings) {

        if (!bookings.length) {

            bookingsContainer.innerHTML = `
                <div class="admin-booking-loading">
                    No bookings found.
                </div>
            `;

            return;
        }


        const sortedBookings =
            [...bookings].sort(
                (a, b) =>
                    Number(b.id) - Number(a.id)
            );


        bookingsContainer.innerHTML =
            sortedBookings.map(
                booking => {

                    const status =
                        booking.status || "PENDING";

                    const isCancelled =
                        status === "CANCELLED";


                    return `
                        <article
                            class="admin-booking-card">

                            <!-- CARD TOP -->

                            <div
                                class="admin-booking-card-top">

                                <div>

                                    <div
                                        class="admin-booking-tour-label">
                                        TRAVEL BOOKING
                                    </div>

                                    <h3>
                                        ${escapeHtml(
                                            booking.tourName ||
                                            "Go Trip Tour"
                                        )}
                                    </h3>

                                    <div
                                        class="admin-booking-id">
                                        Booking ID #${booking.id}
                                    </div>

                                </div>


                                <span
                                    class="admin-booking-status ${status.toLowerCase()}">

                                    ${escapeHtml(status)}

                                </span>

                            </div>


                            <!-- BOOKING INFO -->

                            <div
                                class="admin-booking-info-grid">

                                <div
                                    class="admin-booking-info-item">

                                    <span>
                                        Travel Date
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            booking.travelDate ||
                                            "-"
                                        )}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-info-item">

                                    <span>
                                        Travellers
                                    </span>

                                    <strong>
                                        ${booking.travellers || 0}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-info-item">

                                    <span>
                                        Price / Person
                                    </span>

                                    <strong>
                                        ₹${Number(
                                            booking.pricePerPerson ||
                                            0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-info-item">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹${Number(
                                            booking.totalAmount ||
                                            0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-info-item">

                                    <span>
                                        Passengers
                                    </span>

                                    <strong>
                                        ${
                                            Array.isArray(
                                                booking.passengers
                                            )
                                                ? booking.passengers.length
                                                : booking.travellers || 0
                                        }
                                    </strong>

                                </div>

                            </div>


                            <!-- CUSTOMER -->

                            <div
                                class="admin-booking-customer">

                                <div
                                    class="admin-booking-customer-item">

                                    <span>
                                        Customer
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            booking.customerName ||
                                            "-"
                                        )}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-customer-item">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            booking.phone ||
                                            "-"
                                        )}
                                    </strong>

                                </div>


                                <div
                                    class="admin-booking-customer-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            booking.email ||
                                            "-"
                                        )}
                                    </strong>

                                </div>

                            </div>


                            ${
                                isCancelled &&
                                booking.cancellationReason
                                    ? `
                                        <div
                                            class="admin-booking-cancellation">

                                            <span>
                                                Cancellation Reason
                                            </span>

                                            <p>
                                                ${escapeHtml(
                                                    booking.cancellationReason
                                                )}
                                            </p>

                                        </div>
                                      `
                                    : ""
                            }


                            <!-- ACTIONS -->

                            
<!-- ACTIONS -->
<div class="admin-booking-actions">

    <button
        type="button"
        class="admin-booking-passenger-btn"
        onclick="viewAdminPassengers(${booking.id})">
        👥 View Passengers
    </button>

    ${
        isCancelled
            ? `
                <button
                    type="button"
                    class="admin-booking-delete-btn"
                    onclick="deleteAdminBooking(${booking.id})">
                    🗑️ Delete
                </button>
            `
            : `
                ${
                    booking.status === "PENDING"
                        ? `
                            <button
                                type="button"
                                class="admin-booking-confirm-btn"
                                onclick="confirmAdminBooking(${booking.id})">
                                ✅ Confirm Booking
                            </button>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="admin-booking-cancel-btn"
                    onclick="cancelAdminBooking(${booking.id})">
                    Cancel Booking
                </button>
            `
    }

</div>


                        </article>
                    `;

                }
            ).join("");
    }


    // ================= FILTER =================

    statusFilter.addEventListener(
        "change",
        () => {

            const selected =
                statusFilter.value;

            if (selected === "ALL") {

                renderBookings(allBookings);

                return;
            }


            const filtered =
                allBookings.filter(
                    booking =>
                        booking.status === selected
                );


            renderBookings(filtered);
        }
    );


    // ================= VIEW PASSENGERS =================

    window.viewAdminPassengers =
        async function (bookingId) {

            try {

                const response =
                    await fetch(
                        `http://localhost:8080/api/bookings/${bookingId}`,
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
                        "Unable to load booking."
                    );
                }


                const booking =
                    await response.json();


                const passengers =
                    booking.passengers || [];


                document.getElementById(
                    "passengerBookingInfo"
                ).textContent =
                    `Booking #${booking.id} • ${booking.tourName || "Go Trip Tour"}`;


                const container =
                    document.getElementById(
                        "adminPassengersContainer"
                    );


                if (!passengers.length) {

                    container.innerHTML = `
                        <div class="admin-booking-loading">
                            No passenger details available.
                        </div>
                    `;

                } else {

                    container.innerHTML =
                        passengers.map(
                            (passenger, index) => {

                                return `
                                    <div
                                        class="admin-passenger-card">

                                        <div
                                            class="admin-passenger-number">
                                            PASSENGER ${index + 1}
                                        </div>

                                        <div
                                            class="admin-passenger-name">
                                            ${escapeHtml(
                                                passenger.name ||
                                                "-"
                                            )}
                                        </div>


                                        <div
                                            class="admin-passenger-details">

                                            <div
                                                class="admin-passenger-detail">

                                                <span>
                                                    Age
                                                </span>

                                                <strong>
                                                    ${passenger.age || "-"}
                                                </strong>

                                            </div>


                                            <div
                                                class="admin-passenger-detail">

                                                <span>
                                                    Mobile
                                                </span>

                                                <strong>
                                                    ${escapeHtml(
                                                        passenger.mobile ||
                                                        "-"
                                                    )}
                                                </strong>

                                            </div>


                                            <div
                                                class="admin-passenger-detail">

                                                <span>
                                                    Email
                                                </span>

                                                <strong>
                                                    ${escapeHtml(
                                                        passenger.email ||
                                                        "Not provided"
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>
                                `;

                            }
                        ).join("");
                }


                passengerModal.classList.add("open");

                passengerModal.setAttribute(
                    "aria-hidden",
                    "false"
                );


            } catch (error) {

                console.error(
                    "Passenger Details Error:",
                    error
                );

                alert(
                    "Unable to load passenger details."
                );
            }
        };


    // ================= CLOSE PASSENGER MODAL =================

    closePassengerModal.addEventListener(
        "click",
        closePassengerDetails
    );


    passengerModal.addEventListener(
        "click",
        event => {

            if (
                event.target === passengerModal
            ) {
                closePassengerDetails();
            }

        }
    );


    function closePassengerDetails() {

        passengerModal.classList.remove(
            "open"
        );

        passengerModal.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    
async function confirmAdminBooking(id) {
    const confirmed = window.confirm(
        "Are you sure you want to confirm this booking?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("goTripToken");

    if (!token) {
        alert("Please login again.");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/api/bookings/${id}/confirm`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                message || `Request failed: ${response.status}`
            );
        }

        alert("Booking confirmed successfully!");
        await loadBookings();

    } catch (error) {
        console.error("Confirm booking error:", error);
        alert("Could not confirm booking: " + error.message);
    }
}



    // ================= CANCEL BOOKING =================

    window.cancelAdminBooking =
        async function (id) {

            const reason =
                prompt(
                    "Enter cancellation reason:"
                );


            if (reason === null) {
                return;
            }


            const trimmedReason =
                reason.trim();


            if (!trimmedReason) {

                alert(
                    "Cancellation reason is required."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `http://localhost:8080/api/bookings/${id}/cancel?reason=${encodeURIComponent(trimmedReason)}`,
                        {
                            method: "PUT",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Cancellation failed: HTTP ${response.status}`
                    );
                }


                alert(
                    "Booking cancelled successfully. ✅"
                );


                await loadBookings();


            } catch (error) {

                console.error(
                    "Cancel Booking Error:",
                    error
                );

                alert(
                    "Unable to cancel booking."
                );
            }
        };


    // ================= DELETE BOOKING =================

    window.deleteAdminBooking =
        async function (id) {

            const confirmed =
                confirm(
                    "Are you sure you want to permanently delete this cancelled booking?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `http://localhost:8080/api/bookings/${id}`,
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
                    "Booking deleted successfully. 🗑️"
                );


                await loadBookings();


            } catch (error) {

                console.error(
                    "Delete Booking Error:",
                    error
                );

                alert(
                    "Unable to delete booking."
                );
            }
        };


    // ================= LOGOUT =================

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



window.confirmAdminBooking = async function (id) {
    const confirmed = window.confirm(
        "Are you sure you want to confirm this booking?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("goTripToken");

    if (!token) {
        alert("Please login again.");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/api/bookings/${id}/confirm`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                message || `Request failed: ${response.status}`
            );
        }

        alert("Booking confirmed successfully!");

        if (typeof loadBookings === "function") {
            await loadBookings();
        } else {
            window.location.reload();
        }

    } catch (error) {
        console.error("Confirm booking error:", error);
        alert("Could not confirm booking: " + error.message);
    }
};
