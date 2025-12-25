import React from 'react'
import HeroSection from '../components/landing/HeroSection'
import FeaturedTrails from '../components/landing/FeatureTrails'
import UpgradeSection from '../components/landing/UpgradeSection'
import CommunityGallery from '../components/landing/CommunityGallery'
import GroupActivities from '../components/landing/GroupActivities'
import CallToAction from '../components/landing/CallToAction'
import FAQSection from '../components/landing/FAQSection'
import Footer from '../layouts/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <HeroSection/>
      {/* Spacer or padding if needed, but components handle their own py */}
      <FeaturedTrails/>
      <UpgradeSection/>
      <GroupActivities/>
      <CommunityGallery/>
      <CallToAction/>
      <FAQSection/>
      
      <Footer/>
    </div>
  )
}
