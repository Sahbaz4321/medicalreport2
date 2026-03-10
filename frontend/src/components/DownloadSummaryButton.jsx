import React from 'react';
import jsPDF from 'jspdf';

const DownloadSummaryButton = ({ analysis }) => {
  const handleDownload = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    let y = 10;

    // Enhanced Header with gradient effect
    doc.setFillColor(11, 94, 215);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('AI Medical Report Analysis', 10, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Powered by AI Medical Report Analyzer', 10, 22);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 28);
    doc.setTextColor(0, 0, 0);
    y = 40;

    // Patient Information Section
    if (analysis.patient || analysis.reportType || analysis.date) {
      doc.setFillColor(240, 248, 255);
      doc.rect(10, y - 5, 190, 20, 'F');
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Report Information', 15, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      const patientInfo = analysis.patient?.name || 'Patient';
      doc.text(`Patient: ${patientInfo}`, 15, y);
      y += 5;
      doc.text(`Report Type: ${analysis.reportType || 'Medical Report'}`, 15, y);
      y += 5;
      doc.text(`Date: ${analysis.date || new Date().toLocaleDateString()}`, 15, y);
      doc.setTextColor(0, 0, 0);
      y += 10;
    }

    // Health Score Section with enhanced visualization
    doc.setFillColor(245, 245, 250);
    doc.rect(10, y - 5, 190, 35, 'F');
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Health Assessment', 15, y);
    y += 8;
    
    const score = Math.max(0, Math.min(100, Number(analysis.riskScore || 0)));
    const riskLevel = analysis.riskLevel || 'Unknown';
    
    // Score display
    doc.setFontSize(20);
    const scoreColor = score >= 70 ? [220, 53, 69] : score >= 40 ? [255, 193, 7] : [25, 135, 84];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${score}/100`, 15, y + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Risk Level: ${riskLevel}`, 60, y + 5);
    y += 10;
    
    // Enhanced risk bar
    const barW = 160;
    const barH = 8;
    doc.setFillColor(220, 220, 230);
    doc.roundedRect(15, y, barW, barH, 4, 4, 'F');
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(15, y, (barW * score) / 100, barH, 4, 4, 'F');
    
    // Risk scale labels
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Low', 15, y + 12);
    doc.text('Medium', 85, y + 12);
    doc.text('High', 165, y + 12);
    doc.setTextColor(0, 0, 0);
    y += 20;

    // AI Summary Section
    if (analysis.summary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('AI Summary', 10, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setFillColor(250, 250, 250);
      doc.rect(10, y - 3, 190, 3, 'F');
      const summaryLines = doc.splitTextToSize(analysis.summary, 190);
      summaryLines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 15, y);
        y += 5;
      });
      y += 5;
    }

    // Medical Parameters Table
    if (analysis.metrics && analysis.metrics.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Medical Parameters', 10, y);
      y += 8;
      
      // Table header
      doc.setFillColor(11, 94, 215);
      doc.rect(10, y - 5, 190, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Parameter', 15, y);
      doc.text('Value', 80, y);
      doc.text('Status', 130, y);
      doc.text('Normal Range', 160, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
      
      // Table rows
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      analysis.metrics.forEach((m, index) => {
        if (y > 260) {
          doc.addPage();
          y = 10;
          // Repeat header on new page
          doc.setFillColor(11, 94, 215);
          doc.rect(10, y - 5, 190, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont(undefined, 'bold');
          doc.text('Parameter', 15, y);
          doc.text('Value', 80, y);
          doc.text('Status', 130, y);
          doc.text('Normal Range', 160, y);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          doc.setFont(undefined, 'normal');
          y += 8;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 250);
          doc.rect(10, y - 4, 190, 6, 'F');
        }
        
        // Status color coding
        const statusColor = m.color === 'red' ? [220, 53, 69] : m.color === 'yellow' ? [255, 193, 7] : [25, 135, 84];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(m.status || 'Unknown', 130, y);
        
        doc.setTextColor(0, 0, 0);
        doc.text((m.label || '').slice(0, 25), 15, y);
        doc.text(`${m.value || ''} ${m.unit || ''}`, 80, y);
        doc.text((m.normalRange || '').slice(0, 25), 160, y);
        y += 6;
      });
      y += 5;
    }

    // Enhanced Chart Section
    if (analysis.metrics && analysis.metrics.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Visual Analysis', 10, y);
      y += 8;
      
      const chartTop = y;
      const maxBars = Math.min(8, analysis.metrics.length);
      const chartHeight = maxBars * 10 + 10;
      
      // Chart background
      doc.setFillColor(250, 250, 250);
      doc.rect(10, chartTop - 5, 190, chartHeight, 'F');
      
      // Chart bars
      for (let i = 0; i < maxBars; i++) {
        const m = analysis.metrics[i];
        const v = Math.max(0, Math.min(100, Number(m.value || 0)));
        const rowY = chartTop + i * 10 + 5;
        
        // Parameter label
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        doc.text((m.label || '').slice(0, 20), 15, rowY);
        
        // Bar background
        doc.setFillColor(220, 220, 230);
        doc.rect(75, rowY - 3, 100, 6, 'F');
        
        // Colored bar
        const barColor = m.color === 'red' ? [220, 53, 69] : m.color === 'yellow' ? [255, 193, 7] : [25, 135, 84];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(75, rowY - 3, (100 * v) / 100, 6, 'F');
        
        // Value label
        doc.setTextColor(0, 0, 0);
        doc.text(`${v}`, 180, rowY);
      }
      y = chartTop + chartHeight + 5;
    }

    // Recommendations Section
    if (analysis.dietAndLifestyle && analysis.dietAndLifestyle.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Diet & Lifestyle Recommendations', 10, y);
      y += 8;
      
      doc.setFillColor(240, 255, 240);
      doc.rect(10, y - 5, 190, 3, 'F');
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      analysis.dietAndLifestyle.forEach((item, index) => {
        if (y > 260) {
          doc.addPage();
          y = 10;
        }
        
        // Bullet point with custom styling
        doc.setFillColor(25, 135, 84);
        doc.circle(15, y - 1, 2, 'F');
        
        const lines = doc.splitTextToSize(item, 175);
        lines.forEach((line, lineIndex) => {
          doc.text(line, 20, y + (lineIndex * 4));
        });
        y += lines.length * 4 + 3;
      });
      y += 5;
    }

    // Doctor Recommendations
    if (analysis.doctorRecommendation) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Medical Recommendations', 10, y);
      y += 8;
      
      doc.setFillColor(255, 248, 220);
      doc.rect(10, y - 5, 190, 3, 'F');
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const recLines = doc.splitTextToSize(analysis.doctorRecommendation, 190);
      recLines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 15, y);
        y += 5;
      });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('This report was generated by AI Medical Report Analyzer and should be reviewed by a healthcare professional.', 10, pageHeight - 8);
    doc.text('© 2024 AI Medical Report Analyzer - All rights reserved', 10, pageHeight - 3);

    // Save with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    doc.save(`health-report-${timestamp}.pdf`);
  };

  return (
    <button
      type="button"
      className="btn btn-primary btn-glow rounded-pill px-3 py-2"
      onClick={handleDownload}
      disabled={!analysis}
    >
      <i className="bi bi-file-earmark-pdf me-2"></i>
      Download PDF Report
    </button>
  );
};

export default DownloadSummaryButton;

