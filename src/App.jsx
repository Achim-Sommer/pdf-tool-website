import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FaGithub } from 'react-icons/fa';
import heic2any from 'heic2any';
import UploadZone from './components/UploadZone';
import FileList from './components/FileList';
import ProgressBar from './components/ProgressBar';
import PDFPreview from './components/PDFPreview';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #000548 0%, #000328 100%)'
    : 'linear-gradient(135deg, #000548 0%, #000436 100%)'};
  padding: 2rem 0;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  animation: fadeIn 0.5s ease-out 0.2s both;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  flex: 1;
`;

const ContentSection = styled.section`
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
  animation: fadeIn 0.5s ease-out;
`;

const MergeButton = styled.button`
  background: linear-gradient(135deg, #eb003c 0%, #c4002f 100%);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(235, 0, 60, 0.2);
  margin-top: 2rem;

  &:disabled {
    background: ${props => props.theme === 'dark' ? '#444444' : '#cccccc'};
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(235, 0, 60, 0.3);
  }

  &:not(:disabled):active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(235, 0, 60, 0.2);
  }
`;

const Footer = styled.footer`
  width: 100%;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  text-align: center;
  padding: 1.5rem 0;
  border-top: 2px solid ${props => props.theme === 'dark' ? '#444' : '#ccc'};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const FooterLink = styled.a`
  color: ${props => props.theme === 'dark' ? '#4da6ff' : '#0066cc'};
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.theme === 'dark' ? '#80bfff' : '#3399ff'};
  }
`;

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [selectedPages, setSelectedPages] = useState({});
  const [compressionLevel, setCompressionLevel] = useState('medium');

  // DIN A4 dimensions in points
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  // Dark Mode Detection
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const scaleImageToFitA4 = (imageWidth, imageHeight) => {
    const pageAspectRatio = A4_WIDTH / A4_HEIGHT;
    const imageAspectRatio = imageWidth / imageHeight;

    let newWidth, newHeight;

    if (imageAspectRatio > pageAspectRatio) {
      // Image is wider relative to A4, so width will be the limiting factor
      newWidth = A4_WIDTH;
      newHeight = newWidth / imageAspectRatio;
    } else {
      // Image is taller relative to A4, so height will be the limiting factor
      newHeight = A4_HEIGHT;
      newWidth = newHeight * imageAspectRatio;
    }

    return { newWidth, newHeight };
  };

