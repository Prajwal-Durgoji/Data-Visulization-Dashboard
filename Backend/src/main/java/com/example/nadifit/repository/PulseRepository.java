package com.example.nadifit.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.nadifit.dto.Pulse;

@Repository
public interface PulseRepository extends JpaRepository<Pulse, Long> {

	List<Pulse> findByDateCreated(LocalDate today);

	List<Pulse> findByDateCreatedBetween(LocalDate lastWeekStart, LocalDate lastWeekEnd);
    
    @Query("SELECT p FROM Pulse p WHERE YEAR(p.dateCreated) = :year")
	List<Pulse> findByDateCreatedYear(@Param("year") int year);
		

}
