import Navbar from "../../components/navigation/Navbar"
import Hero from "./Hero"
import CareerDiscovery from "./CareerDiscovery"
import NewsTicker from "../../components/news/NewsTicker"
import TriPathCards from "./TriPathCards"
import ExamAlchemist from "./ExamAlchemist"
import TrustIndicators from "./TrustIndicators"
import MegaFooter from "../../components/footer/MegaFooter"

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CareerDiscovery />
        <NewsTicker />
        <TriPathCards />
        <ExamAlchemist />
        <TrustIndicators />
      </main>
      <MegaFooter />
    </>
  )
}

export default LandingPage
