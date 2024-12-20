import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// PDF.js Worker lokal laden 
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

const PreviewContainer = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: ${props => props.theme === 'dark' ? '#363636' : '#f8f9fa'};
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 90%; // Breiter als vorher
  max-width: 1200px; // Maximale Breite
  margin-left: auto;
  margin-right: auto;
`;

const PreviewTitle = styled.h3`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const PreviewList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f1f1f1'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#888'};
    border-radius: 4px;
  }
`;

const PreviewCard = styled.div`
  flex: 0 0 auto;
  width: 250px; // Etwas breiter
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &.dragging {
    opacity: 0.5;
  }
`;

const PageSelector = styled.div`
  margin-top: 1rem;
  max-height: 150px;
  overflow-y: auto;
  background: ${props => props.theme === 'dark' ? '#363636' : '#f8f9fa'};
  border-radius: 4px;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f1f1f1'};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#888'};
    border-radius: 3px;
  }
`;

const PageCheckbox = styled.label`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#444444' : '#e9ecef'};
  }

  input {
    margin-right: 0.5rem;
    cursor: pointer;
  }
`;

const LoadingMessage = styled.div`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  text-align: center;
  padding: 1rem;
`;

const ErrorMessage = styled.div`
  color: #eb003c;
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
`;

const PDFPreview = ({ files, selectedPages, onPageSelection, onReorder, theme }) => {
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPreviews = async () => {
      if (files.length === 0) return;
      
      setLoading(true);
      setError(null);
      const newPreviews = {};

      for (const file of files) {
        try {
          if (file.type.startsWith('application/pdf')) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            newPreviews[file.name] = {
              dataUrl: canvas.toDataURL(),
              pageCount: pdf.numPages,
              type: 'pdf'
            };
          } else if (file.type.startsWith('image/')) {
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });

            newPreviews[file.name] = {
              dataUrl: dataUrl,
              pageCount: 1,
              type: 'image'
            };
          }
        } catch (error) {
          console.error('Fehler beim Laden der Vorschau:', error);
          setError('Fehler beim Laden der Vorschau. Bitte versuchen Sie es erneut.');
        }
      }

      setPreviews(newPreviews);
      setLoading(false);
    };

    loadPreviews();
  }, [files]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  const handlePageSelect = (fileName, pageIndex, isSelected) => {
    const currentSelected = selectedPages[fileName] || [];
    let newSelected;

    if (isSelected) {
      newSelected = [...currentSelected, pageIndex].sort((a, b) => a - b);
    } else {
      newSelected = currentSelected.filter(p => p !== pageIndex);
    }

    onPageSelection(fileName, newSelected);
  };

  if (loading) {
    return (
      <PreviewContainer theme={theme}>
        <LoadingMessage theme={theme}>
          Lade Vorschauen...
        </LoadingMessage>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer theme={theme}>
      <PreviewTitle theme={theme}>Vorschau und Seitenauswahl</PreviewTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="preview-list" direction="horizontal">
          {(provided) => (
            <PreviewList
              {...provided.droppableProps}
              ref={provided.innerRef}
              theme={theme}
            >
              {files.map((file, index) => (
                <Draggable
                  key={file.name}
                  draggableId={file.name}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <PreviewCard
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? 'dragging' : ''}
                      theme={theme}
                    >
                      {previews[file.name] && (
                        <img
                          src={previews[file.name].dataUrl}
                          alt={`Vorschau von ${file.name}`}
                          style={{ width: '100%', borderRadius: '4px', maxHeight: '250px', objectFit: 'contain' }}
                        />
                      )}
                      {previews[file.name]?.type === 'pdf' && (
                        <PageSelector theme={theme}>
                          {Array.from(
                            { length: previews[file.name].pageCount },
                            (_, i) => (
                              <PageCheckbox key={i} theme={theme}>
                                <input
                                  type="checkbox"
                                  checked={(selectedPages[file.name] || []).includes(i)}
                                  onChange={(e) => handlePageSelect(file.name, i, e.target.checked)}
                                />
                                Seite {i + 1}
                              </PageCheckbox>
                            )
                          )}
                        </PageSelector>
                      )}
                    </PreviewCard>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </PreviewList>
          )}
        </Droppable>
      </DragDropContext>
    </PreviewContainer>
  );
};

export default PDFPreview;
