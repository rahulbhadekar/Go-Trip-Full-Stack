
package com.gotrip.gotrip.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotrip.gotrip.entity.Booking;
import com.gotrip.gotrip.entity.Passenger;
import com.gotrip.gotrip.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Save booking with passenger details
    @Transactional
    public Booking addBooking(Booking booking) {

        booking.setStatus("PENDING");
        booking.setCancellationReason(null);

        if ((booking.getPassengers() == null
                || booking.getPassengers().isEmpty())
                && booking.getPassengersJson() != null
                && !booking.getPassengersJson().isBlank()) {

            try {
                List<Passenger> passengers =
                        objectMapper.readValue(
                                booking.getPassengersJson(),
                                new TypeReference<List<Passenger>>() {}
                        );

                booking.setPassengers(passengers);

            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException(
                        "Invalid passenger details JSON.", e
                );
            }
        }

        if (booking.getPassengers() != null) {
            for (Passenger passenger : booking.getPassengers()) {
                passenger.setId(null);
                passenger.setBooking(booking);
            }
        }

        return bookingRepository.save(booking);
    }

    // Get bookings by customer email
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }

    // Confirm a pending booking
    @Transactional
    public Optional<Booking> confirmBooking(Long id) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = optionalBooking.get();

        if (!"PENDING".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException(
                    "Only pending bookings can be confirmed."
            );
        }

        booking.setStatus("CONFIRMED");

        return Optional.of(bookingRepository.save(booking));
    }

    // Cancel booking and preserve history
    @Transactional
    public Optional<Booking> cancelBooking(
            Long id, String cancellationReason) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = optionalBooking.get();

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return Optional.of(booking);
        }

        booking.setStatus("CANCELLED");
        booking.setCancellationReason(cancellationReason);

        return Optional.of(bookingRepository.save(booking));
    }

    // Delete booking when explicitly required
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
