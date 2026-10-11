package com.gotrip.gotrip.controller;

import com.gotrip.gotrip.entity.Booking;
import com.gotrip.gotrip.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    // =====================================================
    // GET ALL BOOKINGS
    // ADMIN USES THIS
    // =====================================================

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }


    // =====================================================
    // GET BOOKING BY ID
    // ADMIN = ANY BOOKING
    // USER = ONLY OWN BOOKING
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        Optional<Booking> optionalBooking =
                bookingService.getBookingById(id);

        if (optionalBooking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = optionalBooking.get();

        String loggedInEmail =
                authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"));

        // ADMIN can access any booking
        if (isAdmin) {
            return ResponseEntity.ok(booking);
        }

        // USER can access only own booking
        if (booking.getEmail() == null ||
                !booking.getEmail()
                        .equalsIgnoreCase(loggedInEmail)) {

            return ResponseEntity
                    .status(403)
                    .build();
        }

        return ResponseEntity.ok(booking);
    }


    // =====================================================
    // GET BOOKINGS BY EMAIL
    // USER = JWT EMAIL ONLY
    // ADMIN = REQUESTED EMAIL
    // =====================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Booking>> getBookingsByEmail(
            @PathVariable String email,
            Authentication authentication) {

        String loggedInEmail =
                authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"));

        // ADMIN
        if (isAdmin) {

            return ResponseEntity.ok(
                    bookingService.getBookingsByEmail(email)
            );
        }

        // USER
        // URL me jo email aaye usko trust nahi karna.
        // JWT ke logged-in email ki bookings hi return hongi.

        return ResponseEntity.ok(
                bookingService.getBookingsByEmail(
                        loggedInEmail
                )
        );
    }


    // =====================================================
    // CREATE BOOKING
    // BOOKING AUTOMATICALLY LINKED TO LOGGED-IN USER
    // =====================================================


    @PostMapping
    public ResponseEntity<?> addBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401)
                    .body("Please login before creating a booking.");
        }

        try {
            booking.setEmail(authentication.getName());

            Booking savedBooking =
                    bookingService.addBooking(booking);

            return ResponseEntity.ok(savedBooking);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }




    // Confirm booking - ADMIN ONLY
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null
                || authentication.getAuthorities().stream()
                .noneMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403)
                    .body("Only admin can confirm bookings.");
        }

        try {
            Optional<Booking> confirmedBooking =
                    bookingService.confirmBooking(id);

            if (confirmedBooking.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(confirmedBooking.get());

        } catch (IllegalStateException e) {
            return ResponseEntity.status(409)
                    .body(e.getMessage());
        }
    }




    // =====================================================
    // CANCEL BOOKING
    // USER = OWN BOOKING
    // ADMIN = ANY BOOKING
    // =====================================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            @RequestParam String reason,
            Authentication authentication) {

        Optional<Booking> optionalBooking =
                bookingService.getBookingById(id);

        if (optionalBooking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                optionalBooking.get();

        String loggedInEmail =
                authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"));

        // USER cannot cancel someone else's booking
        if (!isAdmin &&
                (booking.getEmail() == null ||
                        !booking.getEmail()
                                .equalsIgnoreCase(loggedInEmail))) {

            return ResponseEntity
                    .status(403)
                    .build();
        }

        return bookingService
                .cancelBooking(id, reason)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // DELETE BOOKING
    //
    // ADMIN = CAN DELETE ANY BOOKING
    //
    // USER = CAN DELETE ONLY OWN CANCELLED BOOKING
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(
            @PathVariable Long id,
            Authentication authentication) {

        Optional<Booking> optionalBooking =
                bookingService.getBookingById(id);

        if (optionalBooking.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        Booking booking =
                optionalBooking.get();

        String loggedInEmail =
                authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"));


        // =================================================
        // ADMIN
        // =================================================

        if (isAdmin) {

            bookingService.deleteBooking(id);

            return ResponseEntity.ok(
                    "Booking deleted successfully"
            );
        }


        // =================================================
        // USER
        // =================================================

        // User can delete ONLY their own booking
        if (booking.getEmail() == null ||
                !booking.getEmail()
                        .equalsIgnoreCase(loggedInEmail)) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You can only delete your own booking."
                    );
        }


        // User can delete ONLY cancelled booking
        if (!"CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "Only cancelled bookings can be deleted."
                    );
        }


        bookingService.deleteBooking(id);

        return ResponseEntity.ok(
                "Booking deleted successfully"
        );
    }
}