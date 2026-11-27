import React, { useEffect, useState, useCallback, useId } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  ShoppingCart,
  Zap,
  Check,
  Star,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Hammer,
  Sparkles,
  Palette,
  Truck,
  MessageSquare,
  Lock,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ShareModal from '../components/ShareModal';
import Loader from '../components/Loader';
import './Css/ProductDetaile.css';

// Star Display Helper Component
function StarDisplay({ rating = 0, size = 16, className = '' }) {
  const rounded = Math.round(rating);
  return (
    <span className={`stars-display-row ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rounded ? 'star-gold' : 'star-muted'}
          fill={star <= rounded ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

// Interactive Star Rating Picker
function StarRatingPicker({ value, onChange, label, sublabel, required = true }) {
  const { t } = useLanguage();
  const [hover, setHover] = useState(0);
  const activeRating = hover || value || 0;
  const ratingTexts = [
    '',
    t('Poor', 'खराब'),
    t('Fair', 'सामान्य'),
    t('Good', 'अच्छा'),
    t('Very Good', 'बहुत अच्छा'),
    t('Excellent', 'उत्कृष्ट'),
  ];
  const fieldId = useId();

  return (
    <div className="star-picker-item">
      <div className="star-picker-labels">
        <label id={fieldId} className="star-picker-title">
          {label} {required && <span className="req">*</span>}
        </label>
        {sublabel && <span className="star-picker-sublabel">{sublabel}</span>}
      </div>
      <div
        className="star-picker-stars"
        role="radiogroup"
        aria-labelledby={fieldId}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-pick-btn ${star <= activeRating ? 'active' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star - ${ratingTexts[star]}`}
          >
            <Star
              size={22}
              className={star <= activeRating ? 'star-gold' : 'star-muted'}
              fill={star <= activeRating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        <span className="star-rating-hint">{ratingTexts[activeRating] || 'Click to rate'}</span>
      </div>
    </div>
  );
}

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAddToCart = () => {
    if (!p) return;
    add(p, selectedQty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 4000);
  };

  const handleBuyNow = () => {
    if (!p) return;
    add(p, selectedQty);
    navigate('/cart');
  };

  // Reviews state
  const [reviewData, setReviewData] = useState({
    stats: {
      totalReviews: 0,
      averageRating: 0,
      materialQualityAvg: 0,
      finishingQualityAvg: 0,
      designQualityAvg: 0,
      deliveryExperienceAvg: 0,
      distribution: {
        5: { count: 0, percent: 0 },
        4: { count: 0, percent: 0 },
        3: { count: 0, percent: 0 },
        2: { count: 0, percent: 0 },
        1: { count: 0, percent: 0 },
      },
    },
    reviews: [],
    pagination: { total: 0, page: 1, pages: 1 },
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  // User eligibility & form state
  const [eligibility, setEligibility] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    materialQuality: 5,
    finishingQuality: 5,
    designQuality: 5,
    deliveryExperience: 5,
    title: '',
    comment: '',
  });

  // Load product
  useEffect(() => {
    setP(null);
    setError('');
    setSelectedMedia(0);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setP(data))
      .catch(() => setError('Product not found.'));
  }, [id]);

  // Load reviews
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get(`/products/${id}/reviews`, {
        params: { sort, page, limit: 8 },
      });
      setReviewData(data);
    } catch (err) {
      console.error('Could not load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, sort, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check user eligibility if logged in
  const checkEligibility = useCallback(async () => {
    if (!user) {
      setEligibility(null);
      return;
    }
    try {
      const { data } = await api.get(`/products/${id}/reviews/eligibility`);
      setEligibility(data);
      if (data.userReview) {
        setReviewForm({
          rating: data.userReview.rating || 5,
          materialQuality: data.userReview.materialQuality || 5,
          finishingQuality: data.userReview.finishingQuality || 5,
          designQuality: data.userReview.designQuality || 5,
          deliveryExperience: data.userReview.deliveryExperience || 5,
          title: data.userReview.title || '',
          comment: data.userReview.comment || '',
        });
      }
    } catch {
      setEligibility(null);
    }
  }, [id, user]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  // Handle Review Submission (Create or Edit)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setFormBusy(true);
    setFormError('');
    setFormSuccess('');

    try {
      if (isEditing && eligibility?.userReview?._id) {
        // Update existing review
        await api.put(`/reviews/${eligibility.userReview._id}`, reviewForm);
        setFormSuccess(t('Your review has been updated successfully!', 'रिव्यू सफलतापूर्वक अपडेट हो गया!'));
      } else {
        // Create new review
        await api.post(`/products/${id}/reviews`, reviewForm);
        setFormSuccess(t('Thank you! Your review has been submitted successfully!', 'धन्यवाद! आपका रिव्यू सफलतापूर्वक सबमिट हो गया!'));
      }

      setShowReviewForm(false);
      setIsEditing(false);
      await Promise.all([fetchReviews(), checkEligibility()]);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save review. Please check all ratings.');
    } finally {
      setFormBusy(false);
    }
  };

  // Delete own review
  const handleDeleteReview = async () => {
    if (!eligibility?.userReview?._id) return;
    const confirmed = window.confirm(
      t('Are you sure you want to delete your review?', 'क्या आप अपना रिव्यू डिलीट करना चाहते हैं?')
    );
    if (!confirmed) return;

    setFormBusy(true);
    setFormError('');
    try {
      await api.delete(`/reviews/${eligibility.userReview._id}`);
      setFormSuccess('Your review has been deleted.');
      setShowReviewForm(false);
      setIsEditing(false);
      setReviewForm({
        rating: 5,
        materialQuality: 5,
        finishingQuality: 5,
        designQuality: 5,
        deliveryExperience: 5,
        title: '',
        comment: '',
      });
      await Promise.all([fetchReviews(), checkEligibility()]);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not delete review.');
    } finally {
      setFormBusy(false);
    }
  };

  // Handle Helpful vote
  const handleToggleHelpful = async (reviewId) => {
    if (!user) {
      window.alert('Please log in to mark reviews as helpful.');
      return;
    }
    try {
      const { data } = await api.post(`/reviews/${reviewId}/helpful`);
      // Update local state without full reload
      setReviewData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((rev) =>
          rev._id === reviewId
            ? { ...rev, helpfulCount: data.helpfulCount, hasVotedHelpful: data.hasVoted }
            : rev
        ),
      }));
    } catch (err) {
      console.error('Helpful error:', err);
    }
  };

  if (error)
    return (
      <main className="product-details-page container section">
        <p className="error-message">{error}</p>
        <Link to="/products" className="btn btn-outline">
          &larr; Back to products
        </Link>
      </main>
    );

  if (!p)
    return (
      <main className="product-details-page container section">
        <Loader label="Loading product..." />
      </main>
    );

  const galleryImages = p.images?.length ? p.images.map((image) => image.url) : [p.image];
  const hasVideo = Boolean(p.videoUrl);
  const mediaCount = galleryImages.length + (hasVideo ? 1 : 0);
  const showNextMedia = () => setSelectedMedia((index) => (index + 1) % mediaCount);

  const stats = reviewData.stats;
  const distribution = stats.distribution || {};

  return (
    <main className="product-details-page container section">
      {/* 1. TOP PRODUCT DETAIL GRID */}
      <div className="detail-grid">
        <section className="product-gallery" aria-label="Product photos and video">
          <div className="detail-media">
            {hasVideo && selectedMedia === galleryImages.length ? (
              <video className="detail-image" src={p.videoUrl} controls playsInline />
            ) : (
              <button
                className="detail-image-button"
                type="button"
                onClick={showNextMedia}
                aria-label="Show next product photo"
              >
                <img
                  className="detail-image"
                  src={galleryImages[selectedMedia]}
                  alt={`${p.name} photo ${selectedMedia + 1}`}
                />
              </button>
            )}
          </div>
          {mediaCount > 1 && (
            <div className="gallery-thumbnails" aria-label="Select product media">
              {galleryImages.map((image, index) => (
                <button
                  className={`gallery-thumbnail${selectedMedia === index ? ' active' : ''}`}
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedMedia(index)}
                  aria-label={`Show product photo ${index + 1}`}
                  aria-pressed={selectedMedia === index}
                >
                  <img src={image} alt="" />
                </button>
              ))}
              {hasVideo && (
                <button
                  className={`gallery-thumbnail video-thumbnail${
                    selectedMedia === galleryImages.length ? ' active' : ''
                  }`}
                  type="button"
                  onClick={() => setSelectedMedia(galleryImages.length)}
                  aria-label="Play product video"
                  aria-pressed={selectedMedia === galleryImages.length}
                >
                  <video src={p.videoUrl} muted preload="metadata" />
                  <span>
                    <Play size={16} fill="currentColor" />
                  </span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Product Information */}
        <div className="detail-info-block">
          <span className="eyebrow">{p.category}</span>
          <h1>{p.name}</h1>

          {/* Quick Rating Header Pill */}
          <div className="product-header-rating-badge">
            <StarDisplay rating={stats.averageRating} size={15} />
            <a href="#reviews-section" className="rating-link-anchor">
              <strong>{stats.averageRating > 0 ? stats.averageRating : 'New'}</strong>
              <span>({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})</span>
            </a>
          </div>

          <p className="product-desc-text">{p.description}</p>

          {(p.heightCm || p.widthCm) && (
            <p className="product-spec">
              <b>Dimensions:</b>{' '}
              {p.heightCm ? `${p.heightCm} cm height` : ''}
              {p.heightCm && p.widthCm ? ' × ' : ''}
              {p.widthCm ? `${p.widthCm} cm width` : ''}
            </p>
          )}

          {p.usedMaterials?.length > 0 && (
            <p className="product-spec">
              <b>Materials used:</b> {p.usedMaterials.join(', ')}
            </p>
          )}

          {p.discountPercent > 0 && (
            <p className="product-spec discount-tag">
              <b>Special Offer:</b> {p.discountPercent}% Discount
            </p>
          )}

          <div className="product-price-and-share-row">
            <h2>
              {p.price > 0 ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'Request a quote'}
            </h2>
            <button
              type="button"
              className="btn-share-product-pill"
              onClick={() => setShowShareModal(true)}
              title={t('Share this product', 'इस उत्पाद को शेयर करें')}
            >
              <Share2 size={16} />
              <span>{t('Share', 'शेयर')}</span>
              {p.shareCount > 0 && <span className="share-counter-badge">{p.shareCount}</span>}
            </button>
          </div>

          <p className="muted availability-info">
            Availability: {p.stock > 0 ? `${p.stock} units ready in workshop` : 'Custom Made to Order / confirm availability'}
          </p>

          <div className="detail-actions-row">
            <div className="qty-selector-wrap" title="Select quantity">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">{selectedQty}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setSelectedQty((prev) => prev + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`btn btn-add-to-cart ${addedToast ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToast ? <Check size={19} /> : <ShoppingCart size={19} />}
              <span>{addedToast ? 'ADDED TO CART ✓' : 'ADD TO CART'}</span>
            </button>

            <button
              type="button"
              className="btn btn-buy-now"
              onClick={handleBuyNow}
            >
              <Zap size={19} />
              <span>BUY NOW</span>
            </button>

            <button
              type="button"
              className="btn btn-detail-share"
              onClick={() => setShowShareModal(true)}
              title={t('Share this product', 'इस उत्पाद को शेयर करें')}
            >
              <Share2 size={18} />
              <span>{t('Share', 'शेयर')}</span>
            </button>
          </div>

          {addedToast && (
            <div className="cart-feedback-toast" role="status">
              <span>✓ {p.name} ({selectedQty} {selectedQty > 1 ? 'units' : 'unit'}) added to cart!</span>
              <Link to="/cart">View Cart & Checkout &rarr;</Link>
            </div>
          )}

          <p className="muted enquiry-prompt">
            Need custom fabrication, specific steel gauge, or special paint finish?{' '}
            <Link to="/contact">Send an enquiry &rarr;</Link>
          </p>
        </div>
      </div>

      {/* 2. REVIEWS & RATINGS SECTION */}
      <section id="reviews-section" className="product-reviews-section">
        <div className="reviews-section-header">
          <div>
            <span className="eyebrow gold">CUSTOMER FEEDBACK</span>
            <h2>{t('Ratings & Quality Reviews', 'ग्राहक समीक्षा')}</h2>
            <p>Real verified workshop customer experiences, build craftsmanship, and finishing ratings.</p>
          </div>
        </div>

        {formSuccess && (
          <div className="notice" role="status">
            <CheckCircle2 size={18} />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="error-message" role="alert">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        {/* Aggregate Ratings Overview */}
        <div className="reviews-overview-card">
          {/* Overall Rating & Star Distribution */}
          <div className="overall-score-box">
            <div className="score-headline">
              <span className="big-rating-number">{stats.averageRating > 0 ? stats.averageRating : '—'}</span>
              <div className="score-stars-col">
                <StarDisplay rating={stats.averageRating} size={20} />
                <span className="total-reviews-caption">
                  {stats.totalReviews > 0
                    ? `Based on ${stats.totalReviews} verified ${stats.totalReviews === 1 ? 'review' : 'reviews'}`
                    : 'No reviews yet'}
                </span>
              </div>
            </div>

            {/* Star Distribution Bars */}
            <div className="stars-distribution-list">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star]?.count || 0;
                const percent = distribution[star]?.percent || 0;
                return (
                  <div key={star} className="dist-row">
                    <span className="dist-star-label">{star} ★</span>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Quality Ratings Gauge Box */}
          <div className="quality-ratings-box">
            <h4 className="quality-box-title">
              <Sparkles size={16} /> {t('Workshop Quality Scores', 'गुणवत्ता विवरण')}
            </h4>
            <div className="quality-bars-list">
              {/* Material Quality */}
              <div className="quality-bar-item">
                <div className="quality-label-row">
                  <span>
                    <Hammer size={14} /> {t('Material Quality', 'मटेरियल क्वालिटी')}
                  </span>
                  <strong>{stats.materialQualityAvg > 0 ? `${stats.materialQualityAvg} / 5` : '—'}</strong>
                </div>
                <div className="quality-track">
                  <div
                    className="quality-fill fill-material"
                    style={{ width: `${(stats.materialQualityAvg / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Finishing Quality */}
              <div className="quality-bar-item">
                <div className="quality-label-row">
                  <span>
                    <Sparkles size={14} /> {t('Finishing Quality', 'फिनिशिंग क्वालिटी')}
                  </span>
                  <strong>{stats.finishingQualityAvg > 0 ? `${stats.finishingQualityAvg} / 5` : '—'}</strong>
                </div>
                <div className="quality-track">
                  <div
                    className="quality-fill fill-finishing"
                    style={{ width: `${(stats.finishingQualityAvg / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Design Quality */}
              <div className="quality-bar-item">
                <div className="quality-label-row">
                  <span>
                    <Palette size={14} /> {t('Design Quality', 'डिजाइन क्वालिटी')}
                  </span>
                  <strong>{stats.designQualityAvg > 0 ? `${stats.designQualityAvg} / 5` : '—'}</strong>
                </div>
                <div className="quality-track">
                  <div
                    className="quality-fill fill-design"
                    style={{ width: `${(stats.designQualityAvg / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Delivery Experience */}
              <div className="quality-bar-item">
                <div className="quality-label-row">
                  <span>
                    <Truck size={14} /> {t('Delivery Experience', 'डिलीवरी अनुभव')}
                  </span>
                  <strong>{stats.deliveryExperienceAvg > 0 ? `${stats.deliveryExperienceAvg} / 5` : '—'}</strong>
                </div>
                <div className="quality-track">
                  <div
                    className="quality-fill fill-delivery"
                    style={{ width: `${(stats.deliveryExperienceAvg / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. VERIFIED PURCHASER REVIEW ACTION BOX */}
        <div className="user-review-action-container">
          {!user ? (
            <div className="review-auth-prompt">
              <Lock size={18} />
              <div>
                <strong>Purchased this product? Log in to leave a review.</strong>
                <p>Only verified purchasers who ordered from Vishwakarma Workshop can review products.</p>
              </div>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In to Review
              </Link>
            </div>
          ) : !eligibility?.isPurchaser ? (
            <div className="review-purchaser-required-notice">
              <ShieldCheck size={20} className="shield-icon" />
              <div>
                <strong>{t('Verified Purchase Only', 'केवल खरीदे गए ग्राहक')}</strong>
                <p>
                  To keep workshop reviews authentic and helpful, reviews can only be submitted after purchasing this
                  product.
                </p>
              </div>
            </div>
          ) : (
            <div className="purchaser-review-panel">
              {eligibility.hasReviewed && !showReviewForm && (
                <div className="existing-review-callout">
                  <div className="callout-header">
                    <div>
                      <span className="callout-badge">
                        <CheckCircle2 size={14} /> You have reviewed this product
                      </span>
                      <h4>Your Rating: {eligibility.userReview?.rating} / 5 Stars</h4>
                    </div>
                    <div className="callout-buttons">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setIsEditing(true);
                          setShowReviewForm(true);
                        }}
                      >
                        <Edit3 size={14} /> Edit Review
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleDeleteReview}
                        disabled={formBusy}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <p className="callout-comment">"{eligibility.userReview?.comment}"</p>
                </div>
              )}

              {!eligibility.hasReviewed && !showReviewForm && (
                <div className="write-review-prompt">
                  <div>
                    <span className="verified-purchaser-pill">
                      <ShieldCheck size={14} /> Verified Buyer on Vishwakarma Workshop
                    </span>
                    <h4>How was your product and workshop craftsmanship?</h4>
                    <p>Share your experience to help other buyers make the right decision.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-gold"
                    onClick={() => {
                      setIsEditing(false);
                      setShowReviewForm(true);
                    }}
                  >
                    <MessageSquare size={16} /> Write a Review
                  </button>
                </div>
              )}

              {/* Review Form (Create or Edit) */}
              {showReviewForm && (
                <form className="product-review-form" onSubmit={handleReviewSubmit}>
                  <div className="form-header-bar">
                    <h3>{isEditing ? 'Edit Your Review' : 'Write a Product Review'}</h3>
                    <button
                      type="button"
                      className="form-close-link"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="form-intro-text">
                    Rate the overall product quality and your experience with our workshop:
                  </p>

                  {/* 1. Overall Rating */}
                  <StarRatingPicker
                    label={t('Overall Star Rating', 'कुल स्टार रेटिंग')}
                    sublabel="How would you rate this product overall?"
                    value={reviewForm.rating}
                    onChange={(val) => setReviewForm({ ...reviewForm, rating: val })}
                  />

                  {/* 2. Four Specific Quality Ratings */}
                  <div className="quality-pickers-container">
                    <span className="quality-pickers-legend">{t('Detailed Craftsmanship Ratings (4 Quality Metrics)', 'विस्तृत गुणवत्ता मानक (4 श्रेणियां)')}:</span>
                    <div className="quality-pickers-grid">
                      <StarRatingPicker
                        label={t('Material Quality', 'मटेरियल')}
                        sublabel="Steel/iron strength, gauge, durability"
                        value={reviewForm.materialQuality}
                        onChange={(val) => setReviewForm({ ...reviewForm, materialQuality: val })}
                      />
                      <StarRatingPicker
                        label={t('Finishing Quality', 'फिनिशिंग')}
                        sublabel="Welding joints, smoothness, paint finish"
                        value={reviewForm.finishingQuality}
                        onChange={(val) => setReviewForm({ ...reviewForm, finishingQuality: val })}
                      />
                      <StarRatingPicker
                        label={t('Design Quality', 'डिजाइन')}
                        sublabel="Patterns, aesthetics, accurate dimensions"
                        value={reviewForm.designQuality}
                        onChange={(val) => setReviewForm({ ...reviewForm, designQuality: val })}
                      />
                      <StarRatingPicker
                        label={t('Delivery Experience', 'डिलीवरी')}
                        sublabel="Packing, on-time delivery, safe handling"
                        value={reviewForm.deliveryExperience}
                        onChange={(val) => setReviewForm({ ...reviewForm, deliveryExperience: val })}
                      />
                    </div>
                  </div>

                  {/* Title & Comment */}
                  <div className="form-field-group">
                    <label>
                      {t('Review Headline / Title (Optional)', 'रिव्यू शीर्षक (वैकल्पिक)')}
                      <input
                        type="text"
                        maxLength={120}
                        placeholder="e.g. Robust steel gate, flawless finish and timely delivery!"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="form-field-group">
                    <label>
                      {t('Detailed Review', 'विस्तृत समीक्षा')} <span className="req">*</span>
                      <textarea
                        rows={4}
                        required
                        minLength={5}
                        maxLength={1500}
                        placeholder="Tell other customers about the material strength, finishing, workshop service, and your overall experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      />
                      <small className="char-count">{reviewForm.comment.length} / 1500 characters</small>
                    </label>
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="btn btn-gold" disabled={formBusy}>
                      {formBusy
                        ? 'Saving Review...'
                        : isEditing
                        ? t('Update Review', 'अपडेट करें')
                        : t('Submit Review', 'सबमिट करें')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowReviewForm(false)}
                      disabled={formBusy}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* 4. REVIEWS LIST & SORTING */}
        <div className="reviews-list-container">
          <div className="reviews-filter-bar">
            <h3>Customer Reviews ({reviewData.pagination?.total || 0})</h3>
            <div className="sort-control">
              <label htmlFor="review-sort-select">Sort by:</label>
              <select
                id="review-sort-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="latest">{t('Latest First', 'नवीनतम')}</option>
                <option value="highest">{t('Highest Rating', 'उच्चतम रेटिंग')}</option>
                <option value="lowest">{t('Lowest Rating', 'न्यूनतम रेटिंग')}</option>
                <option value="helpful">{t('Most Helpful', 'सर्वाधिक उपयोगी')}</option>
              </select>
            </div>
          </div>

          {reviewsLoading ? (
            <p className="loading-state">Loading reviews...</p>
          ) : reviewData.reviews.length === 0 ? (
            <div className="empty-reviews-state">
              <Star size={36} />
              <h4>No customer reviews yet</h4>
              <p>Be the first verified buyer to share feedback on this workshop product!</p>
            </div>
          ) : (
            <div className="customer-reviews-feed">
              {reviewData.reviews.map((rev) => (
                <article key={rev._id} className="customer-review-card">
                  <header className="review-user-header">
                    <div className="user-avatar-initial">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-header-info">
                      <div className="user-name-row">
                        <strong>{rev.userName}</strong>
                        {rev.isVerifiedPurchase && (
                          <span className="verified-chip">
                            <ShieldCheck size={13} /> Verified Buyer
                          </span>
                        )}
                        {rev.isOwnReview && (
                          <span className="own-review-chip">Your Review</span>
                        )}
                      </div>
                      <time className="review-date-text">{formatDate(rev.createdAt)}</time>
                    </div>
                  </header>

                  {/* Overall Star Rating */}
                  <div className="review-stars-strip">
                    <StarDisplay rating={rev.rating} size={16} />
                    <strong className="rating-number-badge">{rev.rating} / 5</strong>
                  </div>

                  {/* 4 Quality Sub-Scores Chips */}
                  <div className="review-subscores-strip">
                    <span className="subscore-chip">
                      <Hammer size={12} /> Material: <b>{rev.materialQuality || 5}★</b>
                    </span>
                    <span className="subscore-chip">
                      <Sparkles size={12} /> Finishing: <b>{rev.finishingQuality || 5}★</b>
                    </span>
                    <span className="subscore-chip">
                      <Palette size={12} /> Design: <b>{rev.designQuality || 5}★</b>
                    </span>
                    <span className="subscore-chip">
                      <Truck size={12} /> Delivery: <b>{rev.deliveryExperience || 5}★</b>
                    </span>
                  </div>

                  {/* Title & Comment */}
                  <div className="review-content-body">
                    {rev.title && <h5 className="review-headline">{rev.title}</h5>}
                    <p className="review-text">{rev.comment}</p>
                  </div>

                  {/* Footer with Helpful Button & Actions */}
                  <footer className="review-card-bottom">
                    <button
                      type="button"
                      className={`helpful-btn ${rev.hasVotedHelpful ? 'voted' : ''}`}
                      onClick={() => handleToggleHelpful(rev._id)}
                      title="Did you find this review helpful?"
                    >
                      <ThumbsUp size={14} fill={rev.hasVotedHelpful ? 'currentColor' : 'none'} />
                      <span>Helpful</span>
                      {rev.helpfulCount > 0 && <span className="helpful-num">({rev.helpfulCount})</span>}
                    </button>

                    {rev.isOwnReview && (
                      <div className="own-review-actions">
                        <button
                          type="button"
                          className="btn-link-action"
                          onClick={() => {
                            setIsEditing(true);
                            setShowReviewForm(true);
                            window.scrollTo({
                              top: document.querySelector('.user-review-action-container')?.offsetTop - 80 || 0,
                              behavior: 'smooth',
                            });
                          }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-link-action danger"
                          onClick={handleDeleteReview}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {reviewData.pagination?.pages > 1 && (
            <div className="reviews-pagination-row">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &larr; Previous
              </button>
              <span>
                Page {reviewData.pagination.page} of {reviewData.pagination.pages}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={page >= reviewData.pagination.pages}
                onClick={() => setPage((p) => Math.min(reviewData.pagination.pages, p + 1))}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Share Modal Dialog */}
      <ShareModal
        product={p}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShareSuccess={(newCount) => setP((prev) => ({ ...prev, shareCount: newCount }))}
      />
    </main>
  );
}
