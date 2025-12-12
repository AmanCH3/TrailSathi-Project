import React from 'react'
import HeroSection from '../components/landing/HeroSection'
import FeaturedTrails from '../components/landing/FeatureTrails'
import CommunityGallery from '../components/landing/CommunityGallery'
import GroupActivities from '../components/landing/GroupActivities'
import CallToAction from '../components/landing/CallToAction'
import Footer from '../layouts/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <HeroSection/>
      {/* Spacer or padding if needed, but components handle their own py */}
      <FeaturedTrails/>
      <CommunityGallery/>
      <GroupActivities/>
      <CallToAction/>
      
      <Footer/>
    </div>
  )
}
