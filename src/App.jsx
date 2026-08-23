import React from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/hero/Hero';
import TheYaariFeeling from './components/sections/TheYaariFeeling';
import BrandMarquee from './components/sections/BrandMarquee';
import JammingSection from './components/sections/JammingSection';
import VideoRail from './components/sections/VideoRail';
import MenuSection from './components/menu/MenuSection';
import SignaturePicks from './components/sections/SignaturePicks';
import DarkStatement from './components/sections/DarkStatement';
import Gallery from './components/sections/Gallery';
import AboutSection from './components/sections/AboutSection';
import VisitSection from './components/sections/VisitSection';
import Footer from './components/layout/Footer';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#FBF8F2] text-[#282522] selection:bg-[#7E5B42] selection:text-[#FBF8F2]">
      {/* Global Ambient Paper Texture Overlay */}
      <div className="paper-texture" />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* 01 Navbar */}
      <Navbar />

      <main>
        {/* 02 Hero */}
        <Hero />

        {/* 03 The Yaari Feeling Intro */}
        <TheYaariFeeling />

        {/* 04 Slow Brand Marquee */}
        <BrandMarquee text="COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI • SILVASSA •" />

        {/* 05 Jamming at Yaari */}
        <JammingSection />

        {/* 06 Reels & Video Rail */}
        <VideoRail />

        {/* 07 Digital Menu */}
        <MenuSection />

        {/* 08 Signature Picks */}
        <SignaturePicks />

        {/* 09 Dark Statement Section */}
        <DarkStatement />

        {/* 10 Little Moments Gallery */}
        <Gallery />

        {/* 11 About Yaari */}
        <AboutSection />

        {/* 12 Visit / Contact */}
        <VisitSection />
      </main>

      {/* 13 Footer */}
      <Footer />
    </div>
  );
}
