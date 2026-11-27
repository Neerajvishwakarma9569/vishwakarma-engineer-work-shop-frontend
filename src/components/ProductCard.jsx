import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingCart, ArrowUpRight, Star, Share2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import ShareModal from "./ShareModal";
import './Css/ProductCard.css';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/products/${product._id}`);
  };

  return (
    <>
      <article className="product-card">
        <Link to={`/products/${product._id}`} className="product-image">
          <img src={product.image} alt={product.name} />
          {product.featured && <span className="tag">Featured</span>}
        </Link>
        <div className="product-info">
          <div className="product-card-title-row">
            <span className="eyebrow">{product.category}</span>
            <div className="product-card-badges-row">
              {product.shareCount > 0 && (
                <span className="product-card-share-badge" title="Times shared">
                  <Share2 size={11} /> {product.shareCount}
                </span>
              )}
              {product.reviewCount > 0 && (
                <span className="product-card-rating">
                  <Star size={12} className="star-gold" fill="currentColor" />
                  <strong>{product.averageRating}</strong>
                  <small>({product.reviewCount})</small>
                </span>
              )}
            </div>
          </div>
          <h3>
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </h3>
          <p>{product.description}</p>
          {(product.heightCm || product.widthCm) && (
            <p className="product-card-dimensions">
              {product.heightCm ? `Height: ${product.heightCm} cm` : ""}
              {product.heightCm && product.widthCm ? " · " : ""}
              {product.widthCm ? `Width: ${product.widthCm} cm` : ""}
            </p>
          )}
          <div className="product-bottom">
            <strong>
              {product.price > 0
                ? `₹${Number(product.price).toLocaleString("en-IN")}`
                : "Get a quote"}
            </strong>
            <div className="product-card-actions">
              <button
                type="button"
                className="round-btn share-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowShareModal(true);
                }}
                aria-label="Share product"
                title="Share this product"
              >
                <Share2 size={16} />
              </button>
              <button
                className="round-btn"
                onClick={() => add(product)}
                aria-label="Add to cart"
                title="Add to cart"
              >
                <ShoppingCart size={17} />
              </button>
              <Link
                className="round-btn light"
                to={`/products/${product._id}`}
                aria-label="View product"
                title="View product details"
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          {Number(product.price) > 0 ? (
            <button type="button" className="product-buy-button" onClick={handleViewDetails}>
              View Details <ArrowRight size={16} />
            </button>
          ) : (
            <Link className="product-buy-button product-quote-button" to={`/products/${product._id}`}>
              Request a quote <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </article>

      {/* Share Modal Dialog */}
      <ShareModal
        product={product}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}
