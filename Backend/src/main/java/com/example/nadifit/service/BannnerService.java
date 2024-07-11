package com.example.nadifit.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.ResourceClosedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.nadifit.dto.Banner;
import com.example.nadifit.repository.BannerRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class BannnerService {

	@Autowired
	BannerRepository bannerRepository;

	@PersistenceContext
	private EntityManager entityManager;

	public List<Banner> findBannerRange(int start, int limit) {
		Pageable pageable = PageRequest.of(start, limit);
		Page<Banner> page = bannerRepository.findAll(pageable);
		return page.getContent();
	}

	@Transactional
	public void deleteAndRearrangeBanners(List<Long> bannerIds) {
		// Delete the specified banners
		bannerRepository.deleteByIdIn(bannerIds);
		// Fetch the remaining banners in the desired order
		List<Banner> remainingBanners = bannerRepository.findAll(Sort.by(Sort.Order.asc("id")));
		System.out.println(remainingBanners);

		for (int i = 0; i < remainingBanners.size(); i++) {
			Banner banner = remainingBanners.get(i);
			bannerRepository.updateBannerIdById(banner.getId(), (long) (i + 1));
		}

		// Save all banners back to the database
		bannerRepository.saveAll(remainingBanners);

	}

	public List<Banner> getAllBanners() {
		 Sort sort = Sort.by(Sort.Direction.DESC, "id");
	        Pageable pageable = PageRequest.of(0, 4, sort);
	        List<Banner> banners = bannerRepository.findAll(pageable).getContent();

	        // Sort the banners in ascending order based on ID
	        List<Banner> sortedBanners = banners.stream()
	                .sorted(Comparator.comparing(Banner::getId))
	                .collect(Collectors.toList());

	        return sortedBanners;
	}

	public void saveBanner(Banner banner) {
		bannerRepository.save(banner);
	}

	public void deleteBanner(Long bannerId) {
		bannerRepository.deleteById(bannerId);

	}

	public void saveNewBanners(List<String> newTexts) {
		List<Banner> newBanners = newTexts.stream().map(text -> {
			Banner banner = new Banner();
			banner.setText(text);
			return banner;
		}).collect(Collectors.toList());

		// Retrieve existing banners
		List<Banner> existingBanners = getAllBanners();

		// Replace existing banners with new ones
		if (newBanners.size() >= 4) {
			existingBanners.clear();
			existingBanners.addAll(newBanners.subList(0, 4));
		} else {
			existingBanners.clear();
			existingBanners.addAll(newBanners);
		}

		// Save all banners
		bannerRepository.saveAll(existingBanners);
	}

	public Banner updateBanner(Banner banner) {
		Optional<Banner> existingBanner = bannerRepository.findById(banner.getId());

        if (existingBanner.isPresent()) {
            Banner updatedBanner = existingBanner.get();
            updatedBanner.setText(banner.getText());
            return bannerRepository.save(updatedBanner);
        } else {
            throw new ResourceClosedException("Banner not found with id " + banner.getId());
        }
	}

}
