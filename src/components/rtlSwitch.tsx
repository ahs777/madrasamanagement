import React from 'react';
import { Button } from '@nextui-org/react';
import { RtlIcon, LtrIcon } from '@/components/icons';
import { useDirectionLanguage } from '@/components/DirectionLanguageContext';

export const RtlSwitchButton: React.FC = () => {
  const { isRtl, setIsRtl, setLanguage } = useDirectionLanguage();

  const handleClick = () => {
    const newIsRtl = !isRtl;  
    setIsRtl(newIsRtl);
    setLanguage(newIsRtl ? 'ur' : 'en');
  };

  return (
    <Button onClick={handleClick} aria-label={`Switch to ${isRtl ? 'LTR' : 'RTL'}`}>
      {isRtl ? 'English' : 'اردو'}
      {isRtl ? <RtlIcon size={24} /> : <LtrIcon size={24} />}
    </Button>
  );
};
