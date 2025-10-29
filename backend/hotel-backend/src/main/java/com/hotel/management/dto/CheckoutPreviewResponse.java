package com.hotel.management.dto;

public class CheckoutPreviewResponse {

    private double totalWeekdays;
    private double totalWeekends;
    private double parkingWeekdays;
    private double parkingWeekends;
    private double extraFees;
    private double totalAmount;

    public CheckoutPreviewResponse() {
    }

    public double getTotalWeekdays() {
        return totalWeekdays;
    }

    public void setTotalWeekdays(double totalWeekdays) {
        this.totalWeekdays = totalWeekdays;
    }

    public double getTotalWeekends() {
        return totalWeekends;
    }

    public void setTotalWeekends(double totalWeekends) {
        this.totalWeekends = totalWeekends;
    }

    public double getParkingWeekdays() {
        return parkingWeekdays;
    }

    public void setParkingWeekdays(double parkingWeekdays) {
        this.parkingWeekdays = parkingWeekdays;
    }

    public double getParkingWeekends() {
        return parkingWeekends;
    }

    public void setParkingWeekends(double parkingWeekends) {
        this.parkingWeekends = parkingWeekends;
    }

    public double getExtraFees() {
        return extraFees;
    }

    public void setExtraFees(double extraFees) {
        this.extraFees = extraFees;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
