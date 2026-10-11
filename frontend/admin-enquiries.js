document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("enquiriesContainer");
    const token = localStorage.getItem("goTripToken");

    const totalElement = document.getElementById("totalEnquiries");
    const newElement = document.getElementById("newEnquiries");
    const resolvedElement = document.getElementById("resolvedEnquiries");
    const statusFilter = document.getElementById("statusFilter");
    const logoutBtn = document.getElementById("logoutBtn");

    const API_URL = "http://localhost:8080/api/contact-enquiries";

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("goTripToken");
            localStorage.removeItem("goTripUser");
            window.location.href = "index.html";
        });
    }

    if (!container) return;

    if (!token) {
        container.innerHTML = `
            <div class="enquiries-empty">
                Please login as admin to view enquiries.
                <br><br>
                <button type="button"
                    onclick="window.location.href='index.html'">
                    Go to Login
                </button>
            </div>
        `;
        return;
    }

    let allEnquiries = [];

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function updateStats() {
        totalElement.textContent = allEnquiries.length;

        newElement.textContent = allEnquiries.filter(
            enquiry => (enquiry.status || "NEW") === "NEW"
        ).length;

        resolvedElement.textContent = allEnquiries.filter(
            enquiry => enquiry.status === "RESOLVED"
        ).length;
    }

    function renderEnquiries() {
        const selectedStatus = statusFilter.value;

        const filtered = allEnquiries.filter(enquiry =>
            selectedStatus === "ALL" ||
            (enquiry.status || "NEW") === selectedStatus
        );

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="enquiries-empty">
                    <h3>No enquiries found</h3>
                    <p>Customer messages will appear here when submitted.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(enquiry => {
            const status = enquiry.status || "NEW";

            return `
                <article class="enquiry-card">
                    <div class="enquiry-card-header">
                        <div>
                            <h3>${escapeHTML(enquiry.name)}</h3>
                            <div class="enquiry-email">
                                ${escapeHTML(enquiry.email)}
                            </div>
                        </div>

                        <span class="enquiry-status status-${escapeHTML(status)}">
                            ${escapeHTML(status.replace("_", " "))}
                        </span>
                    </div>

                    <div class="enquiry-details">
                        <div class="enquiry-detail">
                            <span>Enquiry ID</span>
                            <strong>#${escapeHTML(enquiry.id)}</strong>
                        </div>

                        <div class="enquiry-detail">
                            <span>Phone</span>
                            <strong>${escapeHTML(enquiry.phone)}</strong>
                        </div>

                        <div class="enquiry-detail">
                            <span>Subject</span>
                            <strong>${escapeHTML(enquiry.subject)}</strong>
                        </div>

                        <div class="enquiry-detail">
                            <span>Submitted At</span>
                            <strong>
                                ${escapeHTML(
                                    enquiry.createdAt
                                        ? new Date(enquiry.createdAt).toLocaleString("en-IN")
                                        : "-"
                                )}
                            </strong>
                        </div>
                    </div>

                    <p class="enquiry-message">${escapeHTML(enquiry.message)}</p>

                    <div class="enquiry-actions">
                        <select id="status-${Number(enquiry.id)}"
                                aria-label="Change enquiry status">
                            <option value="NEW" ${status === "NEW" ? "selected" : ""}>
                                New
                            </option>
                            <option value="IN_PROGRESS" ${status === "IN_PROGRESS" ? "selected" : ""}>
                                In Progress
                            </option>
                            <option value="RESOLVED" ${status === "RESOLVED" ? "selected" : ""}>
                                Resolved
                            </option>
                        </select>

                        <button type="button"
                            onclick="updateEnquiryStatus(${Number(enquiry.id)})">
                            Update Status
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    }

    async function loadEnquiries() {
        container.innerHTML = `
            <div class="enquiries-empty">Loading enquiries...</div>
        `;

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                container.innerHTML = `
                    <div class="enquiries-empty">
                        Access denied. Please login with an admin account.
                    </div>
                `;
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            allEnquiries = await response.json();

            if (!Array.isArray(allEnquiries)) {
                throw new Error("Unexpected response from server.");
            }

            updateStats();
            renderEnquiries();

        } catch (error) {
            console.error("Load Enquiries Error:", error);

            container.innerHTML = `
                <div class="enquiries-empty">
                    Unable to load enquiries.
                    Please check that the backend is running.
                </div>
            `;
        }
    }

    window.updateEnquiryStatus = async function (id) {
    const select = document.getElementById(`status-${id}`);

    if (!select) return;

    const button = select.parentElement.querySelector("button");

    if (!button) return;

    const originalText = button.textContent;

    try {
        button.disabled = true;
        button.textContent = "Updating...";

        const response = await fetch(
            `${API_URL}/${id}/status`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: select.value
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        const updatedEnquiry = await response.json();

        allEnquiries = allEnquiries.map(enquiry =>
            Number(enquiry.id) === Number(id)
                ? updatedEnquiry
                : enquiry
        );

        updateStats();
        renderEnquiries();

        alert("Enquiry status updated successfully!");

    } catch (error) {
        console.error("Update Enquiry Error:", error);
        alert("Status update nahi hua. Console mein error check karo.");
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
};

    statusFilter.addEventListener("change", renderEnquiries);

    await loadEnquiries();
});