package com.gotrip.gotrip.repository;

import com.gotrip.gotrip.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Long> {
}