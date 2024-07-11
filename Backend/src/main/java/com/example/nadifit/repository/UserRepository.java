package com.example.nadifit.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.nadifit.dto.User;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	User findByEmail(String email);

	List<User> findByDateCreated(LocalDate today);

	List<User> findByDateCreatedBetween(LocalDate lastWeekStart, LocalDate lastWeekEnd);

	@Query("SELECT u FROM User u WHERE u.dateCreated BETWEEN :lastMonthStart AND :lastMonthEnd")
	List<User> findByDateCreatedBetweenMonthly(LocalDate lastMonthStart, LocalDate lastMonthEnd);

	@Query("SELECT u FROM User u WHERE YEAR(u.dateCreated) = :year")
	List<User> findByDateCreatedYear(@Param("year") int year);

	@Query("SELECT u FROM User u WHERE u.dateCreated BETWEEN :lastYearStart AND :lastYearEnd")
	List<User> findByDateCreatedBetweenYearly(LocalDate lastYearStart, LocalDate lastYearEnd);

	@Query("SELECT SUM(u.pulseCount) FROM User u WHERE u.dateCreated = CURRENT_DATE")
	Integer getTotalPulseCountForToday();

	@Query("SELECT SUM(u.pulseCount) FROM User u WHERE u.dateCreated = :date")
	Integer getTotalPulseCountForDate(@Param("date") LocalDate date);

	@Query("SELECT u.dateCreated, SUM(u.pulseCount) FROM User u WHERE MONTH(u.dateCreated) = :month AND YEAR(u.dateCreated) = :year GROUP BY u.dateCreated")
	List<Object[]> getPulseCountsForMonth(int month, int year);

	@Query("SELECT u FROM User u WHERE u.dateCreated >= :startDate")
	List<User> findByDateCreatedAfter(@Param("startDate") LocalDate startDate);

	@Query("SELECT u FROM User u WHERE u.email = ?1")
	List<User> findByNameEmail(String email);
	
	@Query("SELECT u FROM User u")
	List<User> findAllUsersWithAllDetails();
	
	@Query("SELECT u FROM User u")
	Page<User> findAllUsersWithAllDetails(Pageable pageable);

	Optional<User> findByRechargeDate(LocalDate date);

}
