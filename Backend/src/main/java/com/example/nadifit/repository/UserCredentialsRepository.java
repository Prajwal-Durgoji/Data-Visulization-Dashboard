package com.example.nadifit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nadifit.dto.UserCredentails;

public interface UserCredentialsRepository extends JpaRepository<UserCredentails, Long> {
    Optional<UserCredentails> findByEmail(String email);
}
