export interface Member {
  id: string
  name: string
  role: string
  bio?: string
  photo_url?: string
  order_index: number
  created_at: string
}

export interface Album {
  id: string
  title: string
  description?: string
  cover_url?: string
  release_date?: string
  spotify_url?: string
  youtube_url?: string
  songs?: Song[]
  created_at: string
}

export interface Song {
  id: string
  album_id?: string
  title: string
  duration?: string
  spotify_url?: string
  youtube_url?: string
  track_number?: number
}

export interface ShowDate {
  id: string
  event_name: string
  venue: string
  city: string
  show_date: string
  ticket_url?: string
  is_sold_out: boolean
  poster_url?: string
}

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  title?: string
  url: string
  thumbnail_url?: string
  created_at: string
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_url?: string
  published_at: string
  is_published: boolean
}