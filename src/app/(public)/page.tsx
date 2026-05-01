import { createServerSupabaseClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import LatestRelease from '@/components/home/LatestRelease'
import ShowDatesPreview from '@/components/home/ShowDatesPreview'
import { Album, ShowDate } from '@/types'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Fetch latest album
  const { data: latestAlbum } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('release_date', { ascending: false })
    .limit(1)
    .single()

  // Fetch upcoming shows
  const { data: upcomingShows } = await supabase
    .from('show_dates')
    .select('*')
    .gte('show_date', new Date().toISOString())
    .order('show_date', { ascending: true })
    .limit(3)

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <LatestRelease album={latestAlbum as Album} />
      <ShowDatesPreview shows={upcomingShows as ShowDate[]} />
    </main>
  )
}