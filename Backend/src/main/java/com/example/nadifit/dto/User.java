package com.example.nadifit.dto;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String email; // <------->
	private String distributor;
	private String phoneNumber;
	private int age;
	private String gender;
	private String houseNo;
	private String address;
	private String landMark;
	private int pinCode;
	private String country;
	private String state;
	private String city;
	private LocalDate dateCreated; // <------->
	private String password;
	private int pulseCount; // <------->
	private LocalDate rechargeDate;
	private int macid;
	private LocalDate activatedDate;
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getDistributor() {
		return distributor;
	}
	public void setDistributor(String distributor) {
		this.distributor = distributor;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getHouseNo() {
		return houseNo;
	}
	public void setHouseNo(String houseNo) {
		this.houseNo = houseNo;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getLandMark() {
		return landMark;
	}
	public void setLandMark(String landMark) {
		this.landMark = landMark;
	}
	public int getPinCode() {
		return pinCode;
	}
	public void setPinCode(int pinCode) {
		this.pinCode = pinCode;
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
	public int getPulseCount() {
		return pulseCount;
	}
	public void setPulseCount(int pulseCount) {
		this.pulseCount = pulseCount;
	}
	public LocalDate getRechargeDate() {
		return rechargeDate;
	}
	public void setRechargeDate(LocalDate rechargeDate) {
		this.rechargeDate = rechargeDate;
	}
	public int getMacid() {
		return macid;
	}
	public void setMacid(int macid) {
		this.macid = macid;
	}
	public LocalDate getActivatedDate() {
		return activatedDate;
	}
	public void setActivatedDate(LocalDate activatedDate) {
		this.activatedDate = activatedDate;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", distributor=" + distributor
				+ ", phoneNumber=" + phoneNumber + ", age=" + age + ", gender=" + gender + ", houseNo=" + houseNo
				+ ", address=" + address + ", landMark=" + landMark + ", pinCode=" + pinCode + ", country=" + country
				+ ", state=" + state + ", city=" + city + ", dateCreated=" + dateCreated + ", password=" + password
				+ ", pulseCount=" + pulseCount + ", rechargeDate=" + rechargeDate + ", macid=" + macid
				+ ", activatedDate=" + activatedDate + "]";
	}

}
