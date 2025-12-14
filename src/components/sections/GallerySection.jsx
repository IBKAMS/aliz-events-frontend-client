import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiX, HiChevronLeft, HiChevronRight, HiPhotograph } from 'react-icons/hi';
import { useEvent } from '../../context/EventContext';

const GallerySection = () => {
  const { t } = useTranslation();
  const { content } = useEvent();
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [artistGallery, setArtistGallery] = useState([]);
  const [artistVideos, setArtistVideos] = useState([]);

  // Fetch artist gallery data from API
  useEffect(() => {
    const fetchArtistGallery = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
        const baseUrl = API_URL.replace('/api/v1', '');
        const response = await fetch(`${API_URL}/artist`);
        const data = await response.json();

        if (data.success && data.data) {
          // Get gallery images from artist
          if (data.data.gallery && data.data.gallery.length > 0) {
            const galleryWithFullUrls = data.data.gallery.map(img => ({
              ...img,
              url: img.url?.startsWith('http') ? img.url : `${baseUrl}${img.url}`,
            }));
            setArtistGallery(galleryWithFullUrls);
          }

          // Get videos from artist
          if (data.data.videos && data.data.videos.length > 0) {
            const videosWithFullUrls = data.data.videos.map(video => ({
              ...video,
              url: video.url?.startsWith('http') ? video.url : `${baseUrl}${video.url}`,
              thumbnail: video.thumbnail?.startsWith('http') ? video.thumbnail : video.thumbnail ? `${baseUrl}${video.thumbnail}` : '',
            }));
            setArtistVideos(videosWithFullUrls);
          }
        }
      } catch (error) {
        console.error('Error fetching artist gallery:', error);
      }
    };

    fetchArtistGallery();
  }, []);

  // Combine CMS gallery with artist gallery (artist gallery takes priority)
  const photos = artistGallery.length > 0 ? artistGallery : (content?.gallery?.photos || []);
  const videos = artistVideos.length > 0 ? artistVideos : (content?.gallery?.videos || []);

  const tabs = [
    { id: 'photos', label: t('gallery.photos'), count: photos.length },
    { id: 'videos', label: t('gallery.videos'), count: videos.length },
  ];

  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const navigateLightbox = (direction) => {
    const items = activeTab === 'photos' ? photos : videos;
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    setCurrentIndex(newIndex);
    setSelectedItem(items[newIndex]);
  };

  // Extract YouTube video ID
  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium mb-4">
            {t('gallery.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('gallery.description')}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex bg-white/10 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center space-x-1.5 sm:space-x-2 min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-gray-300 hover:text-white active:bg-white/10'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.label}</span>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                    activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id || index}
                className={`relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(photo, index)}
              >
                <img
                  src={photo.url || photo}
                  alt={photo.caption || `Photo ${index + 1}`}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    index === 0 ? 'h-full min-h-[200px] sm:min-h-[400px]' : 'h-32 sm:h-48 md:h-56'
                  }`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <HiPhotograph className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                  </div>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs sm:text-sm">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video._id || index}
                className="relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-gray-900"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => openLightbox(video, index)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={
                      video.thumbnail ||
                      `https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`
                    }
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <HiPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="text-white font-semibold line-clamp-1">
                    {video.title}
                  </h4>
                  {video.duration && (
                    <span className="text-gray-400 text-sm">{video.duration}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {((activeTab === 'photos' && photos.length === 0) ||
          (activeTab === 'videos' && videos.length === 0)) && (
          <div className="text-center py-12">
            <HiPhotograph className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('gallery.noMedia')}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors"
            >
              <HiX className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors"
            >
              <HiChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors"
            >
              <HiChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Content */}
            <motion.div
              className="max-w-5xl w-full mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {activeTab === 'photos' ? (
                <img
                  src={selectedItem.url || selectedItem}
                  alt={selectedItem.caption || ''}
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <div className="aspect-video">
                  {/* Check if it's a YouTube video or local video */}
                  {getYoutubeId(selectedItem.url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(selectedItem.url)}?autoplay=1`}
                      className="w-full h-full rounded-xl"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedItem.url}
                      className="w-full h-full rounded-xl"
                      controls
                      autoPlay
                    />
                  )}
                </div>
              )}

              {/* Caption */}
              {(selectedItem.caption || selectedItem.title) && (
                <div className="mt-4 text-center">
                  <p className="text-white">{selectedItem.caption || selectedItem.title}</p>
                </div>
              )}

              {/* Counter */}
              <div className="mt-4 text-center text-white/60 text-sm">
                {currentIndex + 1} / {activeTab === 'photos' ? photos.length : videos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
