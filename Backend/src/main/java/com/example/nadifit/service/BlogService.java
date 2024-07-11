package com.example.nadifit.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.Blog;
import com.example.nadifit.repository.BlogRepository;

@Service
public class BlogService {

	@Autowired
	BlogRepository blogRepository;

	public void saveBlog(Blog blog) {
		blogRepository.save(blog);

	}

	public List<Blog> getAllBlogs() {
		return blogRepository.findAll();
	}

	


}
