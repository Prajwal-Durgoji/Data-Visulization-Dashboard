package com.example.nadifit.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class EnergyLevelChart {
	@Id
	private Long pid;
	private String pname;
	private double pcount;
	private int category;
	
	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
	}
	public String getPname() {
		return pname;
	}
	public void setPname(String pname) {
		this.pname = pname;
	}
	public double getPcount() {
		return pcount;
	}
	public void setPcount(double pcount) {
		this.pcount = pcount;
	}
	public int getCategory() {
		return category;
	}
	public void setCategory(int category) {
		this.category = category;
	}
	@Override
	public String toString() {
		return "EnergyLevelChart [pid=" + pid + ", pname=" + pname + ", pcount=" + pcount + ", category=" + category
				+ "]";
	}
	public EnergyLevelChart() {
		
	}
	
	
	
	
	
	
	

	
	
}
