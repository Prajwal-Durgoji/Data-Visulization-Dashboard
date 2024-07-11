package com.example.nadifit.dto;

public class PulseChartData {
	private String user;
    private int pulseCount;
    
    
	public PulseChartData(String user, int pulseCount) {
		this.user = user;
		this.pulseCount = pulseCount;
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
		return "PulseChartData [user=" + user + ", pulseCount=" + pulseCount + "]";
	}
	
	
}
