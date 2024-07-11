package com.example.nadifit.dto;

import jakarta.validation.constraints.NotEmpty;

public class DistributorDetailsUpdate {
	@NotEmpty(message = "*This is Mandatory")
	private String city;
	@NotEmpty(message = "*This is Mandatory")
	private String state;
	@NotEmpty(message = "*This is Mandatory")
	private String country;
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	
	
	
}
