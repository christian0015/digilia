import React, { useState, useEffect, useRef  } from 'react';
import './ComponentTemoignage.css';
import AOS from 'aos'; // Importation AOS

const reviews = [
  { name: "Jack", username: "@jack", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/jack" },
  { name: "Jill", username: "@jill", body: "I don't know what to say. I'm speechless. This is amazing.", img: "https://avatar.vercel.sh/jill" },
  { name: "John", username: "@john", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/john" },
  { name: "Jane", username: "@jane", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jane" },
  { name: "Jenny", username: "@jenny", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jenny" },
  { name: "James", username: "@james", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/james" },
];

const ReviewCard = ({ img, name, username, body }) => {
    useEffect(() => {
        AOS.init();
      }, []);
  return (
    <div className="review-card" data-aos="fade-up" data-aos-duration="1000">
      <img src={img} alt={`${name}'s avatar`} className="review-avatar" />
      <h3 className="review-name">{name}</h3>
      <p className="review-username">{username}</p>
      <p className="review-body">{body}</p>
    </div>
  );
};

const ComponentTemoignage = () => {
  return (
    <section className="testimonials">
      <h2>Témoignages</h2>
      <div className="testimonials-list">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            img={review.img}
            name={review.name}
            username={review.username}
            body={review.body}
          />
        ))}
      </div>
    </section>
  );
};

export default ComponentTemoignage;
