package com.example.nadifit.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.example.nadifit.dto.User;
import com.example.nadifit.dto.UserViewOrders;
import com.example.nadifit.dto.AdminViewOrders;
import com.example.nadifit.repository.AdminRepository;
import com.example.nadifit.repository.AdminViewOrdersRepository;
import com.example.nadifit.repository.UserRepository;

import com.example.nadifit.repository.DistributorViewOrdersRepository;

@Service
public class UserService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	DistributorViewOrdersRepository distributorViewOrdersRepository;

	@Autowired
	AdminViewOrdersRepository adminViewOrdersRepository;

	@Autowired
	AdminRepository adminRepository;

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public List<UserViewOrders> getAlluserInfo() {
		List<User> users = userRepository.findAll();
		List<UserViewOrders> userViewOrders = new ArrayList<>();

		for (User user : users) {
			UserViewOrders userviewinfo = convertToUserInfo(user);
			userViewOrders.add(userviewinfo);
		}
		return userViewOrders;
	}

	private UserViewOrders convertToUserInfo(User user) {
		UserViewOrders ddto = new UserViewOrders();
		ddto.setUsername(user.getName());
		ddto.setCountry(user.getCountry());
		ddto.setState(user.getState());
		ddto.setCity(user.getCity());
		ddto.setPhoneNumber(user.getPhoneNumber());
		ddto.setDateCreated(user.getDateCreated());
		return ddto;
	}

	public void saveDistributorViewOrders(List<UserViewOrders> userViewOrders) {
		distributorViewOrdersRepository.saveAll(userViewOrders);
	}

	public List<User> getAllUsers() {
		// TODO Auto-generated method stub
		return null;
	}

	public List<AdminViewOrders> getAllAdminViewOrders() {
		return adminViewOrdersRepository.findAll();
	}

	public void saveAdminViewOrders(AdminViewOrders adminViewOrders) {
		adminViewOrdersRepository.save(adminViewOrders);

	}

	public List<AdminViewOrders> getAllAdminViewOrdersByDistributor(String distributorName) {
		List<AdminViewOrders> adminViewOrdersList = adminViewOrdersRepository.findByDistributorName(distributorName);
		return adminViewOrdersList;
	}

	public boolean isEmailAlreadyExists(String email) {
		return userRepository.existsByEmail(email);
	}

	public boolean deleteUser(long id) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			userRepository.delete(user);
			return true;
		}
		return false;
	}

	public String editUser(long id, ModelMap map) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			map.put("user", user);
			return "EditUser";
		} else {
			map.put("fail", "User not found");
			return "AdminHome";
		}
	}

	public boolean authenticateUser(String email, String password) {
		User user = userRepository.findByEmail(email);
		return user != null && user.getPassword().equals(password);
	}

	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public boolean isValidPhoneNumber(String phoneNumber) {
		return phoneNumber != null && phoneNumber.matches("\\d{10}");
	}

	public List<User> getPulsesByDateFormat(LocalDate today) {
		return userRepository.findByDateCreated(today);
	}

	public List<User> getPulsesBetweenWeekDates(LocalDate lastWeekStart, LocalDate lastWeekEnd) {
		return userRepository.findByDateCreatedBetween(lastWeekStart, lastWeekEnd);
	}

	public List<User> getPulsesBetweenMonthDates(LocalDate lastMonthStart, LocalDate lastMonthEnd) {
		return userRepository.findByDateCreatedBetweenMonthly(lastMonthStart, lastMonthEnd);
	}

	public List<User> getPulsesForYear(int year) {
		return userRepository.findByDateCreatedYear(year);
	}

	public List<User> getPulsesByDate(LocalDate today) {
		return userRepository.findByDateCreated(today);
	}

	public List<User> getPulsesBetweenYearlyDates(LocalDate lastYearStart, LocalDate lastYearEnd) {
		return userRepository.findByDateCreatedBetweenYearly(lastYearStart, lastYearEnd);
	}

	public List<User> getAllPulses() {
		return userRepository.findAll();
	}

	public List<User> preprocessPulseList(List<User> pulseList) {
		Map<String, Map<LocalDate, Integer>> userDatePulseCountMap = new LinkedHashMap<>();

		// Aggregate pulse counts by user and date created
		for (User pulse : pulseList) {
			String user = pulse.getName();
			LocalDate dateCreated = pulse.getDateCreated();
			int pulseCount = pulse.getPulseCount(); // Assuming you have a getter for pulseCount

			// Create a new map for the user if not present
			userDatePulseCountMap.putIfAbsent(user, new LinkedHashMap<>());

			// Aggregate pulse counts for the date for the user
			userDatePulseCountMap.get(user).merge(dateCreated, pulseCount, Integer::sum);
		}

		// Create a new list of users with aggregated pulse counts
		List<User> processedPulseList = new ArrayList<>();
		for (Map.Entry<String, Map<LocalDate, Integer>> userEntry : userDatePulseCountMap.entrySet()) {
			String user = userEntry.getKey();
			Map<LocalDate, Integer> datePulseCountMap = userEntry.getValue();

			for (Map.Entry<LocalDate, Integer> dateEntry : datePulseCountMap.entrySet()) {
				LocalDate dateCreated = dateEntry.getKey();
				int pulseCount = dateEntry.getValue();

				// Create a new pulse with aggregated pulse count
				User processedPulse = new User();
				processedPulse.setDateCreated(dateCreated);
				processedPulse.setName(user);
				processedPulse.setPulseCount(pulseCount); // Set aggregated pulse count
				processedPulseList.add(processedPulse);
			}
		}
		// Sort the processedPulseList based on dateCreated in ascending order
		Collections.sort(processedPulseList, Comparator.comparing(User::getDateCreated).reversed());
		return processedPulseList;
	}

	public List<User> getPulsesByDateCreated(LocalDate today) {
		return userRepository.findByDateCreated(today);
	}

	public List<User> getTodayPulses() {
		LocalDate today = LocalDate.now();
		return userRepository.findByDateCreated(today);
	}

	public List<User> getPulsesForPastWeek() {
		LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
		return userRepository.findByDateCreatedAfter(oneWeekAgo);
	}

	public List<User> getUserUsageForDate(LocalDate today) {
		return userRepository.findByDateCreated(today);
	}

	public List<User> getPulsesForPastMonth() {
		LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
		LocalDate firstDayOfNextMonth = firstDayOfMonth.plusMonths(1);
		return userRepository.findByDateCreatedBetween(firstDayOfMonth, firstDayOfNextMonth);
	}

	public List<User> getPulsesForPastYear() {
		LocalDate firstDayOfYear = LocalDate.now().withDayOfYear(1);
		LocalDate firstDayOfNextYear = firstDayOfYear.plusYears(1);
		return userRepository.findByDateCreatedBetween(firstDayOfYear, firstDayOfNextYear);
	}

	public List<User> getPulsesByDateCreatedToday(LocalDate date) {
		List<User> pulseList = userRepository.findByDateCreated(date);

		// Group by email and sum pulse counts
		Map<String, Integer> pulseCountByEmail = pulseList.stream()
				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

		// Convert the map to a list of User objects
		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
			User user = new User();
			user.setName(findNameByEmail(entry.getKey()));
			user.setEmail(entry.getKey());
			user.setPulseCount(entry.getValue());
			user.setDateCreated(date);
			return user;
		}).collect(Collectors.toList());
		return aggregatedPulseList;
	}

	public List<User> getPulseDataForMonth(YearMonth month) {
		// Fetch the pulses for the specified month
		LocalDate startDate = month.atDay(1); // Start of the month
		LocalDate endDate = month.atEndOfMonth(); // End of the month
		List<User> pulseList = userRepository.findByDateCreatedBetween(startDate, endDate);

		// Group by email and sum pulse counts
		Map<String, Integer> pulseCountByEmail = pulseList.stream()
				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

		// Convert the map to a list of User objects
		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
			User user = new User();
			user.setName(findNameByEmail(entry.getKey()));
			user.setEmail(entry.getKey());
			user.setPulseCount(entry.getValue());
			user.setDateCreated(month.atDay(1));
			return user;
		}).collect(Collectors.toList());

		return aggregatedPulseList;
	}

	public List<User> getPulseDataForYear(Integer year) {
		LocalDate startDate = LocalDate.of(year, 1, 1); // Start of the year
		LocalDate endDate = LocalDate.of(year, 12, 31); // End of the year
		List<User> pulseList = userRepository.findByDateCreatedBetween(startDate, endDate);

		// Group by email and sum pulse counts
		Map<String, Integer> pulseCountByEmail = pulseList.stream()
				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

		// Convert the map to a list of User objects
		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
			User user = new User();
			user.setName(findNameByEmail(entry.getKey()));
			user.setEmail(entry.getKey());
			user.setPulseCount(entry.getValue());
			user.setDateCreated(LocalDate.of(year, 1, 1)); // Set the date to the start of the year
			return user;
		}).collect(Collectors.toList());

		return aggregatedPulseList;
	}

	public String findNameByEmail(String email) {
		List<User> users = userRepository.findByNameEmail(email);
		System.out.println(users);
		return users.isEmpty() ? null : users.get(0).getName();
	}

	public Map<User, Integer> getPulseCountByUserForDate(LocalDate date) {
		// Get all users
		List<User> users = userRepository.findAll();

		Map<User, Integer> pulseCountByUser = new HashMap<>();

		for (User user : users) {
			// Check if the user's dateCreated is the specified date and pulseCount is
			// greater than 0
			if (date.equals(user.getDateCreated()) && user.getPulseCount() > 0) {
				// Add the user and pulse count to the map
				pulseCountByUser.put(user, user.getPulseCount());
			}
		}

		return pulseCountByUser;
	}

	public List<Map<String, Object>> getUserDataForYear(Integer year) {
		List<User> users = userRepository.findAll();

		List<Map<String, Object>> pulseDataForYear = new ArrayList<>();

		for (User user : users) {
			// Check if the user's dateCreated is in the specified year
			if (user.getDateCreated().getYear() == year) {
				Map<String, Object> userData = new HashMap<>();
				userData.put("email", user.getEmail());
				userData.put("pulseCount", user.getPulseCount());
				pulseDataForYear.add(userData);
			}
		}

		return pulseDataForYear;
	}
}
