import { jsPDF } from 'jspdf';

interface PDFTheme {
  primary: string;
  secondary: string;
  text: string;
  headerFont: string;
  bodyFont: string;
}

const defaultTheme: PDFTheme = {
  primary: '#2563eb',    // Blue
  secondary: '#64748b',  // Slate
  text: '#1f2937',      // Dark Gray
  headerFont: 'helvetica',
  bodyFont: 'helvetica'
};

export function generateResumePDF(
  aboutMe: string,
  education: string,
  skills: string,
  experience: string,
  projects: string,
  profileImage: string | null = null,
  theme: PDFTheme = defaultTheme
) {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (2 * margin);

  // Helper function for text wrapping
  function addWrappedText(
    text: string,
    y: number,
    options: {
      maxWidth?: number;
      fontSize?: number;
      align?: 'left' | 'center' | 'right';
      lineHeight?: number;
    } = {}
  ): number {
    const {
      maxWidth = contentWidth,
      fontSize = 12,
      align = 'left',
      lineHeight = 7
    } = options;

    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, align === 'center' ? pageWidth / 2 : margin, y, { align });
    return y + (lines.length * lineHeight);
  }

  // Add decorative header
  doc.setFillColor(theme.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Add profile image if provided
  if (profileImage) {
    try {
      doc.addImage(profileImage, 'JPEG', margin, 10, 30, 30);
      yPos = 50;
    } catch (error) {
      console.error('Error adding profile image:', error);
    }
  }

  // Title
  doc.setTextColor('#ffffff');
  doc.setFontSize(28);
  doc.setFont(theme.headerFont, 'bold');
  doc.text('Professional Resume', pageWidth / 2, 25, { align: 'center' });
  yPos = 50;

  // Section rendering function
  function renderSection(
    title: string,
    content: string,
  ): number {
    // Section header with accent bar
    doc.setFillColor(theme.primary);
    doc.rect(margin, yPos, 3, 8, 'F');
    
    doc.setTextColor(theme.text);
    doc.setFontSize(16);
    doc.setFont(theme.headerFont, 'bold');
    doc.text(title, margin + 10, yPos + 8);
    yPos += 15;

    // Content
    doc.setTextColor(theme.secondary);
    doc.setFontSize(11);
    doc.setFont(theme.bodyFont, 'normal');

    if (title === 'Skills') {
      // Handle skills as a grid
      const skills = content.split(',').map(s => s.trim());
      const skillsPerRow = 3;
      const skillWidth = contentWidth / skillsPerRow;

      skills.forEach((skill, index) => {
        const xPos = margin + (index % skillsPerRow) * skillWidth;
        const currentY = yPos + Math.floor(index / skillsPerRow) * 12;
        
        doc.setFillColor(theme.primary);
        doc.setTextColor(theme.text);
        doc.circle(xPos + 3, currentY - 3, 1, 'F');
        doc.text(skill, xPos + 8, currentY);
      });

      yPos += Math.ceil(skills.length / skillsPerRow) * 12 + 10;
    } else {
      yPos = addWrappedText(content, yPos, {
        lineHeight: 6,
        fontSize: 11
      });
      yPos += 10;
    }

    // Add page if needed
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    return yPos;
  }

  // Render all sections
  renderSection('About Me', aboutMe);
  renderSection('Experience', experience);
  renderSection('Education', education);
  renderSection('Skills', skills);
  renderSection('Projects', projects);

  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(theme.secondary);
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Generated on ${currentDate}`, margin, pageHeight - 10);
  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save('professional-resume.pdf');
}