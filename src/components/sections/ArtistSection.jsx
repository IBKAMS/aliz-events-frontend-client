import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  HiMusicNote,
  HiStar,
  HiHeart,
  HiSparkles,
  HiGlobe,
} from 'react-icons/hi';
import { FaSpotify, FaYoutube, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { useEvent } from '../../context/EventContext';

const ArtistSection = () => {
  const { t } = useTranslation();
  const { content } = useEvent();
  const [activeAlbum, setActiveAlbum] = useState(0);
  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  // State for artist data from API
  const [artistFromAPI, setArtistFromAPI] = useState(null);
  const [albumsFromAPI, setAlbumsFromAPI] = useState(null);
  const [socialLinksFromAPI, setSocialLinksFromAPI] = useState(null);

  // Fetch artist data from API
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
        const response = await fetch(`${API_URL}/artist`);
        const data = await response.json();

        if (data.success && data.data) {
          const artistData = data.data;

          // Map API data to component format
          setArtistFromAPI({
            name: artistData.name || 'Constance Aman',
            title: artistData.title || "Chanteuse Gospel",
            tagline: "Une vie entièrement au service de la musique gospel depuis 35 ans",
            birthDate: "7 janvier 1972",
            birthPlace: "Bouaké, Côte d'Ivoire",
            realName: "Coumoin Amani Constance",
            bio: artistData.biography?.fr || "",
            fullBio: artistData.biography?.fr || "",
            image: artistData.image || "/images/constance-main.jpg",
            achievements: [
              { icon: "star", label: "Années de carrière", value: artistData.stats?.years?.toString() || "35+" },
              { icon: "music", label: "Albums studio", value: artistData.stats?.albums?.toString() || "11" },
              { icon: "heart", label: "Concerts", value: artistData.stats?.concerts?.toString() || "150+" },
              { icon: "globe", label: "Pays", value: artistData.stats?.countries?.toString() || "12" },
            ],
            quote: "La musique est ma prière, chaque note est une louange à l'Éternel.",
            style: "Gospel, Afro, Jazz, Bossa Nova",
          });

          // Base URL for static assets (without /api/v1)
          const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace('/api/v1', '');

          // Helper to prefix URL with base URL if it's a relative path
          const prefixUrl = (url) => {
            if (!url) return '';
            if (url.startsWith('http://') || url.startsWith('https://')) return url;
            return `${baseUrl}${url}`;
          };

          // Set albums if available
          if (artistData.albums && artistData.albums.length > 0) {
            setAlbumsFromAPI(artistData.albums.map(album => ({
              year: album.year || '',
              title: album.title || '',
              cover: prefixUrl(album.cover) || '/images/albums/default.jpg',
              description: album.description || '',
              tracks: album.tracks || 10,
              highlight: album.highlight || '',
              type: album.type || 'Album solo',
              spotifyUrl: album.spotifyUrl || '',
              youtubeUrl: album.youtubeUrl || '',
              appleMusicUrl: album.appleMusicUrl || '',
              deezerUrl: album.deezerUrl || '',
            })));
          }

          // Set social links
          if (artistData.socialLinks) {
            setSocialLinksFromAPI({
              facebook: artistData.socialLinks.facebook || '',
              instagram: artistData.socialLinks.instagram || '',
              youtube: artistData.socialLinks.youtube || '',
              spotify: artistData.socialLinks.spotify || '',
              tiktok: artistData.socialLinks.tiktok || '',
            });
          }

        }
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    fetchArtistData();
  }, []);

  // Default artist data
  const defaultArtist = {
    name: "Constance Aman",
    title: "Chanteuse Gospel & Fondatrice de l'École des Adorateurs",
    tagline: "Une vie entièrement au service de la musique gospel depuis 35 ans",
    birthDate: "7 janvier 1972",
    birthPlace: "Bouaké, Côte d'Ivoire",
    realName: "Coumoin Amani Constance",
    bio: "Constance Aman est une artiste chantre ivoirienne, figure emblématique du gospel africain depuis plus de 35 ans. Née à Bouaké le 7 janvier 1972, elle grandit dans une famille profondément ancrée dans la foi chrétienne. À 15 ans, touchée par la grâce, elle accepte Jésus-Christ et se fait baptiser en 1985. Son style unique mêle gospel, sonorités afro, jazz et bossa nova.",
    fullBio: "Issue d'une famille où la prière et le chant étaient aussi naturels que le souffle, Constance Aman se révèle très jeune au monde musical à travers les cultes de maison et les écoles de dimanche. Elle débute comme chantre dans les camps de jeunesse de la Ligue pour la Lecture de la Bible (LLB), puis dans le groupe musical de son église de Cocody à Abidjan. En 1989, le manager Kouassi Koffi Ambroise remarque son talent et l'aide à faire ses premières apparitions aux côtés de Mathieu Bédé pour l'album 'L'Humanité est troublée'. En 1990, elle lance sa carrière solo avec 'Louez l'Éternel', premier grand succès d'un album chrétien en Côte d'Ivoire. Depuis 2008, elle sert à plein temps le Seigneur. Mariée et mère de trois enfants, elle est aussi la fondatrice de l'École des Adorateurs, une école de formation à l'Adoration et au chant.",
    image: "/images/constance-main.jpg",
    achievements: [
      { icon: "star", label: "Années de carrière", value: "35+" },
      { icon: "music", label: "Albums studio", value: "11" },
      { icon: "heart", label: "Fondatrice", value: "École des Adorateurs" },
      { icon: "globe", label: "Rayonnement", value: "Afrique & Europe" },
    ],
    quote: "La musique est ma prière, chaque note est une louange à l'Éternel.",
    style: "Gospel, Afro, Jazz, Bossa Nova",
  };

  // Base URL for static assets (without /api/v1)
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace('/api/v1', '');

  // Use API data first, then CMS content, then defaults
  const artist = artistFromAPI || content?.artist || defaultArtist;

  // Default albums data - Albums réels de Constance Aman
  const defaultAlbums = [
    {
      year: "1998",
      title: "Alléluia",
      cover: `${API_BASE_URL}/uploads/images/albums/alleluia.jpg`,
      description: "Album de louange et d'adoration qui a marqué le début d'une nouvelle ère musicale",
      tracks: 12,
      highlight: "Succès continental",
      type: "Album solo",
    },
    {
      year: "2003",
      title: "Père Je T'adore",
      cover: `${API_BASE_URL}/uploads/images/albums/pere-je-tadore.jpg`,
      description: "Album d'adoration profonde avec 3 chants bonus - Un témoignage de foi",
      tracks: 13,
      highlight: "Album culte",
      type: "Album solo",
    },
    {
      year: "2008",
      title: "Je Puis Tout",
      cover: `${API_BASE_URL}/uploads/images/albums/je-puis-tout.jpg`,
      description: "Inspiré de Philippiens 4:13 - Album de victoire et de foi en Christ",
      tracks: 11,
      highlight: "Studio Asaph Production",
      type: "Album solo",
    },
    {
      year: "2012",
      title: "Pour Sa Gloire",
      cover: `${API_BASE_URL}/uploads/images/albums/pour-sa-gloire.jpg`,
      description: "Album dédié entièrement à la gloire de Dieu - Chants de louange et d'adoration",
      tracks: 12,
      highlight: "Album spirituel",
      type: "Album solo",
    },
    {
      year: "2016",
      title: "Compilation en Langue",
      cover: `${API_BASE_URL}/uploads/images/albums/compilation-en-langue.jpg`,
      description: "Compilation spéciale de chants en langues africaines - Héritage culturel",
      tracks: 14,
      highlight: "Compilation spéciale",
      type: "Compilation",
    },
    {
      year: "2020",
      title: "Best Of",
      cover: `${API_BASE_URL}/uploads/images/albums/best-of.jpg`,
      description: "Les meilleurs titres de 30 ans de carrière - Rétrospective musicale",
      tracks: 18,
      highlight: "30 ans de carrière",
      type: "Compilation",
    },
  ];

  // Use API albums first, then CMS, then defaults
  const albums = albumsFromAPI || content?.artistAlbums || defaultAlbums;

  // Default social links
  const defaultSocialLinks = {
    facebook: "https://www.facebook.com/constanceaman",
    instagram: "https://www.instagram.com/constance.aman.officiel",
    youtube: "https://www.youtube.com/constanceaman",
    spotify: "https://open.spotify.com/artist/constanceaman",
    tiktok: "https://www.tiktok.com/@constanceaman",
  };

  // Use API social links first, then CMS, then defaults
  const socialLinks = socialLinksFromAPI || content?.artistSocial || defaultSocialLinks;

  const getAchievementIcon = (iconName) => {
    const icons = {
      star: HiStar,
      music: HiMusicNote,
      heart: HiHeart,
      globe: HiGlobe,
      sparkles: HiSparkles,
    };
    const Icon = icons[iconName] || HiStar;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <section id="artist" className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 overflow-hidden">
      {/* Hero Section - L'Artiste avec image illuminée */}
      <div className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <HiSparkles className="w-4 h-4 mr-2 text-secondary-400" />
              L'ARTISTE
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Découvrez {artist.name}
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Artist Image with Elegant Glow Effect */}
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Elegant illumination container */}
              <div className="relative -mt-16">
                {/* Soft outer glow - elegant purple/gold blend */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/40 via-secondary-500/30 to-accent-500/40 rounded-3xl blur-2xl animate-artist-soft-glow" />

                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-secondary-400 via-accent-400 to-primary-400 rounded-2xl animate-artist-gradient opacity-70" />

                {/* Inner glow ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl" />

                {/* Image container */}
                <div className="relative bg-primary-900 rounded-2xl p-1 z-10">
                  <div className="relative w-80 h-96 md:w-96 md:h-[28rem] rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder-artist.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Subtle corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent-400/60 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-accent-400/60 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-accent-400/60 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent-400/60 rounded-br-lg" />

                {/* Floating light dots */}
                <motion.div
                  className="absolute -top-3 left-1/2 w-2 h-2 bg-accent-400 rounded-full shadow-lg shadow-accent-400/50"
                  animate={{ y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-1/2 -right-3 w-2 h-2 bg-secondary-400 rounded-full shadow-lg shadow-secondary-400/50"
                  animate={{ x: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div
                  className="absolute -bottom-3 left-1/2 w-2 h-2 bg-primary-300 rounded-full shadow-lg shadow-primary-300/50"
                  animate={{ y: [3, -3, 3], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                  className="absolute top-1/2 -left-3 w-2 h-2 bg-accent-300 rounded-full shadow-lg shadow-accent-300/50"
                  animate={{ x: [3, -3, 3], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Name with animated gradient */}
              <motion.h1
                className="text-4xl md:text-5xl font-display font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-white via-primary-200 to-secondary-300 bg-clip-text text-transparent">
                  {artist.name}
                </span>
              </motion.h1>

              {/* Title */}
              <motion.p
                className="text-lg md:text-xl text-primary-200 font-medium mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {artist.title}
              </motion.p>

              {/* Tagline */}
              <motion.p
                className="text-lg text-white/80 italic mb-6 border-l-4 border-secondary-500 pl-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                "{artist.tagline}"
              </motion.p>

              {/* Bio */}
              <motion.p
                className="text-white/70 leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                {artist.bio}
              </motion.p>

              {/* Achievements Grid */}
              <motion.div
                className="grid grid-cols-2 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                {artist.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <p className="text-xl font-bold text-white">{achievement.value}</p>
                    <p className="text-white/60 text-xs">{achievement.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-white/60 text-sm mr-2">Suivez-la:</span>
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all hover:scale-110"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-110"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all hover:scale-110"
                  >
                    <FaYoutube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.spotify && (
                  <a
                    href={socialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-green-500 transition-all hover:scale-110"
                  >
                    <FaSpotify className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black transition-all hover:scale-110"
                  >
                    <FaTiktok className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <motion.div
        className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="text-6xl text-primary-300 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            "
          </motion.div>
          <motion.p
            className="text-2xl md:text-3xl text-white font-light italic leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {artist.quote}
          </motion.p>
          <motion.p
            className="mt-6 text-primary-300 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            — {artist.name}
          </motion.p>
        </div>
      </motion.div>

      {/* Albums Timeline Section */}
      <div className="py-20 bg-gradient-to-b from-primary-800 to-primary-900" ref={timelineRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium mb-4">
              <HiMusicNote className="w-4 h-4 inline mr-2" />
              DISCOGRAPHIE
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              L'Évolution Musicale
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Un voyage à travers les années, album après album
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 rounded-full" />

            {/* Albums */}
            <div className="relative flex justify-between items-center overflow-x-auto pb-4 hide-scrollbar">
              {albums.map((album, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center px-4 cursor-pointer group"
                  initial={{ opacity: 0, y: isTimelineInView ? 0 : 50 }}
                  animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setActiveAlbum(index)}
                >
                  {/* Year */}
                  <motion.p
                    className={`text-sm font-bold mb-4 transition-colors ${
                      activeAlbum === index ? 'text-primary-400' : 'text-gray-500'
                    }`}
                  >
                    {album.year}
                  </motion.p>

                  {/* Timeline Point */}
                  <div
                    className={`w-6 h-6 rounded-full border-4 transition-all mb-4 ${
                      activeAlbum === index
                        ? 'bg-primary-500 border-primary-300 scale-125'
                        : 'bg-gray-700 border-gray-600 group-hover:bg-primary-600'
                    }`}
                  />

                  {/* Album Cover */}
                  <motion.div
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-2xl transition-all ${
                      activeAlbum === index ? 'scale-110 ring-4 ring-primary-500' : 'opacity-70 group-hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate">
                      {album.title}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Active Album Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAlbum}
                className="mt-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Album Cover Large */}
                  <motion.div
                    className="relative aspect-square max-w-md mx-auto"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={albums[activeAlbum].cover}
                      alt={albums[activeAlbum].title}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute -bottom-4 -right-4 bg-primary-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      {albums[activeAlbum].year}
                    </div>
                  </motion.div>

                  {/* Album Info */}
                  <div>
                    <motion.h3
                      className="text-3xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {albums[activeAlbum].title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300 text-lg mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {albums[activeAlbum].description}
                    </motion.p>

                    <motion.div
                      className="flex items-center space-x-6 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center text-gray-400">
                        <HiMusicNote className="w-5 h-5 mr-2 text-primary-400" />
                        <span>{albums[activeAlbum].tracks} titres</span>
                      </div>
                      <div className="flex items-center text-primary-300">
                        <HiStar className="w-5 h-5 mr-2" />
                        <span>{albums[activeAlbum].highlight}</span>
                      </div>
                    </motion.div>

                    {/* Streaming Buttons */}
                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {albums[activeAlbum].spotifyUrl && (
                        <a
                          href={albums[activeAlbum].spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
                        >
                          <FaSpotify className="w-5 h-5 mr-2" />
                          Écouter sur Spotify
                        </a>
                      )}
                      {albums[activeAlbum].youtubeUrl && (
                        <a
                          href={albums[activeAlbum].youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
                        >
                          <FaYoutube className="w-5 h-5 mr-2" />
                          YouTube Music
                        </a>
                      )}
                      {albums[activeAlbum].appleMusicUrl && (
                        <a
                          href={albums[activeAlbum].appleMusicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.997 6.124a9.23 9.23 0 00-.24-2.19 5.57 5.57 0 00-1.33-2.09 5.566 5.566 0 00-2.09-1.33 9.23 9.23 0 00-2.19-.24C16.53.2 16.04.18 12 .18s-4.53.02-6.15.09a9.23 9.23 0 00-2.19.24 5.57 5.57 0 00-2.09 1.33 5.566 5.566 0 00-1.33 2.09 9.23 9.23 0 00-.24 2.19C.002 7.74-.02 8.23-.02 12s.02 4.26.09 5.88a9.23 9.23 0 00.24 2.19 5.57 5.57 0 001.33 2.09 5.566 5.566 0 002.09 1.33 9.23 9.23 0 002.19.24c1.62.07 2.11.09 6.15.09s4.53-.02 6.15-.09a9.23 9.23 0 002.19-.24 5.82 5.82 0 003.42-3.42 9.23 9.23 0 00.24-2.19c.07-1.62.09-2.11.09-6.15s-.02-4.26-.09-5.88zM12 18.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z"/>
                          </svg>
                          Apple Music
                        </a>
                      )}
                      {albums[activeAlbum].deezerUrl && (
                        <a
                          href={albums[activeAlbum].deezerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38H6.27zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027H6.27zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03H6.27zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19z"/>
                          </svg>
                          Deezer
                        </a>
                      )}
                      {!albums[activeAlbum].spotifyUrl && !albums[activeAlbum].youtubeUrl && !albums[activeAlbum].appleMusicUrl && !albums[activeAlbum].deezerUrl && (
                        <span className="text-gray-400 italic">
                          Liens streaming bientôt disponibles
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Elegant Artist Image Animations */
        @keyframes artist-soft-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }

        @keyframes artist-gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-artist-soft-glow {
          animation: artist-soft-glow 4s ease-in-out infinite;
        }

        .animate-artist-gradient {
          background-size: 200% 200%;
          animation: artist-gradient-flow 5s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default ArtistSection;
