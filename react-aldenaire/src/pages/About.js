import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-content">
          <div className="about-text">
            <h1>About Aldenaire Kitchen</h1>
            <p>
              Welcome to Aldenaire Kitchen, where passion meets flavor and tradition 
              meets innovation. Our journey began with a simple vision: to create 
              exceptional dining experiences that nourish both body and soul.
            </p>
            <p>
              We believe that great food starts with the finest ingredients. That's 
              why we source only the freshest, highest-quality produce, meats, and 
              seafood from local suppliers and trusted partners. Our commitment to 
              quality extends to every aspect of our operation, from our kitchen 
              to your table.
            </p>
            <p>
              Our talented team of chefs brings together diverse culinary traditions 
              and modern techniques to create dishes that are both familiar and 
              exciting. Whether you're craving a comforting classic or eager to 
              try something new, our menu offers something for every palate and 
              dietary preference.
            </p>
            <p>
              At Aldenaire Kitchen, we're not just serving food – we're creating 
              memories. Every meal is an opportunity to bring people together, 
              celebrate life's moments, and enjoy the simple pleasure of great 
              food in good company.
            </p>
          </div>
          <div className="about-image">
            <img src="http://localhost/Final_project/assets/images/about.jpg" alt="About Aldenaire Kitchen" />
          </div>
        </div>
      </section>

      <section className="about-features">
        <div className="feature">
          <h3>Fresh Ingredients</h3>
          <p>We use only the freshest, locally-sourced ingredients in all our dishes.</p>
        </div>
        <div className="feature">
          <h3>Expert Chefs</h3>
          <p>Our experienced chefs bring creativity and skill to every dish they prepare.</p>
        </div>
        <div className="feature">
          <h3>Quality Service</h3>
          <p>We're committed to providing exceptional service and memorable dining experiences.</p>
        </div>
      </section>
    </div>
  );
};

export default About; 