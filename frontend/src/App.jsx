import React, { useState, useEffect } from 'react';
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
import { fetchSiteContent } from './services/siteContentService';

export default function App() {
  const [visibility, setVisibility] = useState({
    hero: true,
    vibe: true,
    jamming: true,
    reels: true,
    menu: true,
    moments: true,
    about: true,
    visit: true
  });

  const [marqueeText, setMarqueeText] = useState("COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI • SILVASSA •");

  useEffect(() => {
    let isMounted = true;
    fetchSiteContent().then(res => {
      if (isMounted) {
        if (res.settings?.section_visibility) {
          setVisibility(prev => ({ ...prev, ...res.settings.section_visibility }));
        }
        if (res.content?.marquee?.text) {
          setMarqueeText(res.content.marquee.text);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

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
        {visibility.hero !== false && <Hero />}

        {/* 03 The Yaari Feeling Intro */}
        {visibility.vibe !== false && <TheYaariFeeling />}

        {/* 04 Slow Brand Marquee */}
        <BrandMarquee text={marqueeText} />

        {/* 05 Jamming at Yaari */}
        {visibility.jamming !== false && <JammingSection />}

        {/* 06 Reels & Video Rail */}
        {visibility.reels !== false && <VideoRail />}

        {/* 07 Digital Menu */}
        {visibility.menu !== false && <MenuSection />}

        {/* 08 Signature Picks */}
        <SignaturePicks />

        {/* 09 Dark Statement Section */}
        <DarkStatement />

        {/* 10 Little Moments Gallery */}
        {visibility.moments !== false && <Gallery />}

        {/* 11 About Yaari */}
        {visibility.about !== false && <AboutSection />}

        {/* 12 Visit / Contact */}
        {visibility.visit !== false && <VisitSection />}
      </main>

      {/* 13 Footer */}
      <Footer />
    </div>
  );
}
