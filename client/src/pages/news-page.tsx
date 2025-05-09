import { useState } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { TopNavigation } from "@/components/layout/top-navigation";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Share2, ChevronRight, Star, Newspaper, TrendingUp, Info, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

// รูปภาพข่าวสาร Bitkub
import cryptoWeeklyJun2023 from "@/assets/news/crypto_weekly_jun_2023.jpg";
import cryptoWeeklyFeb2024 from "@/assets/news/crypto_weekly_feb_2024.jpg";
import cryptoWeeklyDec2024 from "@/assets/news/crypto_weekly_dec_2024.jpg";
import cryptoWeeklyNov2024 from "@/assets/news/crypto_weekly_nov_2024.jpg";
import cryptoWeeklyDec2023 from "@/assets/news/crypto_weekly_dec_2023.jpg";
import cryptoWeeklyMay2023 from "@/assets/news/crypto_weekly_may_2023.jpg";
import bitkubConnect from "@/assets/news/bitkub_connect.jpg";
import bitkubInsight from "@/assets/news/bitkub_insight.jpg";
import bitkubPresenter from "@/assets/news/bitkub_presenter.jpg";
import bitkubSet from "@/assets/news/bitkub_set.jpg";
import bitkubNext100k from "@/assets/news/bitkub_next_100k.jpg";
import bitkubWatchEarn from "@/assets/news/bitkub_watch_earn.jpg";

// กำหนดรูปภาพให้กับหัวข้อข่าวต่างๆ
const passkey = bitkubInsight;
const bitkubChain = cryptoWeeklyFeb2024;
const bitkubCEO = bitkubSet;
const bitkubCapital = cryptoWeeklyNov2024;
const bitkubBlockathon = bitkubWatchEarn;
const thbProgrammable = bitkubPresenter;
const bitkubHowto = bitkubConnect;
const bitkubNext = bitkubNext100k;
const bitkubKUB = cryptoWeeklyDec2024;
const bitkubWallet = cryptoWeeklyDec2023;
const bitkubCoin = cryptoWeeklyMay2023;
const bitkubListing = cryptoWeeklyJun2023;

