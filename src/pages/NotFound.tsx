import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <section className="not-found">
      <div className="not-found-card">
        <h1>404</h1>
        <p>We couldn’t find that page.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
