package com.gotrip.gotrip.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tourId;

    private String tourName;

    private String customerName;

    private String phone;

    private String email;

    private LocalDate travelDate;

    private Integer travellers;

    private Double pricePerPerson;

    private Double totalAmount;

    @Column(length = 10000)
    private String passengersJson;

    private String status;

    private String cancellationReason;


    // One Booking can have multiple Passengers
    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Passenger> passengers = new ArrayList<>();


    public Booking() {
    }


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public Integer getTravellers() {
        return travellers;
    }

    public void setTravellers(Integer travellers) {
        this.travellers = travellers;
    }

    public Double getPricePerPerson() {
        return pricePerPerson;
    }

    public void setPricePerPerson(Double pricePerPerson) {
        this.pricePerPerson = pricePerPerson;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public String getPassengersJson() {
        return passengersJson;
    }

    public void setPassengersJson(String passengersJson) {
        this.passengersJson = passengersJson;
    }



}