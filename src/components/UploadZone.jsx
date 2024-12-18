import { useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const DropZone = styled.div`
  background: ${props => props.theme === 'dark'
    ? 'linear-gradient(135deg, #363636 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
  border: 3px dashed ${props => props.theme === 'dark' ? '#4a4a4a' : '#dee2e6'};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 90%; // Breiter als vorher
  max-width: 1200px; // Maximale Breite
  margin-left: auto;
  margin-right: auto;
  
  &.drag-over {
    border-color: #eb003c;
    background: ${props => props.theme === 'dark'
      ? 'linear-gradient(135deg, #2a0011 0%, #1a000a 100%)'
      : 'linear-gradient(135deg, #fff5f7 0%, #ffe3e3 100%)'};
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(235, 0, 60, 0.1);
    animation: ${pulse} 1.5s ease-in-out infinite;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'},
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const UploadIcon = styled.svg`
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  stroke: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  stroke-width: 1.5;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

const UploadText = styled.p`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
`;

const UploadSubtext = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#6c757d'};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-block;
  background: linear-gradient(135deg, #eb003c 0%, #c4002f 100%);
  color: white;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(235, 0, 60, 0.2);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(235, 0, 60, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(235, 0, 60, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    transition: 0.5s;
  }

  &:hover::after {
    left: 100%;
  }
`;

const AcceptedFormats = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#6c757d'};
  font-size: 0.8rem;
  transition: color 0.3s ease;
`;

const UploadZone = ({ onFilesAdded, theme }) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    onFilesAdded(files);
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    onFilesAdded(files);
    e.target.value = null; // Reset input
  }, [onFilesAdded]);

  return (
    <DropZone
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      theme={theme}
    >
      <UploadIcon 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        theme={theme}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </UploadIcon>
      
      <UploadText theme={theme}>Dateien hier ablegen</UploadText>
      <UploadSubtext theme={theme}>oder wählen Sie Dateien von Ihrem Computer aus</UploadSubtext>
      
      <FileInput
        type="file"
        id="fileInput"
        multiple
        accept=".pdf, .png, .jpeg, .jpg, .heic"
        onChange={handleFileInput}
      />
      <UploadButton htmlFor="fileInput">
        Dateien auswählen
      </UploadButton>

      <AcceptedFormats theme={theme}>
        Akzeptierte Formate: PDF, PNG, JPEG, JPG, HEIC
      </AcceptedFormats>
    </DropZone>
  );
};

export default UploadZone;
