package com.example.nadifit.controller;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.nadifit.dto.Admin;
import com.example.nadifit.dto.ChangeDPassword;
import com.example.nadifit.dto.Distributor;
import com.example.nadifit.dto.DistributorDetailsUpdate;
import com.example.nadifit.dto.DistributorInfo;
import com.example.nadifit.dto.PasswordChange;
import com.example.nadifit.dto.User;
import com.example.nadifit.dto.UserViewOrders;
import com.example.nadifit.dto.AdminViewOrders;
import com.example.nadifit.dto.Banner;
import com.example.nadifit.dto.BannerId;
import com.example.nadifit.dto.Blog;
import com.example.nadifit.helper.EmailLogic;
import com.example.nadifit.helper.PasswordGenerator;
import com.example.nadifit.helper.TextMessage;
import com.example.nadifit.repository.BannerRepository;
import com.example.nadifit.repository.BlogRepository;
import com.example.nadifit.repository.DistributorInfoRepository;
import com.example.nadifit.repository.DistributorRepository;
import com.example.nadifit.repository.UserRepository;
import com.example.nadifit.service.AdminService;
import com.example.nadifit.service.BannnerService;
import com.example.nadifit.service.BlogService;
import com.example.nadifit.service.DistributorService;
import com.example.nadifit.service.JwtService;
import com.example.nadifit.service.PatientService;
import com.example.nadifit.service.PulseService;
import com.example.nadifit.service.UserCredentialsService;
import com.example.nadifit.service.UserService;
import com.example.nadifit.service.ViewOrdersService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	PulseService pulseService;

	@Autowired
	UserCredentialsService credentialsService;

	@Autowired
	EmailLogic emailLogic;

	@Autowired
	DistributorService distributorService;

	@Autowired
	UserService userService;

	@Autowired
	BannnerService bannnerService;

	@Autowired
	DistributorInfoRepository distributorInfoRepository;

	@Autowired
	DistributorRepository distributorRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	BannerRepository bannerRepository;

	@Autowired
	BlogRepository blogRepository;

	@Autowired
	PatientService patientService;

	@Autowired
	ViewOrdersService viewOrdersService;

	@Autowired
	AdminService adminService;

	@Autowired
	BlogService blogService;

	@Autowired
	TextMessage textMessage;

//	@Autowired
//	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtService jwtService; // JWT Authentication

	@Autowired
	UserDetailsService userDetailsService; // JWT Authentication

	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Admin admin, HttpServletRequest request,
			HttpServletResponse response) {
		String email = admin.getEmail();
		String password = admin.getPassword();
		int flag = 0;
		if (adminService.authenticateAdmin(email, password)) {
			UserDetails userDetails = userDetailsService.loadUserByUsername(email);
			String token = jwtService.generateToken(userDetails);
			HttpSession session = request.getSession(true);
			session.setAttribute("loggedInAdmin", admin);
//			Map<String, String> otpData = adminService.generateAndSetOtp(email);
//			String otp = otpData.get("otp");
//			emailLogic.sendMsg(email, otp);
			session.setAttribute("token", token);
			response.setStatus(HttpServletResponse.SC_OK);
			Map<String, String> responseData = new HashMap<>();
			responseData.put("authenticated", "true");
			responseData.put("token", token);
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			return ResponseEntity.ok(responseData);
		} else {
			boolean isDistributorAuthenticated = distributorService.authenticateDistributor(email, password);
			if (isDistributorAuthenticated) {
				Distributor loggedInDistributor = distributorService.getDistributorByEmail(email);
				HttpSession session = request.getSession(true);
				session.setAttribute("loggedInDistributor", loggedInDistributor);
				response.setStatus((flag == 1) ? HttpServletResponse.SC_OK : HttpServletResponse.SC_UNAUTHORIZED);
				Map<String, String> responseData = new HashMap<>();
				responseData.put("authenticated", "false");
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);
				return ResponseEntity.ok(responseData);
			} else {
				boolean isUserAuthenticated = userService.authenticateUser(email, password);
				if (isUserAuthenticated) {
					User loggedInUser = userService.getUserByEmail(email);
					HttpSession session = request.getSession(true);
					session.setAttribute("loggedInUser", loggedInUser);
				} else {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
				}
			}
		}
		return null;
	}

