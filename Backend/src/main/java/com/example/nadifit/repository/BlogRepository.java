package com.example.nadifit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nadifit.dto.Blog;

public interface BlogRepository extends JpaRepository<Blog, Long>{

}
