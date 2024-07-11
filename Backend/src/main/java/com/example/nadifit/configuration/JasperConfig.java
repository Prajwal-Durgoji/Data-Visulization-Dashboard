package com.example.nadifit.configuration;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;

@Configuration
public class JasperConfig {

//	@Value("classpath:Report.jrxml")
//	private Resource resourceFile;
//
//	@Bean(name = "patientsReport")
//	public JasperReport compileReport() throws FileNotFoundException, IOException, JRException {
//		File file = ResourceUtils.getFile(resourceFile.getURI());
//	    JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
//	    return jasperReport;
//	}
}
