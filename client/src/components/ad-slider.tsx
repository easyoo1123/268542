import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// นำเข้ารูปภาพโดยตรงจาก assets
import imgSumx from "../assets/1_ArkGxMr6tX-aWvxnYMnlCg.png";
import imgSummit from "../assets/4-issues-for-bitkub-summit-gala-night-2024.jpg";
import imgPasskey from "../assets/a.png";
import imgKnowledge from "../assets/h.png";
import imgPlume from "../assets/i.png";
import imgXdc from "../assets/o.png";
import imgVisionDay from "../assets/q.png";
import imgProofOfReserve from "../assets/r.png";
import imgGrass from "../assets/u.png";
import imgCetus from "../assets/w.jpg";
import imgAnnouncement from "../assets/y.png";

export function AdSlider() {
  const [api, setApi] = useState<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // ใช้ตัวแปรที่นำเข้าจากไฟล์โดยตรง
  const imageArray = [
    { src: imgSumx, alt: "What is SUMX - Summer Point Token" },
    { src: imgSummit, alt: "Bitkub Summit Gala Night 2024" },
    { src: imgPasskey, alt: "ทำความรู้จักกับ Passkey" },
    { src: imgKnowledge, alt: "แหล่งความรู้มือใหม่หัดลงทุน" },
    { src: imgPlume, alt: "New Listing Plume (PLUME)" },
    { src: imgXdc, alt: "New Listing XDC Network (XDC)" },
    { src: imgVisionDay, alt: "Bitkub x XDC: Vision Day" },
    { src: imgProofOfReserve, alt: "Proof of Reserve" },
    { src: imgGrass, alt: "New Listing Grass (GRASS)" },
    { src: imgCetus, alt: "Bitkub x CETUS Listing Celebration" },
    { src: imgAnnouncement, alt: "ประกาศ: การเปิดรับฟังความเห็นเรื่องปรับปรุงหลักเกณฑ์" }
  ];

  useEffect(() => {
    if (!api) return;
    
    // เมื่อมีการเปลี่ยนแปลงใน active slide ของ Carousel, อัพเดท activeIndex
    const onSelect = () => {
      if (!api) return;
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Auto-advance slides
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => {
      api.off("select", onSelect);
      clearInterval(interval);
    };
  }, [api]);

  // เมื่อ activeIndex เปลี่ยน ให้เลื่อนไปยัง slide นั้น
  useEffect(() => {
    if (!api) return;
    api.scrollTo(activeIndex);
  }, [activeIndex, api]);

  return (
    <div className="w-full overflow-hidden">
      <Carousel
        className="w-full relative touch-none select-none"
        setApi={setApi}
        opts={{ 
          loop: true
        }}>
        <CarouselContent>
          {imageArray.map((image, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-auto object-cover"
                  // ป้องกัน drag ของรูปภาพ
                  draggable="false"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1.5">
            {imageArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeIndex === index ? "bg-primary w-3" : "bg-gray-300"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute -left-4 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="bg-white/80 hover:bg-white" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
          <CarouselNext className="bg-white/80 hover:bg-white" />
        </div>
      </Carousel>
    </div>
  );
}