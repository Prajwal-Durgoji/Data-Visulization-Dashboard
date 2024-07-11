package com.example.nadifit.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Distributor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private int age;
//	@DecimalMin(value = "6000000000", message = "*Enter Proper Mobile Number")
//	@DecimalMax(value = "9999999999", message = "*Enter Proper Mobile Number")
	private String phoneNumber;
	private String gender;
	private String email;
	private String country;
	private String state;
	private String city;
	
	private LocalDate dateCreated;
	private String password;
	
//	@OneToMany(mappedBy = "createdByDistributor")
//	private List<User> createdUsers;
	
	@OneToMany(mappedBy = "distributor",fetch = FetchType.EAGER)
	private List<UserCredentails> userCredentialsList;
	
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
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

	public LocalDate getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(LocalDate dateCreated) {
		this.dateCreated = dateCreated;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<UserCredentails> getUserCredentialsList() {
		return userCredentialsList;
	}

	public void setUserCredentialsList(List<UserCredentails> userCredentialsList) {
		this.userCredentialsList = userCredentialsList;
	}

	@Override
	public String toString() {
		return "Distributor [id=" + id + ", name=" + name + ", age=" + age + ", phoneNumber=" + phoneNumber
				+ ", gender=" + gender + ", email=" + email + ", country=" + country + ", state=" + state + ", city="
				+ city + ", dateCreated=" + dateCreated + ", password=" + password + ", userCredentialsList="
				+ userCredentialsList + "]";
	}

	public DistributorInfo toDistributorInfo() {
		DistributorInfo distributorInfo = new DistributorInfo();
	    distributorInfo.setName(this.getName());
	    distributorInfo.setPhoneNumber(this.getPhoneNumber());
	    distributorInfo.setDateCreated(this.getDateCreated());
	    return distributorInfo;
	}
	
	
}
