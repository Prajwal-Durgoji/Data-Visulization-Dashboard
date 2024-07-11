package com.example.nadifit.dto;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AdminViewOrders {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "userName")
    private String uservalidate;
	
	private String phoneNumber;
	
	private String state;
	
	private String city;
	
	private String country;
	
	@Column(name = "DistrubutorRef")
	private String distributorName;
	
	private LocalDate dateCreated;
	
	public String getDistributorName() {
		return distributorName;
	}

	public void setDistributorName(String distributorName) {
		this.distributorName = distributorName;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUservalidate() {
		return uservalidate;
	}

	public void setUservalidate(String uservalidate) {
		this.uservalidate = uservalidate;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
	

	public LocalDate getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(LocalDate dateCreated) {
		this.dateCreated = dateCreated;
	}

	@Override
	public String toString() {
		return "AdminViewOrders [id=" + id + ", uservalidate=" + uservalidate + ", phoneNumber=" + phoneNumber
				+ ", state=" + state + ", city=" + city + ", country=" + country + ", distributorName="
				+ distributorName + ", dateCreated=" + dateCreated + "]";
	}
	
	


}
