package com.gotrip.gotrip.controller;

import com.gotrip.gotrip.entity.Tour;
import com.gotrip.gotrip.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    // Get all tours
    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }

    // Get tour by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {

        return tourService.getTourById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add new tour
    @PostMapping
    public Tour addTour(@RequestBody Tour tour) {
        return tourService.addTour(tour);
    }

    // Update tour
    @PutMapping("/{id}")
    public Tour updateTour(
            @PathVariable Long id,
            @RequestBody Tour tour) {

        return tourService.updateTour(id, tour);
    }

    // Delete tour
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTour(@PathVariable Long id) {

        tourService.deleteTour(id);

        return ResponseEntity.ok("Tour deleted successfully");
    }
}