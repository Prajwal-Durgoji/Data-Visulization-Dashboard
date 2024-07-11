package com.example.nadifit.dto;

import java.util.Arrays;
import java.util.List;

public class EnergyLevelResponse {
	private int category;
    private List<String> pnames;
    private double[] pcounts;
	public int getCategory() {
		return category;
	}
	public void setCategory(int category) {
		this.category = category;
	}
	public List<String> getPnames() {
		return pnames;
	}
	public void setPnames(List<String> pnames) {
		this.pnames = pnames;
	}
	public double[] getPcounts() {
		return pcounts;
	}
	public void setPcounts(double[] pcounts) {
		this.pcounts = pcounts;
	}
	 public EnergyLevelResponse() {
	        // This is the default constructor
	    }
	@Override
	public String toString() {
		return "EnergyLevelResponse [category=" + category + ", pnames=" + pnames + ", pcounts="
				+ Arrays.toString(pcounts) + "]";
	}
    
    
	
	
	
	
	
	
	
}
