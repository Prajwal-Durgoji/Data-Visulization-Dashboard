package com.example.nadifit.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.Pulse;
import com.example.nadifit.repository.PulseRepository;

@Service
public class PulseService {
	
	@Autowired
	PulseRepository pulseRepository;

	public List<Pulse> getAllPulses() {
		return pulseRepository.findAll();
	}
	
	public List<Pulse> preprocessPulseList(List<Pulse> pulseList) {
	    Map<String, Map<LocalDate, Integer>> userDatePulseCountMap = new LinkedHashMap<>();

	    // Aggregate pulse counts by user and date created
	    for (Pulse pulse : pulseList) {
	        String user = pulse.getUser();
	        LocalDate dateCreated = pulse.getDateCreated();
	        int pulseCount = pulse.getPulseCount(); // Assuming you have a getter for pulseCount
	        
	        // Create a new map for the user if not present
	        userDatePulseCountMap.putIfAbsent(user, new LinkedHashMap<>());
	        
	        // Aggregate pulse counts for the date for the user
	        userDatePulseCountMap.get(user).merge(dateCreated, pulseCount, Integer::sum);
	    }

	    // Create a new list of pulses with aggregated pulse counts
	    List<Pulse> processedPulseList = new ArrayList<>();
	    for (Map.Entry<String, Map<LocalDate, Integer>> userEntry : userDatePulseCountMap.entrySet()) {
	        String user = userEntry.getKey();
	        Map<LocalDate, Integer> datePulseCountMap = userEntry.getValue();
	        
	        for (Map.Entry<LocalDate, Integer> dateEntry : datePulseCountMap.entrySet()) {
	            LocalDate dateCreated = dateEntry.getKey();
	            int pulseCount = dateEntry.getValue();
	            
	            // Create a new pulse with aggregated pulse count
	            Pulse processedPulse = new Pulse();
	            processedPulse.setDateCreated(dateCreated);
	            processedPulse.setUser(user);
	            processedPulse.setPulseCount(pulseCount); // Set aggregated pulse count
	            processedPulseList.add(processedPulse);
	        }
	    }
	 // Sort the processedPulseList based on dateCreated in ascending order
	    Collections.sort(processedPulseList, Comparator.comparing(Pulse::getDateCreated).reversed());
	    return processedPulseList;
	}


	public List<Pulse> getPulsesByDate(LocalDate today) {
		return pulseRepository.findByDateCreated(today);
	}

	public List<Pulse> getPulsesBetweenWeekDates(LocalDate lastWeekStart, LocalDate lastWeekEnd) {
		return pulseRepository.findByDateCreatedBetween(lastWeekStart, lastWeekEnd);
	}


	public List<Pulse> getPulsesBetweenMonthDates(LocalDate lastMonthStart, LocalDate lastMonthEnd) {
		return pulseRepository.findByDateCreatedBetween(lastMonthStart, lastMonthEnd);
	}


	public List<Pulse> getPulsesByDateFormat(LocalDate today) {
		return pulseRepository.findByDateCreated(today);
	}


	public List<Pulse> getPulsesBetweenYearlyDates(LocalDate lastYearStart, LocalDate lastYearEnd) {
		return pulseRepository.findByDateCreatedBetween(lastYearStart, lastYearEnd);
	}


	public List<Pulse> getPulsesForYear(int year) {
		return pulseRepository.findByDateCreatedYear(year);
	}


	

}