//	@GetMapping("/userList") // React Application
//	public ResponseEntity<List<User>> loadUserDetails(HttpServletRequest request) {
//		String authHeader = request.getHeader("Authorization");
//		if (authHeader != null && authHeader.startsWith("Bearer ")) {
//			String token = authHeader.substring(7);
//			String username = jwtService.extractUsername(token);
//			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//			if (jwtService.validateToken(token, userDetails)) {
//				List<User> userList = userRepository.findAllUsersWithAllDetails();
//				return ResponseEntity.ok(userList);
//			}
//		}
//		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}

	@GetMapping("/userList") // React Application
	public ResponseEntity<Page<User>> loadUserDetails(@RequestParam(defaultValue = "0") int page,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Pageable pageable = PageRequest.of(page, 10);
				Page<User> userList = userRepository.findAllUsersWithAllDetails(pageable);
				return ResponseEntity.ok(userList);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

//	@GetMapping("/transcations") // React Application
//	public ResponseEntity<List<User>> loadTranscation(HttpServletRequest request) {
//	    String authHeader = request.getHeader("Authorization");
//	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
//	        String token = authHeader.substring(7);
//	        String username = jwtService.extractUsername(token);
//	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//	        if (jwtService.validateToken(token, userDetails)) {
//	            List<User> userList = userRepository.findAll();
//	            return ResponseEntity.ok(userList);
//	        }
//	    }
//	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}

	@GetMapping("/transactions") // React Application
	public ResponseEntity<Page<User>> loadTransaction(@RequestParam(defaultValue = "0") int page,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Pageable pageable = PageRequest.of(page, 10); // Create a Pageable object with page number and page size
				Page<User> transactionList = userRepository.findAll(pageable); // Pass the Pageable object to your
																				// method
				return ResponseEntity.ok(transactionList);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/transaction/details/{id}") // React Application --> transaction details
	public ResponseEntity<Map<String, Object>> getUserWithTransactions(@PathVariable Long id,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<User> user = userRepository.findById(id);
				if (user.isPresent()) {
					User u = user.get();
					Map<String, Object> response = new HashMap<>();
					response.put("rechargeDate", u.getRechargeDate());
					response.put("pulseCount", u.getPulseCount());
					response.put("id", u.getId());
					return new ResponseEntity<>(response, HttpStatus.OK);
				} else {
					return new ResponseEntity<>(HttpStatus.NOT_FOUND);
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/device/details/{id}")
	public ResponseEntity<Map<String, Object>> showDeviceDetails(@PathVariable Long id, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<User> user = userRepository.findById(id);
				if (user.isPresent()) {
					User u = user.get();
					Map<String, Object> response = new HashMap<>();
					response.put("macid", u.getMacid());
					response.put("activationDate", u.getActivatedDate());
					return new ResponseEntity<>(response, HttpStatus.OK);
				} else {
					return new ResponseEntity<>(HttpStatus.NOT_FOUND);
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/login")
	public String signin(@RequestParam(required = false) String email, @RequestParam(required = false) String password,
			HttpServletRequest request, ModelMap map, HttpServletResponse response) {
//		String email = admin.getEmail();
//		String password = admin.getPassword();
		if (email == null || password == null) {
			map.put("fail", "Email and password is required");
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return "Login";
		}
		if (adminService.authenticateAdmin(email, password)) {
			HttpSession session = request.getSession(true);
			session.setAttribute("loggedInAdmin", email);
			Map<String, String> otpData = adminService.generateAndSetOtp(email);
			String otp = otpData.get("otp");
			emailLogic.sendMsg(email, otp);
			map.put("pass", "Admin Logged In Successfully");
//			return "AdminHome";
			return "PulseChartData";
		} else {
			boolean isDistributorAuthenticated = distributorService.authenticateDistributor(email, password);
			if (isDistributorAuthenticated) {
				Distributor loggedInDistributor = distributorService.getDistributorByEmail(email);
				HttpSession session = request.getSession(true);
				session.setAttribute("loggedInDistributor", loggedInDistributor);
				return "AdminHome";
			} else {
				boolean isUserAuthenticated = userService.authenticateUser(email, password);
				if (isUserAuthenticated) {
					User loggedInUser = userService.getUserByEmail(email);
					HttpSession session = request.getSession(true);
					session.setAttribute("loggedInUser", loggedInUser);
					return "AdminHome";
				} else {
					map.put("fail", "Invalid Credentials");
					return "Login";
				}
			}
		}
	}

	@GetMapping("/editDistributor/{id}")
	public String editDistribuot(@PathVariable int id, HttpSession session, ModelMap map) {
		if (session.getAttribute("loggedInAdmin") != null) {
			return distributorService.editDistributor(id, map);
		} else {
			map.put("fail", "Session Expired, Login Again");
			return "Home";
		}
	}
//
//	@PostMapping("/updateDistributor/{id}")
//	public String updateDistributor(@PathVariable long id, @ModelAttribute Distributor updatedDistributor,
//			ModelMap map) {
//		Optional<Distributor> optionalDistributor = distributorRepository.findById(id);
//		if (optionalDistributor.isPresent()) {
//			Distributor existingDistributor = optionalDistributor.get();
//			existingDistributor.setName(updatedDistributor.getName());
//			existingDistributor.setAge(updatedDistributor.getAge());
//			existingDistributor.setPhoneNumber(updatedDistributor.getPhoneNumber());
//			existingDistributor.setGender(updatedDistributor.getGender());
//			existingDistributor.setEmail(updatedDistributor.getEmail());
//			existingDistributor.setCountry(updatedDistributor.getCountry());
//			existingDistributor.setState(updatedDistributor.getState());
//			existingDistributor.setCity(updatedDistributor.getCity());
//			existingDistributor.setDateCreated(updatedDistributor.getDateCreated());
//			distributorRepository.save(existingDistributor);
//			map.put("pass", "Distributor updated successfully");
//			return "EditDistributor";
//		} else {
//			map.put("fail", "Distributor not found");
//			return "AdminHome";
//		}
//	}

	@PutMapping("/updateDistributor/{id}")
	public ResponseEntity<?> updateDistributor(@PathVariable long id, @RequestBody Distributor updatedDistributor,
			HttpServletRequest request, ModelMap map) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<Distributor> optionalDistributor = distributorRepository.findById(id);
				if (optionalDistributor.isPresent()) {
					Distributor existingDistributor = optionalDistributor.get();
					existingDistributor.setName(updatedDistributor.getName());
					existingDistributor.setAge(updatedDistributor.getAge());
					existingDistributor.setPhoneNumber(updatedDistributor.getPhoneNumber());
//					existingDistributor.setGender(updatedDistributor.getGender());
					existingDistributor.setEmail(updatedDistributor.getEmail());
					existingDistributor.setCountry(updatedDistributor.getCountry());
					existingDistributor.setState(updatedDistributor.getState());
					existingDistributor.setCity(updatedDistributor.getCity());
//					existingDistributor.setDateCreated(updatedDistributor.getDateCreated());
					distributorRepository.save(existingDistributor);
					return ResponseEntity.ok(existingDistributor);
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Distributor not found");
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/editUser/{id}") // Web Application
	public String editUser(@PathVariable int id, HttpSession session, ModelMap map) {
		if (session.getAttribute("loggedInAdmin") != null) {
			return userService.editUser(id, map);
		} else {
			map.put("fail", "Session Expired, Login Again");
			return "Home";
		}
	}

	@PutMapping("/updateUser/{id}") // React Application
	public ResponseEntity<User> updateUser(@PathVariable long id, @RequestBody User updatedUser,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<User> optionalUser = userRepository.findById(id);
				if (optionalUser.isPresent()) {
					User existingUser = optionalUser.get();
					existingUser.setName(updatedUser.getName());
					existingUser.setEmail(updatedUser.getEmail());
					existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
//	                existingUser.setAge(updatedUser.getAge());
//	                existingUser.setGender(updatedUser.getGender());
					existingUser.setHouseNo(updatedUser.getHouseNo());
					existingUser.setAddress(updatedUser.getAddress());
					existingUser.setLandMark(updatedUser.getLandMark());
					existingUser.setPinCode(updatedUser.getPinCode());
					existingUser.setCountry(updatedUser.getCountry());
					existingUser.setState(updatedUser.getState());
					existingUser.setCity(updatedUser.getCity());
//					existingUser.setPulseCount(updatedUser.getPulseCount());
//	                existingUser.setDateCreated(updatedUser.getDateCreated());
					userRepository.save(existingUser);
					return ResponseEntity.ok(existingUser);
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@PutMapping("/transaction/update/{id}") // React Application
	public ResponseEntity<?> updateUserPulseCount(@PathVariable Long id,
			@RequestBody Map<String, Integer> pulseCountMap, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<User> optionalUser = userRepository.findById(id);
				if (!optionalUser.isPresent()) {
					return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
				}

				User user = optionalUser.get();
				user.setPulseCount(pulseCountMap.get("pulseCount"));
				userRepository.save(user);

				return new ResponseEntity<>("Pulse count updated successfully", HttpStatus.OK);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}

	@GetMapping("/deleteUser/{id}") // React Application
	public ResponseEntity<String> deleteUser(@PathVariable long id, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				userRepository.deleteById(id);
				return ResponseEntity.ok("User deleted successfully");
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}

	@GetMapping("/deleteDistributor/{id}") // React Application
	public ResponseEntity<String> deleteDistributor(@PathVariable long id, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				distributorRepository.deleteById(id);
				return ResponseEntity.ok("Distributor deleted successfully");
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}

//	@GetMapping("/userDetails/{id}")
//	public String showUserDetails(@PathVariable Long id, ModelMap map) {
//		User user = userRepository.findById(id)
//				.orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + id));
//		map.put("user", user);
//		return "UserDetails";
//	}

	@GetMapping("/userDetails/{id}") // React Application
	public ResponseEntity<User> showUserDetails(@PathVariable Long id, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Optional<User> optionalUser = userRepository.findById(id);
				if (optionalUser.isPresent()) {
					return ResponseEntity.ok(optionalUser.get());
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/distributorList") // React Application
	public ResponseEntity<Page<Distributor>> loaddistributorDetails(@RequestParam(defaultValue = "0") int page,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Pageable pageable = PageRequest.of(page, 10); // Create a Pageable object with page number and page size
				Page<Distributor> distributorList = distributorRepository.findAll(pageable); // Pass the Pageable object
				return ResponseEntity.ok(distributorList);									// to your method
				
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@PostMapping("/createDistributors") // Admin (createDistributors)
	public ResponseEntity<String> createDistributor(@RequestBody Distributor distributor) {
		if (distributorService.isEmailAlreadyExists(distributor.getEmail())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
		}
		List<String> generatedPasswords = PasswordGenerator.generatePasswords(1, 6);
		System.out.println(generatedPasswords);
		String selectedPassword = generatedPasswords.get(new SecureRandom().nextInt(generatedPasswords.size()));

		distributor.setPassword(selectedPassword);
		distributor.setDateCreated(LocalDate.now());

		distributorService.saveDistributor(distributor);
		return ResponseEntity.ok("distributed account created succesfully");
	}

	@DeleteMapping("/deleteDistributor/{id}") // Web Application
	public String deleteDistributor(@PathVariable long id, HttpSession session, ModelMap map) {
		if (session.getAttribute("loggedInAdmin") != null) {
			if (distributorService.deleteDistributor(id)) {
				map.put("pass", "Distributor deleted successfully");
			} else {
				map.put("fail", "Distributor not found");
			}
			return "Distributor";
		} else {
			map.put("fail", "Session Expired, Login Again");
			return "Home";
		}
	}

	@GetMapping("/distributorAge")
	public ResponseEntity<Integer> getDistributorAge(HttpServletRequest request) {
		Distributor loggedInDistributor = getCurrentLoggedInDistributor(request);
		if (loggedInDistributor != null) {
			return ResponseEntity.ok(loggedInDistributor.getAge());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		}
	}

	@PostMapping("/updateDistributorDetailsByDistributor")
	public ResponseEntity<String> updateDistributorDetails(@RequestBody DistributorDetailsUpdate detailsUpdate,
			HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			Distributor loggedInDistributor = (Distributor) session.getAttribute("loggedInDistributor");
			if (loggedInDistributor != null) {
				String targetEmail = loggedInDistributor.getEmail();
				if (loggedInDistributor.getEmail().equals(targetEmail)) {
					Distributor distributorToUpdate = distributorService.getDistributorByEmail(targetEmail);
					if (distributorToUpdate != null) {
						distributorToUpdate.setCity(detailsUpdate.getCity());
						distributorToUpdate.setState(detailsUpdate.getState());
						distributorToUpdate.setCountry(detailsUpdate.getCountry());
						distributorService.saveDistributor(distributorToUpdate);
						return ResponseEntity.ok("Distributor details updated successfully");
					} else {
						return ResponseEntity.badRequest().body("Distributor not found for the given email");
					}
				} else {
					return ResponseEntity.status(HttpStatus.FORBIDDEN)
							.body("Distributor can only update their own details");
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
	}

	@PostMapping("/createUsers") // Distributor --> User --> (createUser)
	public ResponseEntity<String> createUser(@RequestBody User user, HttpServletRequest request) {
		try {
			if (userService.isEmailAlreadyExists(user.getEmail())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
			}
			if (!userService.isValidPhoneNumber(user.getPhoneNumber())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please enter a valid 10-digit phone number");
			}
			List<String> generatedPasswords = PasswordGenerator.generatePasswords(1, 6);
			String selectedPassword = generatedPasswords.get(new SecureRandom().nextInt(generatedPasswords.size()));
			user.setPassword(selectedPassword);
			user.setDateCreated(LocalDate.now());
			Distributor distributor = getCurrentLoggedInDistributor(request); // logged In Distributor
			userService.saveUser(user);
//			String smsResult = textMessage.sendWelcomeSMS(user.getPhoneNumber()); //Text Message
//			System.out.println(smsResult);
			AdminViewOrders adminViewOrders = new AdminViewOrders();
			adminViewOrders.setUservalidate(user.getName());
			adminViewOrders.setDistributorName(distributor.getName());
			adminViewOrders.setPhoneNumber(user.getPhoneNumber());
			adminViewOrders.setState(user.getState());
			adminViewOrders.setCity(user.getCity());
			adminViewOrders.setCountry(user.getCountry());
			adminViewOrders.setDateCreated(user.getDateCreated());

			userService.saveAdminViewOrders(adminViewOrders);
			emailLogic.sendUserRegistrationEmail(user.getEmail(), user.getPassword());
			return ResponseEntity.ok("User account created successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to create user: " + e.getMessage());
		}
	}
//
//	@GetMapping("/userList") // User.html
//	public String loaduserDetails(HttpServletRequest request, ModelMap map) {
//		HttpSession session = request.getSession();
//		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");
//		if (loggedInAdmin != null) {
//			List<User> userList = userRepository.findAll();
//			map.addAttribute("userList", userList);
//			return "User";
//		} else {
//			return "Login";
//		}
//	}

	@GetMapping("/viewDistributorsInfo") // Admin --> Distributor --> (viewDistributorsInfo)
	public ResponseEntity<List<DistributorInfo>> getAllDistributors() { // Distributor --> name,phonenumber,datecreated
		List<DistributorInfo> distributors = distributorService.getAllDistributors();
		return ResponseEntity.ok(distributors);
	}

	@PostMapping("/saveviewDistributorsInfo")
	public ResponseEntity<String> saveDistributorInfo(@RequestBody List<Distributor> distributors) {
		try {
			List<DistributorInfo> distributorInfoList = new ArrayList<>();

			for (Distributor distributor : distributors) {
				DistributorInfo distributorInfo = distributor.toDistributorInfo();
				distributorInfoList.add(distributorInfo);
			}
			distributorInfoRepository.saveAll(distributorInfoList);

			return ResponseEntity.ok("Distributor Info saved successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to save distributor info: " + e.getMessage());
		}
	}

	@GetMapping("/userVieworders") // Distributor (viewOrders) --> User --> ViewUserDetails //User details
	public ResponseEntity<List<UserViewOrders>> viewAllusers() {
		List<UserViewOrders> users = userService.getAlluserInfo();
		return ResponseEntity.ok(users);
	}

	@PostMapping("/saveUserViewOrders") // Distributor --> User --> Save userViewOrders
	public ResponseEntity<String> saveUserViewOrders(@RequestBody List<UserViewOrders> userViewOrders) {
		userService.saveDistributorViewOrders(userViewOrders);
		return ResponseEntity.ok("User View Orders saved successfully");
	}

	@PostMapping("/changeAdminPassword") // Admin --> Account --> (changeAdminPassword)
	public ResponseEntity<String> changeAdminPassword(@RequestBody PasswordChange change, HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			Admin loggedInAdmin = (Admin) session.getAttribute("loggedInAdmin");
			if (loggedInAdmin != null) {
				String targetEmail = loggedInAdmin.getEmail();
				System.out.println(targetEmail);
				if (loggedInAdmin.getEmail().equals(targetEmail)) {
					if (change.getNewPassword().equals(change.getRetypedPassword())) {
						Admin adminToUpdate = adminService.getAdminByEmail(targetEmail);
						if (adminToUpdate != null) {
							adminToUpdate.setPassword(change.getNewPassword());
							adminService.saveAdmin(adminToUpdate);
							return ResponseEntity.ok("Password changed successfully");
						} else {
							return ResponseEntity.badRequest().body("Admin not found for the given email");
						}
					} else {
						return ResponseEntity.badRequest().body("New password and retyped password do not match");
					}
				} else {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
							.body("You are not authorized to change this password");
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
	}

	@GetMapping("/logout") // Account --> logout
	public ResponseEntity<String> logout(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
			return ResponseEntity.ok("Logout successfull");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
		}
	}

	@PostMapping("/changeDistributorPassword") // Distributor --> Account --> (changeDistributorPassword)
	public ResponseEntity<String> changeDistributorPassword(@RequestBody ChangeDPassword change,
			HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			Distributor loggedInDistributor = (Distributor) session.getAttribute("loggedInDistributor");
			if (loggedInDistributor != null) {
				String targetEmail = loggedInDistributor.getEmail();
				System.out.println(targetEmail);
				if (loggedInDistributor.getEmail().equals(targetEmail)) {
					if (change.getNewPassword().equals(change.getRetypedPassword())) {
						Distributor distributorToUpdate = distributorService.getDistributorByEmail(targetEmail);
						if (distributorToUpdate != null) {
							distributorToUpdate.setPassword(change.getNewPassword());
							distributorService.saveDistributor(distributorToUpdate);
							return ResponseEntity.ok("Password changed Successfully");
						} else {
							return ResponseEntity.badRequest().body("Distributor not found for the given email");
						}
					} else {
						return ResponseEntity.badRequest().body("New password and retyped password do not match");
					}
				} else {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
							.body("You are not authorized to change this password");
				}
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
	}

	@GetMapping("/adminviewOrders")
	public ResponseEntity<List<AdminViewOrders>> getAllAdminViewOrders(HttpServletRequest request) {
		HttpSession session = request.getSession(false); 
		if (session != null) {
			// Check if an admin is logged in
			System.out.println(session);
			Admin loggedInAdmin = (Admin) session.getAttribute("loggedInAdmin");
			System.out.println(loggedInAdmin);
			if (loggedInAdmin != null) {
				// Admin is logged in, proceed with fetching orders
				System.out.println(loggedInAdmin);
				List<AdminViewOrders> orders = adminService.getAllAdminViewOrdersByAdmin(loggedInAdmin.getEmail());
				System.out.println(orders);
				return ResponseEntity.ok(orders);
			}

			// Check if a distributor is logged in
			Distributor loggedInDistributor = (Distributor) session.getAttribute("loggedInDistributor");
			if (loggedInDistributor != null) {
				// Distributor is logged in, proceed with fetching orders
				List<AdminViewOrders> adminViewOrdersList = userService
						.getAllAdminViewOrdersByDistributor(loggedInDistributor.getName());
				return ResponseEntity.ok(adminViewOrdersList);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
	}

	private Distributor getCurrentLoggedInDistributor(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			Distributor distributor = (Distributor) session.getAttribute("loggedInDistributor");
			distributor.getUserCredentialsList().size();
			return distributor;
		}
		return null;
	}
	
	@PostMapping("/banner/add") // Adding the banner
	public ResponseEntity<String> addBannerDetails(@RequestBody List<Banner> banners, HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7);
	        String username = jwtService.extractUsername(token);
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	        if (jwtService.validateToken(token, userDetails)) {
	            bannerRepository.saveAll(banners);
	            return ResponseEntity.ok("Banner added successfully");
	        }
	    }
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}

//	
//	@GetMapping("/banner/fetch") // Displaying the banner
//	public ResponseEntity<List<Banner>> fetchBannerDetails(HttpServletRequest request,
//	        @RequestParam(defaultValue = "0") int start, @RequestParam(defaultValue = "4") int limit) {
//	    String authHeader = request.getHeader("Authorization");
//	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
//	        String token = authHeader.substring(7);
//	        String username = jwtService.extractUsername(token);
//	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//	        if (jwtService.validateToken(token, userDetails)) {
//	            List<Banner> bannerDetailsList = bannnerService.findBannerRange(start, limit);
//	            bannerDetailsList.forEach(banner -> System.out.println("Banner Text: " + banner.getText()));
//	            return ResponseEntity.ok(bannerDetailsList);
//	        }
//	    }
//	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}
	
	@GetMapping("/banner/fetch") // Displaying the banner
	public ResponseEntity<Page<Banner>> fetchBannerDetails(@RequestParam(defaultValue = "0") int page,
	        HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7);
	        String username = jwtService.extractUsername(token);
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	        if (jwtService.validateToken(token, userDetails)) {
	            Pageable pageable = PageRequest.of(page, 4); // Create a Pageable object with page number and page size
	            Page<Banner> bannerDetailsList = bannerRepository.findAll(pageable); // Pass the Pageable object to your method
	            return ResponseEntity.ok(bannerDetailsList);
	        }
	    }
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}


	
//	@GetMapping("/banner/delete") // Deleting the banner
//	public ResponseEntity<String> deleteBannerById(@RequestBody BannerId bannerIds, HttpServletRequest request) {
//	    String authHeader = request.getHeader("Authorization");
//	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
//	        String token = authHeader.substring(7);
//	        String username = jwtService.extractUsername(token);
//	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//	        if (jwtService.validateToken(token, userDetails)) {
//	            List<Long> bannerId = bannerIds.getBannerIds();
//	            bannnerService.deleteAndRearrangeBanners(bannerId);
//	            return ResponseEntity.ok("Banner deleted successfully");
//	        }
//	    }
//	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}
	
	@GetMapping("/banner/delete/{id}") // Deleting the banner
	public ResponseEntity<String> deleteBanner(@PathVariable long id, HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7);
	        String username = jwtService.extractUsername(token);
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	        if (jwtService.validateToken(token, userDetails)) {
	            bannerRepository.deleteById(id);
	            return ResponseEntity.ok("Banner deleted successfully");
	        }
	    }
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}
	
	@PutMapping("/banner/update")
	public ResponseEntity<?> updateBanner(@RequestBody Banner banner, HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7);
	        String username = jwtService.extractUsername(token);
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	        if (jwtService.validateToken(token, userDetails)) {
	            Banner updatedBanner = bannnerService.updateBanner(banner);
	            return ResponseEntity.ok(updatedBanner);
	        }
	    }
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
	}



//	@GetMapping("/bannerList") // Web Application
//	public String loadBanner(HttpServletRequest request, ModelMap map) {
//		HttpSession session = request.getSession();
//		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");
//		if (loggedInAdmin != null) {
//			List<Banner> banners = bannnerService.getAllBanners();
//			map.put("banners", banners);
//			return "Banner";
//		} else {
//			map.put("fail", "Invalid Credentials");
//			return "Login";
//		}
//	}
//
//	@PostMapping("/saveBanner") // Web application
//	public String saveBanner(@RequestParam String text1, @RequestParam String text2, @RequestParam String text3,
//			@RequestParam String text4, ModelMap map) {
//		List<String> newTexts = Arrays.asList(text1, text2, text3, text4);
//		bannnerService.saveNewBanners(newTexts);
//		map.put("pass", "banner saved");
//		return "Banner";
//	}
//
//	@GetMapping("/deleteBanner") // Web application
//	public String deleteBanner(@RequestParam Long bannerId) {
//		bannnerService.deleteBanner(bannerId);
//		return "Banner";
//	}

	@GetMapping("/blogList") // Web Application
	public String loadBlog(HttpServletRequest request, ModelMap map) {
		HttpSession session = request.getSession();
		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");
		map.put("loggedInAdmin", loggedInAdmin);
		return "Blogs";
	}

	@PostMapping("/saveBlog") // Web application
	public String saveBlog(@RequestParam String imageUrl, @RequestParam String videoUrl, ModelMap map) {
		Blog blog = new Blog();
		blog.setImageUrl(imageUrl);
		blog.setVideoUrl(videoUrl);
		blogService.saveBlog(blog);
		map.put("pass", "Blog Saved");
		return "Blogs";
	}

	@PostMapping("/addBlogs") // Admin --> Add the Blogs
	public ResponseEntity<String> addBlogrDetails(@RequestBody List<Blog> blogs, HttpServletRequest request) {
		HttpSession session = request.getSession();
		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");

		if (loggedInAdmin != null) {
			blogRepository.saveAll(blogs);
			return ResponseEntity.ok("Blog added successfully");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
		}
	}

	@GetMapping("/fetchBlogDetails") // Admin --> Displaying the Blogs
	public ResponseEntity<List<Blog>> fetchBlogs(HttpServletRequest request) {
		HttpSession session = request.getSession();
		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");

		if (loggedInAdmin != null) {
			List<Blog> blogDetailsList = blogService.getAllBlogs();
			System.out.println(blogDetailsList);

			blogDetailsList.forEach(blog -> System.out
					.println("Image URL: " + blog.getImageUrl() + ", Video URL: " + blog.getVideoUrl()));
			return ResponseEntity.ok(blogDetailsList);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/pulseChart") // Web Application
	public String getPulseList(HttpServletRequest request, ModelMap map, @RequestParam(defaultValue = "0") int page) {
		HttpSession session = request.getSession();
		String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");

		if (loggedInAdmin != null) {
			List<User> pulseList = userService.getAllPulses();
			List<User> processedPulseList = userService.preprocessPulseList(pulseList);

			int pageSize = 15;
			int totalPages = (int) Math.ceil((double) processedPulseList.size() / pageSize);

			// Calculate the start and end index for the current page
			int startIndex = page * pageSize;
			int endIndex = Math.min(startIndex + pageSize, processedPulseList.size());

			// Extract the sublist for the current page
			List<User> currentPagePulses = processedPulseList.subList(startIndex, endIndex);

			map.put("pulseList", currentPagePulses);
			map.put("currentPage", page);
			map.put("totalPages", totalPages);
			return "PulseChartData";
		} else {
			map.put("fail", "Invalid Credentials");
			return "Login";
		}
	}

	@GetMapping("/lastWeek") // Pulse Data Generated Weekly
	public ResponseEntity<Map<String, List<?>>> getLastWeekData() {
		LocalDate lastWeekStart = LocalDate.now().minusWeeks(1);
		LocalDate lastWeekEnd = LocalDate.now();
		List<User> pulseList = userService.getPulsesBetweenWeekDates(lastWeekStart, lastWeekEnd);
		System.out.println(pulseList);

		// Aggregate pulse counts for each user
		Map<String, Integer> userPulseCountMap = new HashMap<>();
		for (User pulse : pulseList) {
			String user = pulse.getName();
			int pulseCount = pulse.getPulseCount();

			userPulseCountMap.put(user, userPulseCountMap.getOrDefault(user, 0) + pulseCount);
		}

		// Extract user names and their aggregated pulse counts
		List<String> userList = new ArrayList<>(userPulseCountMap.keySet());
		List<Integer> pulseCountList = new ArrayList<>(userPulseCountMap.values());

		// Sort user names alphabetically
//		Collections.sort(userList);
		// Create a response map containing user and pulse count lists
		Map<String, List<?>> responseMap = new HashMap<>();
		responseMap.put("user", userList);
		responseMap.put("pulse", pulseCountList);
		System.out.println(responseMap);
		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/lastMonth") // Pulse Data Generated Monthly
	public ResponseEntity<Map<String, List<?>>> getLastMonthData() {
		LocalDate lastMonthStart = LocalDate.now().minusMonths(1);
		LocalDate lastMonthEnd = LocalDate.now();
		List<User> pulseList = userService.getPulsesBetweenMonthDates(lastMonthStart, lastMonthEnd);

		// Aggregate pulse counts for each user (similar to getLastWeekData method)
		Map<String, Integer> userPulseCountMap = new HashMap<>();
		for (User pulse : pulseList) {
			String user = pulse.getName();
			int pulseCount = pulse.getPulseCount();

			userPulseCountMap.put(user, userPulseCountMap.getOrDefault(user, 0) + pulseCount);
		}
		// Extract user names and their aggregated pulse counts
		List<String> userList = new ArrayList<>(userPulseCountMap.keySet());
		List<Integer> pulseCountList = new ArrayList<>(userPulseCountMap.values());

		// Create a response map containing user and pulse count lists
		Map<String, List<?>> responseMap = new HashMap<>();
		responseMap.put("user", userList);
		responseMap.put("pulse", pulseCountList);

		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/lastYear") // Pulse Data Generated Yearly
	public ResponseEntity<Map<String, List<?>>> getLastYearlyData() {
		LocalDate lastYearStart = LocalDate.now().minusYears(1);
		LocalDate lastYearEnd = LocalDate.now();
		List<User> pulseList = userService.getPulsesBetweenYearlyDates(lastYearStart, lastYearEnd);

		// Aggregate pulse counts for each user (similar to getLastWeekData method)
		Map<String, Integer> userPulseCountMap = new HashMap<>();
		for (User pulse : pulseList) {
			String user = pulse.getName();
			int pulseCount = pulse.getPulseCount();

			userPulseCountMap.put(user, userPulseCountMap.getOrDefault(user, 0) + pulseCount);
		}
		// Extract user names and their aggregated pulse counts
		List<String> userList = new ArrayList<>(userPulseCountMap.keySet());
		List<Integer> pulseCountList = new ArrayList<>(userPulseCountMap.values());
		System.out.println(pulseCountList);

		// Sort user names alphabetically
//		Collections.sort(userList);

		// Create a response map containing user and pulse count lists
		Map<String, List<?>> responseMap = new HashMap<>();
		responseMap.put("user", userList);
		responseMap.put("pulse", pulseCountList);

		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/today") // User Data Generated for each pulse count
	public ResponseEntity<Map<String, List<?>>> getTodayData() {
		LocalDate today = LocalDate.now();
		List<User> pulseList = userService.getPulsesByDate(today);

		// Aggregate pulse counts for each user
		Map<String, Integer> userPulseCountMap = new HashMap<>();
		for (User pulse : pulseList) {
			String user = pulse.getName();
			int pulseCount = pulse.getPulseCount();

			userPulseCountMap.put(user, userPulseCountMap.getOrDefault(user, 0) + pulseCount);
		}

		// Extract user names and their aggregated pulse counts
		List<String> userList = new ArrayList<>(userPulseCountMap.keySet());
		List<Integer> pulseCountList = new ArrayList<>(userPulseCountMap.values());

		// Create a response map containing user and pulse count lists
		Map<String, List<?>> responseMap = new HashMap<>();
		responseMap.put("user", userList);
		responseMap.put("pulse", pulseCountList);

		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/totalReportsToday") // Reports Generated Today
	public ResponseEntity<Map<String, List<?>>> getTotalReportsToday() {
		LocalDate today = LocalDate.now();
		List<User> pulses = userService.getPulsesByDateFormat(today);
		Map<String, Integer> totalReportsMap = new HashMap<>();

		// Calculate total pulse count for each date
		for (User pulse : pulses) {
			String date = pulse.getDateCreated().toString();
			int pulseCount = pulse.getPulseCount();
			totalReportsMap.put(date, totalReportsMap.getOrDefault(date, 0) + pulseCount);

		}
		// Extract dates and pulse counts
		List<String> dateList = new ArrayList<>(totalReportsMap.keySet());
		List<Integer> pulseCountList = new ArrayList<>(totalReportsMap.values());
		System.out.println(pulseCountList);

		// Create a response map containing date and pulse count arrays
		Map<String, List<?>> responseMap = new HashMap<>();
		responseMap.put("dates", dateList);
		responseMap.put("pulseCounts", pulseCountList);

		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/totalPulseCountForToday")
	public ResponseEntity<Integer> getTotalPulseCountForToday(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Integer totalPulseCount = userRepository.getTotalPulseCountForToday();
				return ResponseEntity.ok(totalPulseCount);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/totalPulseCountForDate") // Calender for today
	public ResponseEntity<Integer> getTotalPulseCountForDate(
			@RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date, HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Integer totalPulseCount = userRepository.getTotalPulseCountForDate(date);
				return ResponseEntity.ok(totalPulseCount);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/getPulseCountByDate/{selectedDate}") // Calender for today
	public ResponseEntity<?> getPulseCountByDate(@PathVariable String selectedDate, HttpServletRequest request) {
		try {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				String username = jwtService.extractUsername(token);
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				if (jwtService.validateToken(token, userDetails)) {
					LocalDate date = LocalDate.parse(selectedDate);
					Integer user = userRepository.getTotalPulseCountForDate(date);
					return ResponseEntity.ok(user);
				}
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
		}
	}

	@GetMapping("/totalReportsWeekly") // Reports generated Weekly
	public ResponseEntity<Map<String, List<?>>> getTotalReportsWeekly(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				LocalDate lastWeekStart = LocalDate.now().minusWeeks(1);
				LocalDate lastWeekEnd = LocalDate.now();
				List<User> pulses = userService.getPulsesBetweenWeekDates(lastWeekStart, lastWeekEnd);

				Map<String, Integer> totalReportsMap = new HashMap<>();
				// Calculate total pulse count for each date
				for (User pulse : pulses) {
					String date = pulse.getDateCreated().toString();
					int pulseCount = pulse.getPulseCount();
					totalReportsMap.put(date, totalReportsMap.getOrDefault(date, 0) + pulseCount);
				}
				// Extract dates and pulse counts
				List<String> dateList = new ArrayList<>(totalReportsMap.keySet());
				List<Integer> pulseCountList = new ArrayList<>(totalReportsMap.values());

				// Sort dates in ascending order
				Collections.sort(dateList, Comparator.naturalOrder());

				// Create a response map containing date and pulse count arrays
				Map<String, List<?>> responseMap = new HashMap<>();
				responseMap.put("dates", dateList);
				responseMap.put("pulseCounts", pulseCountList);

				return ResponseEntity.ok(responseMap);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/totalReportsMonthly") // Reports generated Monthly by chart
	public ResponseEntity<Map<String, Object>> getTotalReportsMonthly(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Map<String, Integer> totalReportsMap = new LinkedHashMap<>();

				// Get the current month starting and ending dates
				LocalDate currentDate = LocalDate.now();
				LocalDate monthStart = currentDate.withDayOfMonth(1);
				LocalDate monthEnd = currentDate.with(TemporalAdjusters.lastDayOfMonth());

				// Fetch pulses for the current month
				List<User> pulses = userService.getPulsesBetweenMonthDates(monthStart, monthEnd);

				// Calculate total pulse count for the current month
				int totalPulseCount = 0;
				for (User pulse : pulses) {
					totalPulseCount += pulse.getPulseCount();
				}

				// Store the total pulse count for the current month
				totalReportsMap.put(monthStart.getMonth().toString(), totalPulseCount);

				// Iterate over the past 12 months
				for (int i = 1; i < 12; i++) {
					// Get the starting and ending dates for each month
					LocalDate prevMonthStart = currentDate.minusMonths(i).withDayOfMonth(1);
					LocalDate prevMonthEnd = prevMonthStart.with(TemporalAdjusters.lastDayOfMonth());

					// Fetch pulses for the previous month
					List<User> prevMonthPulses = userService.getPulsesBetweenMonthDates(prevMonthStart, prevMonthEnd);

					// Calculate total pulse count for the previous month
					int prevMonthPulseCount = 0;
					for (User pulse : prevMonthPulses) {
						prevMonthPulseCount += pulse.getPulseCount();
					}

					// Store the total pulse count for the previous month
					totalReportsMap.put(prevMonthStart.getMonth().toString(), prevMonthPulseCount);
				}

				// Create a response map containing month and pulse count arrays
				List<String> monthList = new ArrayList<>(totalReportsMap.keySet());
				List<Integer> pulseCountList = new ArrayList<>(totalReportsMap.values());

				Map<String, Object> responseMap = new HashMap<>();
				responseMap.put("dates", monthList);
				responseMap.put("pulseCounts", pulseCountList);
				responseMap.put("currentMonthTotalPulseCount", totalPulseCount);
				return ResponseEntity.ok(responseMap);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/totalPulseCountForMonth/{selectedMonth}") // Reports generated Monthly
	public ResponseEntity<List<Object[]>> getTotalPulseCountForMonth(@PathVariable String selectedMonth,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				// Extract the month and year from the input
				int year = Integer.parseInt(selectedMonth.split("-")[0]);
				int month = Integer.parseInt(selectedMonth.split("-")[1]);
				List<Object[]> pulseCounts = userRepository.getPulseCountsForMonth(month, year);
				return ResponseEntity.ok(pulseCounts);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/totalReportsYearly") // Reports generated Yearly
	public ResponseEntity<Map<String, Object>> getTotalReportsYearly(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				Map<Integer, Integer> totalReportsMap = new TreeMap<>(); // TreeMap automatically sorts keys

				// Get the current year
				int currentYear = LocalDate.now().getYear();

				// Fetch pulses for the current year
				List<User> pulses = userService.getPulsesForYear(currentYear);

				// Calculate total pulse count for the current year
				int totalPulseCount = 0;
				for (User pulse : pulses) {
					totalPulseCount += pulse.getPulseCount();
				}

				// Store the total pulse count for the current year
				totalReportsMap.put(currentYear, totalPulseCount);

				// Iterate over the last 5 years
				for (int i = 1; i <= 4; i++) {
					int year = currentYear - i;

					// Fetch pulses for the current year
					pulses = userService.getPulsesForYear(year);

					// Calculate total pulse count for the current year
					totalPulseCount = 0;
					for (User pulse : pulses) {
						totalPulseCount += pulse.getPulseCount();
					}

					// Store the total pulse count for the current year
					totalReportsMap.put(year, totalPulseCount);
				}

				// Create a response map containing year, pulse count arrays, and current year
				// total count
				Map<String, Object> responseMap = new HashMap<>();
				List<Integer> yearList = new ArrayList<>(totalReportsMap.keySet());
				List<Integer> pulseCountList = new ArrayList<>(totalReportsMap.values());
				responseMap.put("dates", yearList);
				responseMap.put("pulseCounts", pulseCountList);
				responseMap.put("currentYearTotalCount", totalReportsMap.get(currentYear)); // Add current year total
																							// count

				return ResponseEntity.ok(responseMap);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/totalPulseCountForYear/{year}")
	public ResponseEntity<Map<Integer, Integer>> getPulseCountsByYear(@PathVariable int year,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<User> users = userRepository.findByDateCreatedYear(year);

				// Initialize a map with all months
				Map<Integer, Integer> pulseCountsByMonth = IntStream.rangeClosed(1, 12).boxed()
						.collect(Collectors.toMap(Function.identity(), month -> 0));

				// Update the map with the actual pulse counts
				users.stream().collect(Collectors.groupingBy(user -> user.getDateCreated().getMonthValue(),
						Collectors.summingInt(User::getPulseCount))).forEach(pulseCountsByMonth::put);

				return ResponseEntity.ok(pulseCountsByMonth);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/chartDataToday")
	public ResponseEntity<Map<String, Object>> loadUserToday(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<User> pulseList = userService.getTodayPulses();

				// Group by email and sum pulse counts
				Map<String, Integer> pulseCountByEmail = pulseList.stream()
						.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

				// Convert the map to a list of User objects
				List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
					User user = new User();
					user.setEmail(entry.getKey());
					user.setName(userService.findNameByEmail(entry.getKey()));
					user.setPulseCount(entry.getValue());
					return user;
				}).collect(Collectors.toList());

				Map<String, Object> responseData = new HashMap<>();
				responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
						new ArrayList<>(pulseCountByEmail.values())));
				responseData.put("pulseList", aggregatedPulseList);
				return ResponseEntity.ok(responseData);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

//	@GetMapping("/chartData/today") // Reports generated today by calendar
//	public ResponseEntity<List<User>> getPulseData(@RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date, HttpServletRequest request) {
//		String authHeader = request.getHeader("Authorization");
//		if (authHeader != null && authHeader.startsWith("Bearer ")) {
//			String token = authHeader.substring(7);
//			String username = jwtService.extractUsername(token);
//			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//			if (jwtService.validateToken(token, userDetails)) {
//				List<User> pulseList = userService.getPulsesByDateCreatedToday(date);
//				return ResponseEntity.ok(pulseList);
//			}
//		}
//		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}

	@GetMapping("/userData/today/{selectedDate}")
	public ResponseEntity<?> getUserData(@PathVariable String selectedDate, HttpServletRequest request) {
		try {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				String username = jwtService.extractUsername(token);
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				if (jwtService.validateToken(token, userDetails)) {
					LocalDate date = LocalDate.parse(selectedDate);
					List<User> userList = userService.getPulsesByDateCreatedToday(date);
					return ResponseEntity.ok(userList);
				}
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
		}
	}

//	@GetMapping("/chartDataWeek")
//	public ResponseEntity<Map<String, Object>> getChartDataForWeek() {
//		List<User> pulseList = userService.getPulsesForPastWeek();
//
//		// Group by email and sum pulse counts
//		Map<String, Integer> pulseCountByEmail = pulseList.stream()
//				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));
//
//		// Convert the map to a list of User objects
//		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
//			User user = new User();
//			user.setEmail(entry.getKey());
//			user.setName(userService.findNameByEmail(entry.getKey()));
//			user.setPulseCount(entry.getValue());
//			return user;
//		}).collect(Collectors.toList());
//		Map<String, Object> responseData = new HashMap<>();
//		responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
//				new ArrayList<>(pulseCountByEmail.values())));
//
//		responseData.put("pulseList", aggregatedPulseList);
//		return ResponseEntity.ok(responseData);
//	}

	@GetMapping("/chartDataWeek")
	public ResponseEntity<Map<String, Object>> getChartDataForWeek(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<User> pulseList = userService.getPulsesForPastWeek();

				// Group by email and sum pulse counts
				Map<String, Integer> pulseCountByEmail = pulseList.stream()
						.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

				// Convert the map to a list of User objects
				List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
					User user = new User();
					user.setEmail(entry.getKey());
					user.setName(userService.findNameByEmail(entry.getKey()));
					user.setPulseCount(entry.getValue());
					return user;
				}).collect(Collectors.toList());

				Map<String, Object> responseData = new HashMap<>();
				responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
						new ArrayList<>(pulseCountByEmail.values())));
				responseData.put("pulseList", aggregatedPulseList);

				return ResponseEntity.ok(responseData);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

//	@GetMapping("/chartDataMonth")
//	public ResponseEntity<Map<String, Object>> getChartDataForMonth() {
//		List<User> pulseList = userService.getPulsesForPastMonth(); 
//
//		// Group by email and sum pulse counts
//		Map<String, Integer> pulseCountByEmail = pulseList.stream()
//				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));
//
//		// Convert the map to a list of User objects
//		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
//			User user = new User();
//			user.setEmail(entry.getKey());
//			user.setName(userService.findNameByEmail(entry.getKey()));
//			user.setPulseCount(entry.getValue());
//			return user;
//		}).collect(Collectors.toList());
//
//		Map<String, Object> responseData = new HashMap<>();
//		responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
//				new ArrayList<>(pulseCountByEmail.values())));
//
//		responseData.put("pulseList", aggregatedPulseList);
//		return ResponseEntity.ok(responseData);
//	}

	@GetMapping("/chartDataMonth")
	public ResponseEntity<Map<String, Object>> getChartDataForMonth(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<User> pulseList = userService.getPulsesForPastMonth();

				// Group by email and sum pulse counts
				Map<String, Integer> pulseCountByEmail = pulseList.stream()
						.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

				// Convert the map to a list of User objects
				List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
					User user = new User();
					user.setEmail(entry.getKey());
					user.setName(userService.findNameByEmail(entry.getKey()));
					user.setPulseCount(entry.getValue());
					return user;
				}).collect(Collectors.toList());

				Map<String, Object> responseData = new HashMap<>();
				responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
						new ArrayList<>(pulseCountByEmail.values())));
				responseData.put("pulseList", aggregatedPulseList);

				return ResponseEntity.ok(responseData);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

//	@GetMapping("/chartData/month")  // Reports generated month by calendar
//	public ResponseEntity<List<User>> getPulseDataForMonth(
//			@RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
//		List<User> pulseList = userService.getPulseDataForMonth(month);
//		return ResponseEntity.ok(pulseList);
//	}

//	@GetMapping("/chartData/month") // Reports generated month by calendar
//	public ResponseEntity<List<User>> getPulseDataForMonth(
//			@RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month, HttpServletRequest request) {
//		String authHeader = request.getHeader("Authorization");
//		if (authHeader != null && authHeader.startsWith("Bearer ")) {
//			String token = authHeader.substring(7);
//			String username = jwtService.extractUsername(token);
//			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//			if (jwtService.validateToken(token, userDetails)) {
//				List<User> pulseList = userService.getPulseDataForMonth(month);
//				return ResponseEntity.ok(pulseList);
//			}
//		}
//		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	}

	@GetMapping("userData/month/{selectedDate}")
	public ResponseEntity<?> getUserDataForMonth(@PathVariable String selectedDate, HttpServletRequest request) {
		try {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				String username = jwtService.extractUsername(token);
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				if (jwtService.validateToken(token, userDetails)) {
					YearMonth month = YearMonth.parse(selectedDate);
					List<User> userList = userService.getPulseDataForMonth(month);
					return ResponseEntity.ok(userList);
				}
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
		}
	}

//	@GetMapping("/chartDataYear")
//	public ResponseEntity<Map<String, Object>> getChartDataForYear() {
//		List<User> pulseList = userService.getPulsesForPastYear();
//
//		// Group by email and sum pulse counts
//		Map<String, Integer> pulseCountByEmail = pulseList.stream()
//				.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));
//
//		// Convert the map to a list of User objects
//		List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
//			User user = new User();
//			user.setEmail(entry.getKey());
//			user.setName(userService.findNameByEmail(entry.getKey()));
//			user.setPulseCount(entry.getValue());
//			return user;
//		}).collect(Collectors.toList());
//
//		Map<String, Object> responseData = new HashMap<>();
//		responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
//				new ArrayList<>(pulseCountByEmail.values())));
//
//		responseData.put("pulseList", aggregatedPulseList);
//		return ResponseEntity.ok(responseData);
//	}

	@GetMapping("/chartDataYear")
	public ResponseEntity<Map<String, Object>> getChartDataForYear(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<User> pulseList = userService.getPulsesForPastYear();

				// Group by email and sum pulse counts
				Map<String, Integer> pulseCountByEmail = pulseList.stream()
						.collect(Collectors.groupingBy(User::getEmail, Collectors.summingInt(User::getPulseCount)));

				// Convert the map to a list of User objects
				List<User> aggregatedPulseList = pulseCountByEmail.entrySet().stream().map(entry -> {
					User user = new User();
					user.setEmail(entry.getKey());
					user.setName(userService.findNameByEmail(entry.getKey()));
					user.setPulseCount(entry.getValue());
					return user;
				}).collect(Collectors.toList());

				Map<String, Object> responseData = new HashMap<>();
				responseData.put("chartData", Map.of("user", new ArrayList<>(pulseCountByEmail.keySet()), "pulse",
						new ArrayList<>(pulseCountByEmail.values())));
				responseData.put("pulseList", aggregatedPulseList);

				return ResponseEntity.ok(responseData);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

//	@GetMapping("/chartData/year")  // Reports generated year by calendar
//	public ResponseEntity<List<User>> getPulseDataForYear(@RequestParam("year") Integer year) {
//		List<User> pulseList = userService.getPulseDataForYear(year);
//		return ResponseEntity.ok(pulseList);
//	}

	@GetMapping("/chartData/year") // Reports generated year by calendar
	public ResponseEntity<List<Map<String, Object>>> getPulseDataForYear(@RequestParam("year") Integer year,
			HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtService.extractUsername(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				List<Map<String, Object>> pulseDataForYear = userService.getUserDataForYear(year);
				return ResponseEntity.ok(pulseDataForYear);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("userData/year/{selectedDate}")
	public ResponseEntity<?> getUserDataForYear(@PathVariable int selectedDate, HttpServletRequest request) {
		try {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				String username = jwtService.extractUsername(token);
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				if (jwtService.validateToken(token, userDetails)) {
					List<Map<String, Object>> userList = userService.getUserDataForYear(selectedDate);
					return ResponseEntity.ok(userList);
				}
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
		}
	}

	@GetMapping("/home")
	public String loadHome(HttpSession session, ModelMap map) {
		if (session.getAttribute("loggedInAdmin") != null)
			return "PulseChartData";
		else {
			map.put("fail", "Session Expired, Login Again");
			return "Login";
		}
	}

}