// ข้อมูลข่าวสาร Bitkub และคริปโต ข้อมูลจริงอ้างอิงจากรูปภาพ
const newsData = [
  {
    id: 1,
    title: "รวมข่าวเด่นประจำสัปดาห์ 6-12 พฤษภาคม 2023",
    summary: "Bitcoin พุ่งขึ้นอย่างต่อเนื่องท่ามกลางการเติบโตของ PayPal ที่เข้าสู่ตลาดคริปโต และการปรับตัวของเหรียญ Tether ในตลาดการเงินดิจิทัล",
    imageUrl: cryptoWeeklyMay2023,
    date: "12 พ.ค. 2023",
    category: "market",
    isFeatured: true,
    isHot: true
  },
  {
    id: 2,
    title: "รวมข่าวเด่นประจำสัปดาห์ 24-30 มิถุนายน 2023",
    summary: "MicroStrategy ประกาศซื้อ Bitcoin เพิ่มมูลค่า $347 ล้าน ขณะที่ราคา Bitcoin และตลาดคริปโตโดยรวมมีการเติบโตอย่างแข็งแกร่ง",
    imageUrl: cryptoWeeklyJun2023,
    date: "30 มิ.ย. 2023",
    category: "market",
    isFeatured: false,
    isHot: true
  },
  {
    id: 3,
    title: "รวมข่าวเด่นประจำสัปดาห์ 16-22 ธันวาคม 2023",
    summary: "ราคา Bitcoin พุ่งทะยานอย่างต่อเนื่อง พร้อมกับการเติบโตของเหรียญ Solana (SOL) ที่มีการปรับตัวขึ้นอย่างมีนัยสำคัญ",
    imageUrl: cryptoWeeklyDec2023,
    date: "22 ธ.ค. 2023",
    category: "market",
    isFeatured: false,
    isHot: false
  },
  {
    id: 4,
    title: "รวมข่าวเด่นประจำสัปดาห์ 10-16 กุมภาพันธ์ 2024",
    summary: "ราคา Bitcoin ทำจุดสูงสุดใหม่พร้อมกับการเข้ามาของ BlackRock ในตลาดคริปโต และการเติบโตของเครื่องมือวัดระดับความเชื่อมั่น",
    imageUrl: cryptoWeeklyFeb2024,
    date: "16 ก.พ. 2024",
    category: "market",
    isFeatured: true,
    isHot: true
  },
  {
    id: 5,
    title: "Bitkub Insight EP.27: ทริปปี้ชั่นตำแหน่งแล้ว! ตลาดคริปโตจะเป็นอย่างไรหลังจากนี้?",
    summary: "ผู้เชี่ยวชาญจาก Bitkub วิเคราะห์ตลาดคริปโตหลังจากเกิดการปรับฐานของราคา พร้อมให้มุมมองแนวโน้มการเติบโตในระยะถัดไป",
    imageUrl: bitkubInsight,
    date: "28 ม.ค. 2567",
    category: "bitkub",
    isFeatured: true,
    isHot: false
  },
  {
    id: 6,
    title: "ข่าวดี! Bitkub Next มีผู้ใช้งานครบ 100,000 ราย",
    summary: "Bitkub Next ฉลองความสำเร็จครั้งสำคัญกับการมีผู้ใช้งานครบ 100,000 ราย เตรียมมอบกิจกรรมสุดพิเศษจาก Bitkub Chain เร็วๆ นี้",
    imageUrl: bitkubNext100k,
    date: "15 มี.ค. 2024",
    category: "bitkub",
    isFeatured: false,
    isHot: true
  },
  {
    id: 7,
    title: "Bitkub Watch & Earn Live: ดูสด รับเลย กิจกรรม Airdrop สุดพิเศษจาก GuildFi",
    summary: "กิจกรรมพิเศษจาก Bitkub ร่วมกับ GuildFi ให้ผู้ใช้สามารถติดตาม Streamers ชื่อดัง พร้อมรับรางวัล Airdrop มูลค่ารวมกว่า 2 แสนบาท",
    imageUrl: bitkubWatchEarn,
    date: "10 ม.ค. 2565",
    category: "bitkub",
    isFeatured: false,
    isHot: false
  },
  {
    id: 8,
    title: "รวมข่าวเด่นประจำสัปดาห์ 21-27 ธันวาคม 2024",
    summary: "ข่าวสำคัญเกี่ยวกับ Bitcoin ETF พร้อมการเคลื่อนไหวของ VanEck และข่าวเกี่ยวกับ MicroStrategy โดย Michael Saylor",
    imageUrl: cryptoWeeklyDec2024,
    date: "27 ธ.ค. 2024",
    category: "regulation",
    isFeatured: false,
    isHot: true
  },
  {
    id: 9,
    title: "รวมข่าวเด่นประจำสัปดาห์ 23-29 พฤศจิกายน 2024",
    summary: "สถานการณ์ล่าสุดของ Bitcoin ETF และบริษัท Marathon Digital Holdings พร้อมด้วยความเคลื่อนไหวของ Justin Sun ผู้ก่อตั้ง TRON",
    imageUrl: cryptoWeeklyNov2024,
    date: "29 พ.ย. 2024",
    category: "market",
    isFeatured: false,
    isHot: false
  },
  {
    id: 10,
    title: "Bitkub Capital Group Holdings - เชื่อมทุกโอกาสสู่โลกแห่งอนาคต",
    summary: "Bitkub นำเสนอวิสัยทัศน์การเชื่อมต่อโอกาสทางการลงทุนดิจิทัลสู่โลกอนาคต พร้อมพัฒนาระบบนิเวศทางการเงินที่ครบวงจร",
    imageUrl: bitkubConnect,
    date: "9 พ.ค. 2025",
    category: "bitkub",
    isFeatured: true,
    isHot: false
  },
  {
    id: 11,
    title: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET) ประกาศความร่วมมือกับ Bitkub",
    summary: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET) และ Bitkub ร่วมมือกันพัฒนาโครงสร้างพื้นฐานทางการเงินดิจิทัลเพื่อยกระดับตลาดทุนไทย",
    imageUrl: bitkubSet,
    date: "5 พ.ค. 2025",
    category: "regulation",
    isFeatured: true,
    isHot: true
  },
  {
    id: 12,
    title: "Bitkub ประกาศนโยบายใหม่เพื่อยกระดับความปลอดภัยและความเชื่อมั่นในการลงทุนคริปโต",
    summary: "Bitkub เผยแนวทางการพัฒนาแพลตฟอร์มล่าสุดพร้อมมาตรการรักษาความปลอดภัยและความเชื่อมั่นสำหรับนักลงทุนคริปโตในประเทศไทย",
    imageUrl: bitkubPresenter,
    date: "1 พ.ค. 2025",
    category: "bitkub",
    isFeatured: false,
    isHot: true
  }
];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  // กรองข่าวตามหมวดหมู่
  const filteredNews = activeTab === "all" 
    ? newsData 
    : newsData.filter(news => news.category === activeTab);
  
  // แยกข่าวที่แนะนำ
  const featuredNews = newsData.filter(news => news.isFeatured);
  
  return (
    <MobileContainer>
      <TopNavigation />
      
      <div className="pb-20 w-full">
        {/* แบนเนอร์ข่าวเด่น */}
        <div className="py-3 w-full">
          <h2 className="text-lg font-bold flex items-center mb-3 px-4">
            <Newspaper className="w-5 h-5 mr-2 text-primary" />
            ข่าวแนะนำ
          </h2>
          
          <div className="space-y-4 px-0">
            {featuredNews.map(news => (
              <Card key={news.id} className="overflow-hidden rounded-none border-x-0 shadow-none">
                <div className="relative h-48">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg line-clamp-2">{news.title}</h3>
                    <div className="flex items-center mt-2">
                      <Badge variant="secondary" className="mr-2">แนะนำ</Badge>
                      {news.isHot && <Badge variant="destructive">มาแรง</Badge>}
                      <div className="flex items-center text-white/80 ml-auto text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {news.date}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <Separator className="my-1" />
        
        {/* แท็บหมวดหมู่ข่าว */}
        <div className="w-full pt-2">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4">
              <TabsList className="w-full flex overflow-x-auto mb-4">
                <TabsTrigger value="all" className="flex-1">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="market" className="flex-1">ตลาด</TabsTrigger>
                <TabsTrigger value="tech" className="flex-1">เทคโนโลยี</TabsTrigger>
                <TabsTrigger value="regulation" className="flex-1">กฎหมาย</TabsTrigger>
                <TabsTrigger value="bitkub" className="flex-1">Bitkub</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-0">
                {filteredNews.map(news => (
                  <Card key={news.id} className="overflow-hidden rounded-none border-x-0 border-t-0 shadow-none">
                    <div className="flex p-4">
                      <div className="w-1/3 pr-3">
                        <div className="relative h-24 rounded-lg overflow-hidden">
                          <img 
                            src={news.imageUrl} 
                            alt={news.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="w-2/3">
                        <h3 className="font-bold line-clamp-2 text-sm">{news.title}</h3>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{news.summary}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center text-muted-foreground text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {news.date}
                          </div>
                          {news.isHot && (
                            <Badge variant="destructive" className="ml-2 text-[10px] h-5">
                              <TrendingUp className="w-3 h-3 mr-1" /> มาแรง
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="px-4 mt-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Info className="w-4 h-4 mr-2" />
                เกี่ยวกับข่าวสาร
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                ข่าวสารจะได้รับการอัพเดททุกวัน เพื่อให้คุณได้ทันต่อสถานการณ์ตลาดคริปโตเคอร์เรนซี่และข่าวสารล่าสุดเกี่ยวกับ Bitkub
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="px-4 mt-4 mb-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-yellow-700">
                <Lightbulb className="w-4 h-4 mr-2" />
                คำแนะนำสำหรับนักลงทุน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-yellow-700/80">
                ควรศึกษาข้อมูลและข่าวสารให้รอบด้านก่อนตัดสินใจลงทุน การลงทุนมีความเสี่ยง ผู้ลงทุนควรทำความเข้าใจก่อนตัดสินใจลงทุน
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </MobileContainer>
  );
}