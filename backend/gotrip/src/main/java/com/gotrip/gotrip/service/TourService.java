package com.gotrip.gotrip.service;

import com.gotrip.gotrip.entity.Tour;
import com.gotrip.gotrip.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourService {

    private final TourRepository tourRepository;

    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    // Get all tours
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    // Get tour by ID
    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    // Add new tour
    public Tour addTour(Tour tour) {
        return tourRepository.save(tour);
    }

    // Update tour
    public Tour updateTour(Long id, Tour tourDetails) {

        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        tour.setName(tourDetails.getName());
        tour.setLocation(tourDetails.getLocation());
        tour.setDescription(tourDetails.getDescription());
        tour.setDuration(tourDetails.getDuration());
        tour.setPrice(tourDetails.getPrice());
        tour.setRating(tourDetails.getRating());
        tour.setImage(tourDetails.getImage());
        tour.setCategory(tourDetails.getCategory());

        return tourRepository.save(tour);
    }

    // Delete tour
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}