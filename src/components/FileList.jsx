import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const List = styled.div`
  margin: 2rem 0;
  width: 90%; // Breiter als vorher
  max-width: 1200px; // Maximale Breite
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column; // Elemente untereinander
  gap: 1rem; // Abstand zwischen Elementen
`;

const FileItem = styled.div`
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #363636 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
  padding: 1.2rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: grab;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, ${props => props.theme === 'dark' ? '0.3' : '0.1'});
  }

  &.dragging {
    opacity: 0.5;
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, ${props => props.theme === 'dark' ? '0.4' : '0.2'});
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 1rem;
`;

const FileIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  stroke: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  transition: stroke 0.3s ease;
`;

const FileName = styled.span`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.span`
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#6c757d'};
  font-size: 0.85rem;
  margin-left: 1rem;
  transition: color 0.3s ease;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #eb003c;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(235, 0, 60, 0.2)' 
      : 'rgba(235, 0, 60, 0.1)'};
    transform: rotate(90deg);
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 0.5rem;
  margin-right: 1rem;
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#6c757d'};
  display: flex;
  align-items: center;

  &:hover {
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileList = ({ files, onRemoveFile, onReorder, theme }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="file-list">
        {(provided) => (
          <List
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {files.map((file, index) => (
              <Draggable
                key={file.name}
                draggableId={file.name}
                index={index}
              >
                {(provided, snapshot) => (
                  <FileItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={snapshot.isDragging ? 'dragging' : ''}
                    theme={theme}
                  >
                    <DragHandle {...provided.dragHandleProps} theme={theme}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 15h8" />
                      </svg>
                    </DragHandle>
                    
                    <FileInfo>
                      <FileIcon 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        theme={theme}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <line x1="10" y1="9" x2="8" y2="9"/>
                      </FileIcon>
                      <FileName theme={theme}>{file.name}</FileName>
                      <FileSize theme={theme}>{formatFileSize(file.size)}</FileSize>
                    </FileInfo>
                    
                    <RemoveButton
                      onClick={() => onRemoveFile(index)}
                      aria-label="Datei entfernen"
                      theme={theme}
                    >
                      ×
                    </RemoveButton>
                  </FileItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FileList;
