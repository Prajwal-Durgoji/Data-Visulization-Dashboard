package com.example.nadifit.helper;

import java.awt.Color;

import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.NumberTickUnit;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.renderer.category.BarRenderer;
import net.sf.jasperreports.engine.JRAbstractChartCustomizer;
import net.sf.jasperreports.engine.JRChart;

public class YAxisCustomizer extends JRAbstractChartCustomizer {

	@Override
	public void customize(JFreeChart chart, JRChart jasperChart) {
		CategoryPlot plot = (CategoryPlot) chart.getPlot();
		BarRenderer renderer = (BarRenderer) plot.getRenderer();
		
		CategoryAxis xAxis = plot.getDomainAxis();
		NumberAxis rangeAxis1 = new NumberAxis();
		rangeAxis1.setRange(-100, 100);
		rangeAxis1.setTickUnit(new NumberTickUnit(50)); // Set tick unit to 50
		
		// Remove the x-axis labels
        xAxis.setTickLabelsVisible(false);
        
        // Remove the legend
        chart.removeLegend();
        
		// Assigning range axes to the plot
		plot.setRangeAxis(0, rangeAxis1);

		// Set the color for the series
        renderer.setSeriesPaint(0, Color.green);
        renderer.setSeriesPaint(1, Color.black);
        renderer.setSeriesPaint(2, Color.red);
        renderer.setSeriesPaint(3, Color.yellow);
        renderer.setSeriesPaint(4, Color.black);
        renderer.setSeriesPaint(5, Color.red);
        renderer.setSeriesPaint(6, Color.blue);
        renderer.setSeriesPaint(7, Color.black);
        renderer.setSeriesPaint(8, Color.red);
        renderer.setSeriesPaint(9, Color.cyan);
        renderer.setSeriesPaint(10, Color.black);
        renderer.setSeriesPaint(11, Color.red);
        renderer.setSeriesPaint(12, Color.gray);
        renderer.setSeriesPaint(13, Color.black);
        renderer.setSeriesPaint(14, Color.red);
        
//     // Adjust this value to increase or decrease the bar thickness
    	renderer.setMaximumBarWidth(+0.88);
//        
//		// as much margin decrease that much bar width increase
		renderer.setItemMargin(-0.6);
		
		
		
	}

}
