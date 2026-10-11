package com.gotrip.gotrip.repository;

import com.gotrip.gotrip.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByEmail(String email);

}