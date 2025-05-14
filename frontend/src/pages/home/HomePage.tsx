import Topbar from "@/components/ui//Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";


const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
  } = useMusicStore();

  const { initializeQueue} = usePlayerStore();

  useEffect(()=>{
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  },[fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(()=>{
    if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    };
  }, [ initializeQueue,madeForYouSongs, featuredSongs, trendingSongs]);
  
  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900 ">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2x1 sm:text-3x1 font-bold mb-6">Good Afternoon</h1>
          <FeaturedSection/>
        

        <div className="space-y-8">
          <SectionGrid title="Made for you" songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title="Shuffled" songs={trendingSongs} isLoading={isLoading} />
        </div>
        </div>
      </ScrollArea>  
      </main>
  )
}

export default HomePage;