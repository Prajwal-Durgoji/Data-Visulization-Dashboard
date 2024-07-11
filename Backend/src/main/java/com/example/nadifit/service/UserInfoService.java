package com.example.nadifit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.Admin;
import com.example.nadifit.repository.AdminRepository;

@Service
public class UserInfoService implements UserDetailsService {

	@Autowired
	private AdminRepository repository;


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Admin userDetail = repository.findByEmail(username);

        if (userDetail == null) {
            throw new UsernameNotFoundException("User not found " + username);
        }
        return new UserInfoDetails(userDetail);
	}

}
