package com.example.nadifit.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.UserCredentails;
import com.example.nadifit.repository.UserCredentialsRepository;

@Service
public class UserCredentialsService {

	@Autowired
    private UserCredentialsRepository userCredentialsRepository;

    public UserCredentails saveUserCredentials(UserCredentails userCredentials) {
        return userCredentialsRepository.save(userCredentials);
    }

    public Optional<UserCredentails> getUserCredentialsByEmail(String email) {
        return userCredentialsRepository.findByEmail(email);
    }

	
}
