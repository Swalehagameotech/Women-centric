import LegalPage from '../components/LegalPage';

function TermsAndConditions() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        By using the Style By Her website, you agree to these terms. Please read
        them carefully before placing an order.
      </p>
      <p>
        All products are subject to availability. We reserve the right to limit quantities, refuse
        orders, or cancel orders in cases of pricing errors, suspected fraud, or stock issues. Prices
        are listed in INR and include applicable taxes unless stated otherwise.
      </p>
      <p>
        Product images and descriptions are provided for reference. Minor variations in colour or
        finish may occur due to screen settings or manufacturing batches.
      </p>
      <p>
        You are responsible for providing accurate delivery details. Risk of loss passes to you once
        the order is handed to our courier partner. Our liability is limited to the value of the
        products purchased, except where prohibited by law.
      </p>
      <p>
        These terms are governed by the laws of India. For questions, contact hello@stylebyher.com.
      </p>
    </LegalPage>
  );
}

export default TermsAndConditions;
