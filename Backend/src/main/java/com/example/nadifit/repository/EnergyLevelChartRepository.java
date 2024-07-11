package com.example.nadifit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.nadifit.dto.EnergyLevelChart;

@Repository
public interface EnergyLevelChartRepository extends JpaRepository<EnergyLevelChart, Long> {
	
	@Query("SELECT e FROM EnergyLevelChart e")
	List<EnergyLevelChart> findAllEnergyLeveChart();
	
	
}
