//package com.example.nadifit.helper;
//
//import org.jfree.chart.JFreeChart;
//import org.jfree.chart.plot.CategoryPlot;
//import org.jfree.data.category.CategoryDataset;
//
//import net.sf.jasperreports.engine.JRChart;
//import net.sf.jasperreports.engine.JRDataset;
//import net.sf.jasperreports.engine.JasperPrint;
//
//public class ChartAssociator {
//	
//	public void associateSecondDataset(JasperPrint jasperPrint) {
//        // Retrieve the chart from the JasperPrint object
//        JRChart jrChart = (JRChart) jasperPrint.getPages().get(0).getElements().stream()
//                .filter(e -> e instanceof JRChart)
//                .findFirst()
//                .orElse(null);
//        
//        if (jrChart != null) {
//            // Get the plot of the chart
//            CategoryPlot plot = (CategoryPlot) jrChart.getPlot();
//
//            // Map the second dataset to the plot
//            JRDataset jrDataset2 = (JRDataset) jasperPrint.getMainDataset().getDatasetMap().get("EnergyLevelDataSet2");
//            CategoryDataset dataset2 = (CategoryDataset) jrDataset2.getDataset();
//            plot.setDataset(1, dataset2);
//
//            // Optionally, configure renderer, axis, etc.
//            // Example:
//            // plot.setRenderer(1, new BarRenderer());
//            // plot.setRangeAxis(1, new NumberAxis("Range 2"));
//            // plot.mapDatasetToRangeAxis(1, 1);
//        } else {
//            System.out.println("No chart found in the JasperPrint object.");
//        }
//    }
//
//}
