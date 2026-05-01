import { createServerSupabaseClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import LatestRelease from '@/components/home/LatestRelease'
import ShowDatesPreview from '@/components/home/ShowDatesPreview'
import { Album, ShowDate } from '@/types'

// PENTING: Tambahkan ini supaya data selalu fresh dari database
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // 1. Ambil album terbaru
  const { data: latestAlbum } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('release_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  // 2. Ambil lagu terbaru (Single/Track)
  const { data: latestSong } = await supabase
    .from('songs')
    .select('*, albums(title, cover_url)')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let finalRelease = null

  if (latestAlbum || latestSong) {
    const albumTime = latestAlbum ? new Date(latestAlbum.release_date).getTime() : 0
    const songTime = latestSong ? new Date(latestSong.created_at).getTime() : 0

    // Bandingkan mana yang lebih baru
    if (songTime > albumTime && latestSong) {
      finalRelease = {
        ...latestSong,
        type: 'single',
        title: latestSong.title, // Pastikan namanya 'title'
        cover_url: latestSong.cover_url || latestSong.albums?.cover_url, // Pastikan 'cover_url'
        release_date: latestSong.created_at
      }
    } else if (latestAlbum) {
      finalRelease = {
        ...latestAlbum,
        type: 'album',
        title: latestAlbum.title, // Pastikan namanya 'title'
        cover_url: latestAlbum.cover_url, // Pastikan 'cover_url'
        release_date: latestAlbum.release_date
      }
    }
  }

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
      {/* Kirim finalRelease yang sudah kita standarisasi namanya */}
      <LatestRelease release={finalRelease} />
      <ShowDatesPreview shows={upcomingShows as ShowDate[]} />
    </main>
  )
}