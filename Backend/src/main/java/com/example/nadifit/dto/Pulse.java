package com.example.nadifit.dto;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pulse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private LocalDate dateCreated;
	private String user;
	private int pulseCount;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LocalDate getDateCreated() {
		return dateCreated;
	}
	public void setDateCreated(LocalDate dateCreated) {
		this.dateCreated = dateCreated;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public int getPulseCount() {
		return pulseCount;
	}
	public void setPulseCount(int pulseCount) {
		this.pulseCount = pulseCount;
	}
	@Override
	public String toString() {
		return "Pulse [id=" + id + ", dateCreated=" + dateCreated + ", user=" + user + ", pulseCount=" + pulseCount
				+ "]";
	}
	
	
	

}
