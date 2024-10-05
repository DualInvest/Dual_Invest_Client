import React,{useState,useEffect} from 'react';
import investmentImage from '../../assets/lending-partners.png';
import investmentImageMobile from '../../assets/lending-partners-mobile.png';

export default function LendingPartners() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
  return (
    <div>
      <div className='numbers-image-container'>
        <img src={isMobile ? investmentImageMobile : investmentImage} alt="Investment" className='numbers-image' />
      </div>
    </div>
  )
}
