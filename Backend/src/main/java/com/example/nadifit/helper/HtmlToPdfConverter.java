//package com.example.nadifit.helper;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.nio.charset.StandardCharsets;
//
//import org.openqa.selenium.By;
//import org.openqa.selenium.Keys;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.openqa.selenium.chrome.ChromeOptions;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Component;
//import org.springframework.stereotype.Service;
//import org.springframework.util.StreamUtils;
//
//import com.itextpdf.html2pdf.HtmlConverter;
//
//import jakarta.servlet.http.HttpServletResponse;
//
//@Service
//public class HtmlToPdfConverter {
//	public void generatePdf(HttpServletResponse response) throws IOException {
//        // Load the HTML file from the classpath
//        ClassPathResource resource = new ClassPathResource("templates/Report.html");
//
//        // Read the HTML content as a String
//        InputStream inputStream = resource.getInputStream();
//        String htmlContent = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
//
//        // Set response headers
//        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
//        response.setHeader("Content-Disposition", "inline; filename=Report.pdf");
//
//        // Convert HTML to PDF and write it to the servlet output stream
//        HtmlConverter.convertToPdf(htmlContent, response.getOutputStream());
//    }
//	
//	public void generateChartPdf(HttpServletResponse response) {
//        // Set path to ChromeDriver executable
//        System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
//
//        // Set Chrome options for headless mode
//        ChromeOptions options = new ChromeOptions();
//        options.addArguments("--headless");
//        options.addArguments("--disable-gpu");
//
//        // Initialize WebDriver
//        WebDriver driver = new ChromeDriver(options);
//
//        try {
//            // Load the HTML file containing the Highcharts chart
//            driver.get("file:///path/to/Report.html");
//
//            // Wait for the chart to render (you may need to adjust the wait time)
//            Thread.sleep(5000);
//
//            // Save the rendered HTML as PDF
//            driver.manage().window().maximize();
//            driver.findElement(By.tagName("body")).sendKeys(Keys.CONTROL, "p");
//            Thread.sleep(2000);  // Wait for the print dialog to appear
//            driver.findElement(By.cssSelector("button[data-testid='print-button']")).click();
//            Thread.sleep(5000);  // Wait for the PDF to be generated
//
//            // You can also save the PDF using libraries like Apache PDFBox or iText
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        } finally {
//            // Quit the WebDriver
//            driver.quit();
//        }
//    }
//}
