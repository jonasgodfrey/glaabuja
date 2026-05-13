import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import axios from 'axios';
import { Play, Calendar, Clock, MapPin, ArrowRight, Send } from 'lucide-react';
import PublicLayout from './Layouts/PublicLayout';

const HERO_IMAGE = "https://lyrics.glaabuja.org/backup/public/images/slider/papa3.jpg";

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export default function HomePage({
  latestSermon = null,
  upcomingEvents = [],
  galleryImages = [],
  livestream = null,
  settings = null,
}) {
  const [prayerForm, setPrayerForm] = useState({ name: '', email: '', request: '' });
  const [submitting, setSubmitting] = useState(false);

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    if (!prayerForm.name || !prayerForm.email || !prayerForm.request) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/prayer-requests', prayerForm);
      toast.success('Prayer request submitted successfully');
      setPrayerForm({ name: '', email: '', request: '' });
    } catch {
      toast.error('Failed to submit prayer request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Worship" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
          <div className="max-w-3xl">
            <span className="inline-block text-[#cdac69] text-sm uppercase tracking-widest mb-6">
              Welcome to Guiding Light Assembly
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Building Leaders.<br />
              <span className="text-[#cdac69]">Changing the World.</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl">
              Join us every {settings?.serviceDay || 'Sunday'} at {settings?.serviceTime || '9:00 AM'} as we grow together in faith, hope, and love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary" data-testid="hero-cta-visit">Plan Your Visit</Link>
              <Link href="/sermons" className="btn-outline" data-testid="hero-cta-sermons">Watch Sermons</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Service Section */}
      <section className="py-16 bg-[#111111]" data-testid="service-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-[#cdac69]/20 bg-[#0a0a0a]">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#cdac69]/10 border border-[#cdac69]/30">
                <Calendar className="w-8 h-8 text-[#cdac69]" />
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Next Service</p>
                <h3 className="text-2xl text-white font-semibold">{settings?.serviceDay || 'Sunday'} Service</h3>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Clock size={20} className="text-[#cdac69]" />
                <span>{settings?.serviceTime || '9:00 AM'}</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={20} className="text-[#cdac69]" />
                <span className="max-w-xs truncate">{settings?.address || 'Wuse 2, Abuja'}</span>
              </div>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap" data-testid="service-cta">Get Directions</Link>
          </div>
        </div>
      </section>

      {/* Latest Sermon Section */}
      {latestSermon && (
        <section className="py-24 md:py-32" data-testid="latest-sermon-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-[#cdac69] text-sm uppercase tracking-widest mb-2 block">Latest Message</span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white">Latest Sermon</h2>
              </div>
              <Link href="/sermons" className="text-[#cdac69] flex items-center gap-2 hover:gap-3 transition-all" data-testid="view-all-sermons">
                View All Sermons <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-[#121212] overflow-hidden group">
                {latestSermon.thumbnail ? (
                  <img src={latestSermon.thumbnail} alt={latestSermon.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={48} className="text-[#cdac69]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/sermons/${latestSermon.slug}`} className="p-4 bg-[#cdac69] rounded-full" data-testid="play-latest-sermon">
                    <Play size={32} className="text-black fill-black" />
                  </Link>
                </div>
              </div>
              <div>
                <span className="text-[#cdac69] text-sm uppercase tracking-wider">{formatDate(latestSermon.sermonDate)}</span>
                <h3 className="text-3xl font-semibold text-white mt-2 mb-4">{latestSermon.title}</h3>
                <p className="text-white/60 mb-2">Speaker: <span className="text-white">{latestSermon.speaker}</span></p>
                {latestSermon.series && <p className="text-white/60 mb-4">Series: <span className="text-white">{latestSermon.series}</span></p>}
                <p className="text-white/70 mb-6">{truncateText(latestSermon.description, 200)}</p>
                <Link href={`/sermons/${latestSermon.slug}`} className="btn-outline" data-testid="watch-sermon-btn">Watch Now</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-24 md:py-32 bg-[#111111]" data-testid="events-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-[#cdac69] text-sm uppercase tracking-widest mb-2 block">What's Happening</span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white">Upcoming Events</h2>
              </div>
              <Link href="/events" className="text-[#cdac69] flex items-center gap-2 hover:gap-3 transition-all" data-testid="view-all-events">
                View All Events <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={event.id} className="card-base group" data-testid={`event-card-${index}`}>
                  {event.banner && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-[#cdac69]" />{formatDate(event.eventDate)}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-[#cdac69]" />{formatTime(event.eventTime)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{truncateText(event.description, 100)}</p>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <MapPin size={14} className="text-[#cdac69]" />{event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && (
        <section className="py-24 md:py-32" data-testid="gallery-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-[#cdac69] text-sm uppercase tracking-widest mb-2 block">Our Community</span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white">Gallery</h2>
              </div>
              <Link href="/gallery" className="text-[#cdac69] flex items-center gap-2 hover:gap-3 transition-all" data-testid="view-all-gallery">
                View Full Gallery <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.slice(0, 6).map((image, index) => (
                <div key={image.id} className="aspect-square overflow-hidden" data-testid={`gallery-image-${index}`}>
                  <img src={image.imagePath} alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-24 md:py-32 bg-[#111111]" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#cdac69] text-sm uppercase tracking-widest mb-2 block">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">Welcome to Our Church</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {settings?.aboutShort || "Welcome to Guiding Light Assembly - a place where faith meets purpose."}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#cdac69]/10 border border-[#cdac69]/30">
                    <span className="text-[#cdac69] font-semibold">Vision</span>
                  </div>
                  <p className="text-white/60">{settings?.vision || "To raise a generation of leaders who will transform their world through the power of God's Word."}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#cdac69]/10 border border-[#cdac69]/30">
                    <span className="text-[#cdac69] font-semibold">Mission</span>
                  </div>
                  <p className="text-white/60">{settings?.mission || "To build leaders through the teaching of God's Word, fellowship, and community service."}</p>
                </div>
              </div>
              <Link href="/about" className="btn-outline" data-testid="learn-more-btn">Learn More</Link>
            </div>
            <div className="relative">
              <img src="https://lyrics.glaabuja.org/backup/public/images/slider/papateach2.jpg" alt="Community"
                className="w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-6 -left-6 p-6 bg-[#cdac69] text-black">
                <p className="text-3xl font-bold">10+</p>
                <p className="text-sm font-medium uppercase tracking-wider">Years of Ministry</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Livestream Section */}
      {livestream?.isActive && livestream?.youtubeUrl && (
        <section className="py-24 md:py-32" data-testid="livestream-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-red-500 text-sm uppercase tracking-widest mb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white">Watch Live</h2>
            </div>
            <div className="aspect-video bg-[#121212] overflow-hidden">
              <iframe src={getYouTubeEmbedUrl(livestream.youtubeUrl)} title="Livestream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="w-full h-full" data-testid="livestream-iframe" />
            </div>
          </div>
        </section>
      )}

      {/* Prayer Request Section */}
      <section className="py-24 md:py-32 bg-[#111111]" data-testid="prayer-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#cdac69] text-sm uppercase tracking-widest mb-2 block">We're Here For You</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">Submit a Prayer Request</h2>
              <p className="text-white/70 text-lg mb-8">
                We believe in the power of prayer. Share your prayer requests with us, and our prayer team will lift them up before the Lord.
              </p>
              <div className="p-6 bg-[#0a0a0a] border border-white/5">
                <p className="text-white/60 italic">
                  "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
                </p>
                <p className="text-[#cdac69] mt-2">— Philippians 4:6</p>
              </div>
            </div>
            <form onSubmit={handlePrayerSubmit} className="space-y-6" data-testid="prayer-form">
              <div>
                <label className="block text-white/70 text-sm mb-2">Your Name</label>
                <input type="text" value={prayerForm.name} onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                  placeholder="Enter your name" className="input-base w-full" data-testid="prayer-name-input" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Email Address</label>
                <input type="email" value={prayerForm.email} onChange={(e) => setPrayerForm({ ...prayerForm, email: e.target.value })}
                  placeholder="Enter your email" className="input-base w-full" data-testid="prayer-email-input" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Prayer Request</label>
                <textarea value={prayerForm.request} onChange={(e) => setPrayerForm({ ...prayerForm, request: e.target.value })}
                  placeholder="Share your prayer request..." rows={5}
                  className="input-base w-full resize-none" data-testid="prayer-request-input" />
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2" data-testid="prayer-submit-btn">
                {submitting ? 'Submitting...' : <><Send size={18} /> Submit Prayer Request</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

HomePage.layout = page => <PublicLayout>{page}</PublicLayout>;
