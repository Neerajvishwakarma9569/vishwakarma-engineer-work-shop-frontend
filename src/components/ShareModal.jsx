import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  Send,
  Mail,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './Css/ShareModal.css';

export default function ShareModal({ product, isOpen, onClose, onShareSuccess }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(product?.shareCount || 0);
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasNativeShare(true);
    }
    if (product?.shareCount !== undefined) {
      setShareCount(product.shareCount);
    }
  }, [product]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Build the full share URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/products/${product._id}`;
  const shareTitle = `${product.name} | Vishwakarma Engineer Workshop`;
  const priceText = product.price > 0 ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Best Price';
  const shareText = `Check out "${product.name}" (${priceText}) at Vishwakarma Engineer Workshop:`;

  // Log share event to backend
  const logShare = async (platform) => {
    try {
      const res = await api.post(`/products/${product._id}/share`, {
        platform,
        sharedUrl: shareUrl,
      });
      if (res.data?.shareCount !== undefined) {
        setShareCount(res.data.shareCount);
        if (onShareSuccess) {
          onShareSuccess(res.data.shareCount);
        }
      }
    } catch (err) {
      // Non-blocking log failure
      console.warn('Share log failed:', err.message);
    }
  };

  // 1. Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      logShare('copy_link');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // 2. Open Social Media URL
  const handleSocialShare = (platform, url) => {
    logShare(platform);
    window.open(url, '_blank', 'noopener,noreferrer,width=650,height=550');
  };

  // 3. Native mobile device share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        logShare('native_share');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Native share error:', err);
        }
      }
    }
  };

  // Encoded social links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}\n\nVishwakarma Engineer Workshop`)}`;

  return (
    <div
      className="share-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="share-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <div className="share-header-left">
            <Share2 size={20} className="share-header-icon" />
            <h3 id="share-modal-title">{t('Share Product', 'उत्पाद शेयर करें')}</h3>
          </div>
          <button
            type="button"
            className="share-close-btn"
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="share-modal-body">
          {/* Product Snippet Preview */}
          <div className="share-product-snippet">
            <img
              src={product.image || '/Images/placeholder.png'}
              alt={product.name}
              className="share-product-thumb"
            />
            <div className="share-product-info">
              <span className="share-product-category">{product.category || 'Workshop Item'}</span>
              <h4>{product.name}</h4>
              <div className="share-product-price-row">
                <span className="share-product-price">{priceText}</span>
                {shareCount > 0 && (
                  <span className="share-count-chip" title="Total times shared">
                    <Share2 size={12} /> {shareCount} {t('shares', 'शेयर')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="share-copy-section">
            <label htmlFor="share-copy-link-input" className="share-section-title">
              {t('Direct Product Link', 'सीधा प्रोडक्ट लिंक')}
            </label>
            <div className="share-copy-box">
              <input
                id="share-copy-link-input"
                type="text"
                readOnly
                value={shareUrl}
                className="share-copy-input"
                onClick={(e) => e.target.select()}
              />
              <button
                type="button"
                className={`share-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check size={16} /> {t('Copied!', 'कॉपी हो गया!')}
                  </>
                ) : (
                  <>
                    <Copy size={16} /> {t('Copy Link', 'लिंक कॉपी करें')}
                  </>
                )}
              </button>
            </div>
            {copied && (
              <span className="share-copied-notice">
                <Check size={14} /> {t('Link copied to clipboard! Ready to paste.', 'लिंक क्लिपबोर्ड पर कॉपी हो गया!')}
              </span>
            )}
          </div>

          {/* Social Media Grid */}
          <div className="share-social-section">
            <span className="share-section-title">
              {t('Share on Social Media', 'सोशल मीडिया पर शेयर करें')}
            </span>
            <div className="share-social-grid">
              {/* WhatsApp */}
              <button
                type="button"
                className="share-social-btn whatsapp"
                onClick={() => handleSocialShare('whatsapp', whatsappUrl)}
                title="Share on WhatsApp"
              >
                <div className="social-btn-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <span className="social-btn-label">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="share-social-btn facebook"
                onClick={() => handleSocialShare('facebook', facebookUrl)}
                title="Share on Facebook"
              >
                <div className="social-btn-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="social-btn-label">Facebook</span>
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                className="share-social-btn twitter"
                onClick={() => handleSocialShare('twitter', twitterUrl)}
                title="Share on X"
              >
                <div className="social-btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="social-btn-label">X / Twitter</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                className="share-social-btn telegram"
                onClick={() => handleSocialShare('telegram', telegramUrl)}
                title="Share on Telegram"
              >
                <div className="social-btn-icon">
                  <Send size={20} />
                </div>
                <span className="social-btn-label">Telegram</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                className="share-social-btn linkedin"
                onClick={() => handleSocialShare('linkedin', linkedinUrl)}
                title="Share on LinkedIn"
              >
                <div className="social-btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                </div>
                <span className="social-btn-label">LinkedIn</span>
              </button>

              {/* Email */}
              <button
                type="button"
                className="share-social-btn email"
                onClick={() => handleSocialShare('email', emailUrl)}
                title="Share via Email"
              >
                <div className="social-btn-icon">
                  <Mail size={20} />
                </div>
                <span className="social-btn-label">Email</span>
              </button>

              {/* Mobile Native Share (if supported) */}
              {hasNativeShare && (
                <button
                  type="button"
                  className="share-social-btn native"
                  onClick={handleNativeShare}
                  title="More device sharing options"
                >
                  <div className="social-btn-icon">
                    <Smartphone size={20} />
                  </div>
                  <span className="social-btn-label">{t('More Apps', 'अन्य ऐप्स')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="share-modal-footer">
          <span>{t('Authentic Workshop Craftsmanship', 'विश्वकर्मा इंजीनियरिंग वर्कशॉप')}</span>
          <span className="share-footer-brand">Vishwakarma Engineer Workshop</span>
        </div>
      </div>
    </div>
  );
}
