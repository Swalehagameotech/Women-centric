import LegalPage from '../components/LegalPage';

function ShippingReturns() {
  return (
    <LegalPage title="Shipping & Returns">
      <p>
        <strong className="text-black">Shipping</strong> — We dispatch most orders within 2–4
        business days after payment confirmation. Delivery typically takes 5–10 business days
        across India, depending on your location and courier availability. You will receive tracking
        details by email or SMS once your order ships.
      </p>
      <p>
        Shipping charges, if any, are shown at checkout before you complete your purchase. Free
        shipping may apply on orders above the minimum value displayed on our site during promotions.
      </p>
      <p>
        <strong className="text-black">Returns</strong> — If you receive a damaged, defective, or
        incorrect item, please contact us within 48 hours of delivery with photos of the product and
        packaging. We will arrange a replacement or refund after verification.
      </p>
      <p>
        For size or style exchanges, unused items with original tags and packaging may be returned
        within 7 days of delivery. Intimate apparel, beauty products, and sale items marked
        non-returnable are excluded unless faulty.
      </p>
      <p>
        Refunds are processed to your original payment method within 7–10 business days after we
        receive and inspect the returned item. For help, email hello@stylebyher.com or call +91 98765
        43210.
      </p>
    </LegalPage>
  );
}

export default ShippingReturns;
