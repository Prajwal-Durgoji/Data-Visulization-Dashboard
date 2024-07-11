package com.example.nadifit.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.nadifit.dto.EnergyLevelChart;
import com.example.nadifit.dto.EnergyLevelResponse;
import com.example.nadifit.dto.Patient;
import com.example.nadifit.repository.EnergyLevelChartRepository;
import com.example.nadifit.repository.PatientRepository;

@Service
public class PatientService {

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	EnergyLevelChartRepository chartRepository;

	public List<EnergyLevelChart> getAllEnergyLevelData() {
		return chartRepository.findAll();
	}

	public List<Patient> getAllPatients() {
		return patientRepository.findAll();
	}

	public List<EnergyLevelResponse> fetchDataAndGroupByCategory() {
		// Fetch all records from the database
	    List<EnergyLevelChart> records = chartRepository.findAll();

	    // Group the records by category
	    Map<Integer, List<EnergyLevelChart>> groupedRecords = records.stream().collect(Collectors.groupingBy(EnergyLevelChart::getCategory));
	    System.out.println(groupedRecords);
	    
	    // Convert each group to an EnergyLevelResponse
	    List<EnergyLevelResponse> responses = new ArrayList<>();
	    for (Map.Entry<Integer, List<EnergyLevelChart>> entry : groupedRecords.entrySet()) {
	        EnergyLevelResponse response = new EnergyLevelResponse();
	        response.setCategory(entry.getKey());
	        System.out.println(response);
	        response.setPnames(entry.getValue().stream().map(EnergyLevelChart::getPname).collect(Collectors.toList()));
	        System.out.println(response);
	        response.setPcounts(entry.getValue().stream().mapToDouble(EnergyLevelChart::getPcount).toArray());
	        System.out.println(response);
	        responses.add(response);
	    }
	    return responses;
	}


	


	

//	@Autowired
//	private JasperReport patientsReport;
//
//	public void generatePdfReport(HttpServletResponse response) throws JRException, IOException {
//		List<Patient> patients = patientRepository.findAll();
//		System.out.println("list of patients " + patients);
//		List<EnergyLevelChart> energyLevelData = chartRepository.findAllEnergyLeveChart();
//		System.out.println("list of energyLevelChart " + energyLevelData);
//
//		// Group energy level data into arrays of 15 records each
//		List<List<EnergyLevelChart>> energyLevelArrays = new ArrayList<>();
//		for (int i = 0; i < energyLevelData.size(); i += 15) {
//			int endIndex = Math.min(i + 15, energyLevelData.size());
//			System.out.println(endIndex);
//			energyLevelArrays.add(energyLevelData.subList(i, endIndex));
//			System.out.println(energyLevelArrays);
//		}
//
//		// Multiply each pcount value by 100
//		for (EnergyLevelChart energyLevel : energyLevelData) {
//			energyLevel.setPcount(energyLevel.getPcount() * 100);
//		}
//		JRBeanCollectionDataSource patientDataSource = new JRBeanCollectionDataSource(patients);
//		System.out.println("JRBean of patientDataSource" + patientDataSource);
//		JRBeanCollectionDataSource energyLevelDataSource = new JRBeanCollectionDataSource(energyLevelData);
//		System.out.println("JRBean of energyLevelDataSource" + energyLevelData);
//
//		Map<String, Object> parameters = new HashMap<>();
//		parameters.put("patientDataSource", patientDataSource);
//		System.out.println("parameters of patientDataSource" + parameters);
//		parameters.put("energyLevelDataSource", energyLevelDataSource);
//		System.out.println("parameters of energyLevelDataSource" + parameters);


//		response.setContentType("application/pdf");
//		response.setHeader("Content-Disposition", "inline; filename=patientsReport.pdf");
//
//		JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());
//	}
	
	

}
