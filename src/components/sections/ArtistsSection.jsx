import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiX, HiExternalLink } from 'react-icons/hi';
import { FaSpotify, FaYoutube, FaInstagram } from 'react-icons/fa';
import { useEvent } from '../../context/EventContext';

const ArtistsSection = () => {
  const { t } = useTranslation();
  const { event, content } = useEvent();
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Get artists from event or content
  const artists = event?.performers || content?.artists || [];

  const openArtistModal = (artist) => {
    setSelectedArtist(artist);
  };

  const closeArtistModal = () => {
    setSelectedArtist(null);
    setActiveVideo(null);
  };

  const playVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
  };

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  return (
    <section id="artists" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium mb-4">
            {t('artists.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('artists.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('artists.description')}
          </p>
        </motion.div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist._id || index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Artist Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={artist.image || artist.photo || '/images/artist-placeholder.jpg'}
                  alt={artist.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Play Button Overlay */}
                {artist.videoUrl && (
                  <button
                    onClick={() => openArtistModal(artist)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                      <HiPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                  </button>
                )}

                {/* Artist Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
                  <p className="text-gray-300 text-sm">{artist.role || artist.genre}</p>
                </div>
              </div>

              {/* Artist Details */}
              <div className="p-6">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {artist.bio || artist.description}
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-3">
                  {artist.socialLinks?.spotify && (
                    <a
                      href={artist.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <FaSpotify className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks?.youtube && (
                    <a
                      href={artist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaYoutube className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks?.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* View More Button */}
                <button
                  onClick={() => openArtistModal(artist)}
                  className="mt-4 w-full py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors text-sm font-medium"
                >
                  {t('artists.viewMore')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {artists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('artists.noArtists')}</p>
          </div>
        )}
      </div>

      {/* Artist Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArtistModal}
          >
            <motion.div
              className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeArtistModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <HiX className="w-6 h-6 text-gray-700" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Left - Image/Video */}
                <div className="relative h-64 md:h-full min-h-[300px]">
                  {activeVideo ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={selectedArtist.image || selectedArtist.photo}
                        alt={selectedArtist.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {selectedArtist.videoUrl && (
                        <button
                          onClick={() => playVideo(selectedArtist.videoUrl)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30"
                        >
                          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <HiPlay className="w-10 h-10 text-white ml-1" />
                          </div>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Right - Info */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedArtist.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-4">
                    {selectedArtist.role || selectedArtist.genre}
                  </p>

                  <p className="text-gray-600 mb-6">
                    {selectedArtist.fullBio || selectedArtist.bio || selectedArtist.description}
                  </p>

                  {/* Media Gallery */}
                  {selectedArtist.gallery && selectedArtist.gallery.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        {t('artists.gallery')}
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedArtist.gallery.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url || img}
                            alt=""
                            className="w-full h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos List */}
                  {selectedArtist.videos && selectedArtist.videos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        {t('artists.videos')}
                      </h4>
                      <div className="space-y-2">
                        {selectedArtist.videos.map((video, idx) => (
                          <button
                            key={idx}
                            onClick={() => playVideo(video.url)}
                            className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <HiPlay className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm text-gray-700">{video.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center space-x-4 pt-4 border-t">
                    {selectedArtist.socialLinks?.spotify && (
                      <a
                        href={selectedArtist.socialLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-green-500 transition-colors"
                      >
                        <FaSpotify className="w-5 h-5 mr-2" />
                        <span className="text-sm">Spotify</span>
                      </a>
                    )}
                    {selectedArtist.socialLinks?.youtube && (
                      <a
                        href={selectedArtist.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <FaYoutube className="w-5 h-5 mr-2" />
                        <span className="text-sm">YouTube</span>
                      </a>
                    )}
                    {selectedArtist.website && (
                      <a
                        href={selectedArtist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <HiExternalLink className="w-5 h-5 mr-2" />
                        <span className="text-sm">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ArtistsSection;
