package com.gotrip.gotrip.controller;

import com.gotrip.gotrip.entity.ContactEnquiry;
import com.gotrip.gotrip.repository.ContactEnquiryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-enquiries")
public class ContactEnquiryController {

    private final ContactEnquiryRepository repository;

    public ContactEnquiryController(
            ContactEnquiryRepository repository) {
        this.repository = repository;
    }

    // Customer submits a new enquiry
    @PostMapping
    public ResponseEntity<?> createEnquiry(
            @RequestBody ContactEnquiry enquiry) {

        if (enquiry.getName() == null
                || enquiry.getName().isBlank()
                || enquiry.getEmail() == null
                || enquiry.getEmail().isBlank()
                || enquiry.getPhone() == null
                || enquiry.getPhone().isBlank()
                || enquiry.getMessage() == null
                || enquiry.getMessage().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Please fill all required fields.");
        }

        // Customer cannot set the status or creation time
        enquiry.setId(null);
        enquiry.setStatus("NEW");
        enquiry.setCreatedAt(null);

        ContactEnquiry saved =
                repository.save(enquiry);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    // Admin views all enquiries
    @GetMapping
    public ResponseEntity<?> getAllEnquiries() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {

        java.util.Optional<ContactEnquiry> optionalEnquiry =
                repository.findById(id);

        if (optionalEnquiry.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String status = request.get("status");

        if (status == null ||
                !java.util.Set.of("NEW", "IN_PROGRESS", "RESOLVED")
                        .contains(status)) {
            return ResponseEntity.badRequest()
                    .body("Invalid enquiry status.");
        }

        ContactEnquiry enquiry = optionalEnquiry.get();
        enquiry.setStatus(status);

        ContactEnquiry updated = repository.save(enquiry);

        return ResponseEntity.ok(updated);
    }


}