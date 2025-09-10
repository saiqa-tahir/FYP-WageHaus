const PDFDocument = require('pdfkit');

const generateResumePDF = (resume, res) => {
  const doc = new PDFDocument();
  const filename = `${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  // Set response headers for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  // Pipe the PDF document directly to the response
  doc.pipe(res);

  // Generate PDF content
  doc.text(`Name: ${resume.fullName}`, { align: 'left' });
  doc.text(`Email: ${resume.email}`, { align: 'left' });
  doc.text(`Phone: ${resume.phoneNumber}`, { align: 'left' });

  const education = resume.education || {};
  doc.text(
    `Education: ${education.degree || ''} from ${education.institution || ''} (${education.graduationYear || ''})`,
    { align: 'left' }
  );

  doc.text(`Skills: ${resume.skills?.join(', ') || ''}`, { align: 'left' });
  doc.text(`Certifications: ${resume.certifications?.join(', ') || ''}`, { align: 'left' });
  doc.text(`Hobbies: ${resume.hobbies?.join(', ') || ''}`, { align: 'left' });

  resume.experience?.forEach((exp, index) => {
    doc.text(`Experience ${index + 1}:`, { align: 'left', underline: true });
    doc.text(`- ${exp.jobTitle || ''} at ${exp.companyName || ''} (${exp.duration || ''})`, { align: 'left' });
  });

  // Finalize the PDF document
  doc.end();
};

module.exports = { generateResumePDF };
