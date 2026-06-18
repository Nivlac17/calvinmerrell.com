// import { useEffect, useState } from 'react';
import './HomePage.css';

export default function HomePage() {


  const lastUpdated = import.meta.env.VITE_BUILD_DATE;

<p>Last updated: {lastUpdated}</p>

  return (
    <>
      <div className="video-container">
        <video autoPlay muted loop id="bg-video">
          <source src="/images/215484_medium.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <header>
        <h1>Calvin W. Merrell</h1>
        <p>{lastUpdated}</p>
      </header>

      <section className="main-feature">
        <h2>Articles</h2>
        <p>
          This is the main feature section of the website, where we highlight
          the most important content or feature.
        </p>
      </section>

      <section className="articles">
        <h2>Latest Articles</h2>

        <div className="article-grid">
          <div className="article-card">
            <img
              src="/images/technology-1283624_1920.jpg"
              alt="Code Experience"
            />
            <h3>Code Experience</h3>
            <p>Short description of the article content.</p>
          </div>

          <div className="article-card">
            <img
              src="/images/man-1866784_1920.jpg"
              alt="Work Experience"
            />
            <h3>Work Experience</h3>
            <p>Short description of the article content.</p>
          </div>

          <div className="article-card">
            <img src="/images/library.jpg" alt="Education" />
            <h3>Education</h3>
            <p>Short description of the article content.</p>
          </div>
        </div>
      </section>
    </>
  );
}