'use client';

import { Button, ButtonProps } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps extends ButtonProps {
  className?: string;
}

export function ShareButton({ className = "", children, ...props }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: 'Check out this amazing app!',
      text: 'ಶಿಕ್ಷಕ ಮಿತ್ರರೇ MDM ಲೆಕ್ಕಾಚಾರದ ತಲೆನೋವಿಗೆ ಪರಿಹಾರ ಬೇಕೇ??? \n \nಹಾಗಿದ್ದರೆ ಈ ಕೆಳಗಿನ ಲಿಂಕನ್ನು ಬಳಸಿ ಎಲ್ಲಾ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಮುಗಿಸಿ...\nJWhatsApp group for updates: https://chat.whatsapp.com/Fgnf3AOmeux7EH7JioPYeA  \n\n',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleShare}
      className={`flex items-center gap-2 ${className}`}
      {...props}
    >
      {children || (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
