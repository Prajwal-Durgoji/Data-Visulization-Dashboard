package com.example.nadifit.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.example.nadifit.dto.Distributor;
import com.example.nadifit.dto.DistributorInfo;
import com.example.nadifit.repository.DistributorRepository;
import com.example.nadifit.repository.AdminViewOrdersRepository;

@Service
public class DistributorService {

	@Autowired
	DistributorRepository distributorRepository;

	@Autowired
	AdminViewOrdersRepository adminViewOrdersRepository;

	public Distributor saveDistributor(Distributor distributor) {
		return distributorRepository.save(distributor);
	}

	public List<DistributorInfo> getAllDistributors() {
		List<Distributor> distributors = distributorRepository.findAll();
		List<DistributorInfo> distributorInfos = new ArrayList<>();

		for (Distributor distributor : distributors) {
			DistributorInfo distributorInfo = convertToDistributorInfo(distributor);
			distributorInfos.add(distributorInfo);
		}
		return distributorInfos;

	}

	private DistributorInfo convertToDistributorInfo(Distributor distributor) {
		DistributorInfo dto = new DistributorInfo();
		dto.setName(distributor.getName());
		dto.setPhoneNumber(distributor.getPhoneNumber());
		dto.setDateCreated(distributor.getDateCreated());
		return dto;
	}

	public boolean authenticateDistributor(String email, String password) {
		Distributor distributor = distributorRepository.findByEmail(email);
		return distributor != null && distributor.getPassword().equals(password);
	}

	public Distributor getDistributorByEmail(String targetEmail) {
		return distributorRepository.findByEmail(targetEmail);
	}

	public boolean isEmailAlreadyExists(String email) {
		return distributorRepository.existsByEmail(email);
	}

	public boolean deleteDistributor(long id) {
		Optional<Distributor> optionalDistributor = distributorRepository.findById(id);
		if (optionalDistributor.isPresent()) {
			Distributor distributor = optionalDistributor.get();
			distributorRepository.delete(distributor);
			return true;
		}
		return false;

	}

	public String editDistributor(long id, ModelMap map) {
		Optional<Distributor> optionalDistributor = distributorRepository.findById(id);
		if (optionalDistributor.isPresent()) {
	        Distributor distributor = optionalDistributor.get();
	        
	        map.put("distributor", distributor);
	        return "EditDistributor"; 
	    } else {
	        map.put("fail", "Distributor not found");
	        return "AdminHome"; 
	    }
	}

	


}
