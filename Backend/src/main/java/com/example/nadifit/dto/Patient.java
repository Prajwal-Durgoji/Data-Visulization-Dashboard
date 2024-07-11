package com.example.nadifit.dto;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Patient {
	
	@Id
	private Long patient_id;
	private String patient_name;
	private String age;
	private String gender;
	private String height;
	private String weight;
	private LocalDate report_date;
	private String report_time;
	public Long getPatient_id() {
		return patient_id;
	}
	public void setPatient_id(Long patient_id) {
		this.patient_id = patient_id;
	}
	public String getPatient_name() {
		return patient_name;
	}
	public void setPatient_name(String patient_name) {
		this.patient_name = patient_name;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getWeight() {
		return weight;
	}
	public void setWeight(String weight) {
		this.weight = weight;
	}
	public LocalDate getReport_date() {
		return report_date;
	}
	public void setReport_date(LocalDate report_date) {
		this.report_date = report_date;
	}
	public String getReport_time() {
		return report_time;
	}
	public void setReport_time(String report_time) {
		this.report_time = report_time;
	}
	@Override
	public String toString() {
		return "Report [patient_id=" + patient_id + ", patient_name=" + patient_name + ", age=" + age + ", gender="
				+ gender + ", height=" + height + ", weight=" + weight + ", report_date=" + report_date
				+ ", report_time=" + report_time + "]";
	}
	
	
	
	
	
	
	
	
	
	
}
