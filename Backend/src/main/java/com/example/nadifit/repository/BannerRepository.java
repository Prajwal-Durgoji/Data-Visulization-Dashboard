package com.example.nadifit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.nadifit.dto.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

	void deleteByIdIn(List<Long> bannerIds);

	List<Banner> findByIdIn(List<Long> bannerIds);

	@Modifying
	@Query("UPDATE Banner b SET b.id = :newId WHERE b.id = :oldId")
	void updateBannerIdById(@Param("oldId") Long oldId, @Param("newId") Long newId);

}
