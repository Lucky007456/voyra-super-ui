import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import WhyVoyra from '@/components/landing/WhyVoyra'
import FeatureWalk from '@/components/landing/FeatureWalk'
import DarkMoment from '@/components/landing/DarkMoment'
import BentoGrid from '@/components/landing/BentoGrid'
import TravelerVoices from '@/components/landing/TravelerVoices'
import StatsWall from '@/components/landing/StatsWall'
import AppPreview from '@/components/landing/AppPreview'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyVoyra />
      <FeatureWalk />
      <DarkMoment />
      <BentoGrid />
      <TravelerVoices />
      <StatsWall />
      <AppPreview />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  )
}