const handleFilesAdded = async (newFiles) => {
    const pdfFiles = [];
    const imageFiles = [];
    const unsupportedFiles = [];

    // Convert HEIC files to JPEG
    const convertHeicToJpeg = async (heicFile) => {
      try {
        const jpegBlob = await heic2any({
          blob: heicFile,
          toType: 'image/jpeg',
          quality: 0.7
        });
        return new File([jpegBlob], heicFile.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
      } catch (error) {
        console.error('HEIC Conversion Error:', error);
        return null;
      }
    };

    for (const file of newFiles) {
      if (file.type === 'application/pdf') {
        pdfFiles.push(file);
      } else if (file.type.startsWith('image/')) {
        if (file.name.toLowerCase().endsWith('.heic')) {
          const jpegFile = await convertHeicToJpeg(file);
          if (jpegFile) {
            imageFiles.push(jpegFile);
          } else {
            unsupportedFiles.push(file);
          }
        } else {
          imageFiles.push(file);
        }
      }
    }

    // Zeige Benachrichtigung für nicht konvertierbare HEIC-Dateien
    if (unsupportedFiles.length > 0) {
      const fileNames = unsupportedFiles.map(f => f.name).join(', ');
      alert(`Konvertierung der HEIC-Dateien fehlgeschlagen: ${fileNames}. Bitte konvertieren Sie diese manuell in JPEG oder PNG.`);
    }

    // Restlicher Code bleibt unverändert...
    setFiles(prevFiles => [...prevFiles, ...pdfFiles]);

    // Initialize selected pages for each new PDF file
    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      setSelectedPages(prev => ({
        ...prev,
        [file.name]: Array.from({ length: pageCount }, (_, i) => i)
      }));
    }

    // Convert image files to PDF pages
    for (const imageFile of imageFiles) {
      const imageBytes = await imageFile.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      
      // Support different image types
      let image;
      if (imageFile.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (imageFile.type === 'image/jpeg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        console.error('Unsupported image type');
        continue;
      }

      // Scale image to fit A4
      const { newWidth, newHeight } = scaleImageToFitA4(image.width, image.height);

      // Create A4 page
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

      // Calculate position to center the image
      const x = (A4_WIDTH - newWidth) / 2;
      const y = (A4_HEIGHT - newHeight) / 2;

      // Draw image centered on A4 page
      page.drawImage(image, {
        x: x,
        y: y,
        width: newWidth,
        height: newHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfFile = new File([pdfBlob], imageFile.name, { type: 'application/pdf' });
      
      // Add converted PDF to files
      setFiles(prevFiles => [...prevFiles, pdfFile]);

      // Initialize page selection for converted image PDFs
      setSelectedPages(prev => ({
        ...prev,
        [imageFile.name]: [0] // Select the first (and only) page
      }));
    }
  };

  const handleRemoveFile = (index) => {
    const fileToRemove = files[index];
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setSelectedPages(prev => {
      const updated = { ...prev };
      delete updated[fileToRemove.name];
      return updated;
    });
  };

  const handleReorderFiles = (startIndex, endIndex) => {
    setFiles(prevFiles => {
      const result = Array.from(prevFiles);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handlePageSelection = (fileName, pageIndexes) => {
    setSelectedPages(prev => ({
      ...prev,
      [fileName]: pageIndexes
    }));
  };

  const mergePDFs = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setStatusMessage('PDFs werden zusammengefügt...');

      const mergedPdf = await PDFDocument.create();
      let processedFiles = 0;

      for (const file of files) {
        const fileData = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileData);
        const selectedPagesForFile = selectedPages[file.name] || [];
        
        for (const pageIndex of selectedPagesForFile) {
          const [page] = await mergedPdf.copyPages(pdf, [pageIndex]);
          mergedPdf.addPage(page);
        }

        processedFiles++;
        const currentProgress = (processedFiles / files.length) * 100;
        setProgress(currentProgress);
        setStatusMessage(`Verarbeite PDF ${processedFiles} von ${files.length}...`);
      }

      setStatusMessage('PDF wird komprimiert...');
      
      // Komprimierungsoptionen basierend auf ausgewähltem Level
      const compressionOptions = {
        low: { quality: 0.9 },
        medium: { quality: 0.7 },
        high: { quality: 0.5 }
      };

      const mergedPdfBytes = await mergedPdf.save(compressionOptions[compressionLevel]);

      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zusammengefuegt.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('PDF erfolgreich erstellt!');
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatusMessage('');
      }, 2000);

    } catch (error) {
      console.error('Fehler beim Zusammenfügen:', error);
      setStatusMessage('Fehler beim Zusammenfügen der PDFs');
      setIsProcessing(false);
    }
  };

  return (
    <AppContainer theme={theme}>
      <Header theme={theme}>
        <HeaderContent>
          <Title>PDF Dateien zusammenfügen</Title>
          <Subtitle>Laden Sie Ihre PDF-, PNG- und JPEG-Dateien hoch und fügen Sie diese zu einem Dokument zusammen</Subtitle>
        </HeaderContent>
      </Header>
      
      <Container>
        <ContentSection theme={theme}>
          <UploadZone 
            onFilesAdded={handleFilesAdded}
            theme={theme}
          />
          
          {files.length > 0 && (
            <PDFPreview
              files={files}
              selectedPages={selectedPages}
              onPageSelection={handlePageSelection}
              onReorder={handleReorderFiles}
              theme={theme}
            />
          )}
          
          <FileList 
            files={files} 
            onRemoveFile={handleRemoveFile}
            onReorder={handleReorderFiles}
            theme={theme}
          />

          {isProcessing && (
            <ProgressBar 
              progress={progress} 
              message={statusMessage}
              theme={theme}
            />
          )}

          <MergeButton 
            onClick={mergePDFs} 
            disabled={files.length < 2 || isProcessing}
            theme={theme}
          >
            PDFs zusammenfügen
          </MergeButton>
        </ContentSection>
      </Container>

      <Footer theme={theme}>
        Made by Achim Sommer | 
        <FooterLink href="https://github.com/Achim-Sommer/pdf-tool-website" target="_blank" rel="noopener noreferrer">
          <FaGithub /> GitHub Repository
        </FooterLink>
      </Footer>
    </AppContainer>
  );
}

export default App;
