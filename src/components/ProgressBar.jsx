import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => props.theme === 'dark'
    ? 'linear-gradient(135deg, #363636 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, ${props => props.theme === 'dark' ? '0.3' : '0.1'});
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, ${props => props.theme === 'dark' ? '0.4' : '0.15'});
  }
`;

const ProgressBarContainer = styled.div`
  background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 5, 72, 0.1)'};
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Progress = styled.div`
  background: linear-gradient(
    90deg,
    #eb003c 0%,
    #ff1a1a 50%,
    #eb003c 100%
  );
  background-size: 1000px 100%;
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  animation: ${shimmer} 2s linear infinite;
  box-shadow: 0 0 10px rgba(235, 0, 60, 0.5);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 1.5s linear infinite;
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Percentage = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #eb003c;
  text-shadow: ${props => props.theme === 'dark'
    ? '0 0 10px rgba(235, 0, 60, 0.3)'
    : 'none'};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Message = styled.p`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000548'};
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
`;

const SubMessage = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#6c757d'};
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const ProgressBar = ({ progress, message, theme }) => {
  const isComplete = progress === 100;
  const formattedProgress = Math.round(progress);

  return (
    <ProgressContainer theme={theme}>
      <ProgressBarContainer theme={theme}>
        <Progress progress={progress} />
      </ProgressBarContainer>
      <StatusMessage theme={theme}>
        <Percentage theme={theme}>{formattedProgress}%</Percentage>
        <Message theme={theme}>{message}</Message>
        {!isComplete && (
          <SubMessage theme={theme}>
            Bitte warten Sie, während Ihre PDFs verarbeitet werden...
          </SubMessage>
        )}
      </StatusMessage>
    </ProgressContainer>
  );
};

export default ProgressBar;
