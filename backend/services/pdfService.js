const PDFDocument = require('pdfkit');

/**
 * PDF Service
 * Generates clean, professional, branded travel itinerary PDFs
 */

const generateTripPDF = (trip, res) => {
  const doc = new PDFDocument({
    margin: 45,
    size: 'A4',
    info: {
      Title: trip.title || 'Travel Itinerary',
      Author: 'Smart Travel AI Platform'
    }
  });

  // Stream directly to response
  doc.pipe(res);

  // Styling Constants
  const primaryColor = '#06b6d4';
  const secondaryColor = '#3b82f6';
  const darkTextColor = '#1e293b';
  const lightTextColor = '#64748b';
  const borderColor = '#e2e8f0';

  // --- HEADER SECTION ---
  doc.rect(45, 45, 505, 75).fill('#0f172a');

  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
     .text(trip.title || 'Smart Travel Itinerary', 60, 60);

  doc.fillColor('#38bdf8').fontSize(11).font('Helvetica')
     .text(`Destination: ${trip.destination}   •   Duration: ${trip.durationDays} Days   •   Travelers: ${trip.travelers} Persons`, 60, 90);

  doc.moveDown(3);

  // --- TRIP OVERVIEW & SUMMARY BOX ---
  let yPos = 135;
  doc.rect(45, yPos, 505, 80).fill('#f8fafc').stroke(borderColor);

  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
     .text('TRIP OVERVIEW & BUDGET', 60, yPos + 12);

  doc.fillColor(darkTextColor).fontSize(10).font('Helvetica')
     .text(`Target Budget: Rs. ${(trip.budget || 0).toLocaleString('en-IN')}`, 60, yPos + 32)
     .text(`ML Estimated Budget: Rs. ${(trip.estimatedBudget || 0).toLocaleString('en-IN')}`, 60, yPos + 48)
     .text(`Selected Hotel: ${trip.hotel?.name || 'Standard 3-Star Resort'} (${trip.hotel?.rating || 3}★)`, 60, yPos + 64);

  doc.fillColor(darkTextColor).fontSize(10).font('Helvetica')
     .text(`Weather: ${trip.weatherSummary?.temp || 28}°C, ${trip.weatherSummary?.condition || 'Pleasant'}`, 300, yPos + 32)
     .text(`Rain Probability: ${trip.weatherSummary?.rainChance || 10}%`, 300, yPos + 48)
     .text(`Status: Confirmed Planning`, 300, yPos + 64);

  yPos += 95;

  // --- BUDGET BREAKDOWN TABLE ---
  if (trip.budgetBreakdown) {
    doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
       .text('ESTIMATED BUDGET BREAKDOWN', 45, yPos);
    yPos += 18;

    const b = trip.budgetBreakdown;
    const items = [
      ['Transportation (Flights/Transit)', `Rs. ${(b.transport || 0).toLocaleString('en-IN')}`],
      ['Accommodation (Hotels/Resort)', `Rs. ${(b.accommodation || 0).toLocaleString('en-IN')}`],
      ['Food & Dining', `Rs. ${(b.food_and_dining || 0).toLocaleString('en-IN')}`],
      ['Activities & Sightseeing', `Rs. ${(b.activities || 0).toLocaleString('en-IN')}`],
      ['Local Transit & Contingency', `Rs. ${(b.contingency_and_local || 0).toLocaleString('en-IN')}`]
    ];

    items.forEach(([label, cost]) => {
      doc.fillColor(darkTextColor).fontSize(9).font('Helvetica').text(label, 50, yPos);
      doc.font('Helvetica-Bold').text(cost, 430, yPos, { width: 110, align: 'right' });
      yPos += 14;
    });

    yPos += 10;
  }

  // --- DAY-BY-DAY ITINERARY ---
  doc.fillColor(secondaryColor).fontSize(14).font('Helvetica-Bold')
     .text('DAY-BY-DAY ITINERARY', 45, yPos);
  yPos += 20;

  if (trip.itinerary && trip.itinerary.length > 0) {
    trip.itinerary.forEach((day) => {
      // Check page break
      if (yPos > 680) {
        doc.addPage();
        yPos = 50;
      }

      // Day Header
      doc.rect(45, yPos, 505, 24).fill('#e0f2fe');
      doc.fillColor('#0369a1').fontSize(11).font('Helvetica-Bold')
         .text(`Day ${day.dayNumber}: ${day.theme || day.title}`, 55, yPos + 6);
      yPos += 30;

      // Activities
      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((act) => {
          if (yPos > 720) {
            doc.addPage();
            yPos = 50;
          }

          doc.fillColor('#0284c7').fontSize(9).font('Helvetica-Bold')
             .text(`[${act.time || '10:00 AM'}]`, 55, yPos);

          doc.fillColor(darkTextColor).fontSize(9).font('Helvetica-Bold')
             .text(act.title, 130, yPos);

          if (act.estimatedCost > 0) {
            doc.fillColor(lightTextColor).fontSize(8).font('Helvetica')
               .text(`(Est: Rs. ${act.estimatedCost})`, 450, yPos, { width: 90, align: 'right' });
          }

          yPos += 12;

          if (act.description) {
            doc.fillColor(lightTextColor).fontSize(8).font('Helvetica')
               .text(act.description, 130, yPos, { width: 410 });
            yPos += 14;
          } else {
            yPos += 4;
          }
        });
      }

      yPos += 8;
    });
  }

  // --- PACKING LIST ---
  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  } else {
    yPos += 15;
  }

  doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold')
     .text('WEATHER-AWARE PACKING CHECKLIST', 45, yPos);
  yPos += 18;

  if (trip.packingList && trip.packingList.length > 0) {
    trip.packingList.forEach(cat => {
      if (yPos > 720) {
        doc.addPage();
        yPos = 50;
      }

      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold')
         .text(`• ${cat.category}:`, 55, yPos);
      yPos += 12;

      const itemsStr = cat.items.map(it => it.name).join('  |  ');
      doc.fillColor(lightTextColor).fontSize(8).font('Helvetica')
         .text(itemsStr, 70, yPos, { width: 470 });
      yPos += 18;
    });
  }

  // --- IMPORTANT TRAVEL NOTES & ADVICE ---
  yPos += 10;
  if (yPos > 700) {
    doc.addPage();
    yPos = 50;
  }

  doc.rect(45, yPos, 505, 55).fill('#f1f5f9');
  doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold')
     .text('IMPORTANT TRAVEL NOTES:', 55, yPos + 8);
  doc.fillColor(lightTextColor).fontSize(8).font('Helvetica')
     .text('1. Keep digital copies of ID and booking vouchers on your mobile device.\n2. In case of localized weather changes, prioritize indoor cultural museums and markets.\n3. Generated with Smart Travel AI Platform — Have a wonderful trip!', 55, yPos + 22);

  // Finalize PDF
  doc.end();
};

module.exports = { generateTripPDF };
