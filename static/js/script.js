/* =================================================
   J² ProcessWorks – Main Scripts
   Author: Asim Mandal
   Description: Smooth scrolling, intersection reveal,
                nav active state, count‑up numbers,
                accordion & AJAX form handling.
================================================= */
(() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => scope.querySelectorAll(selector);

  /* ---------- Smooth Scroll ---------- */
  $$("a[href^='#']").forEach(link => {
    link.addEventListener('click', e => {
      const targetID = link.getAttribute('href');
      if (targetID.startsWith('#') && $(targetID)) {
        e.preventDefault();
        $(targetID).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active Nav Highlight ---------- */
  const sections = $$('section[id]');
  const navLinks = $$('nav ul li a');
  const setActiveNav = () => {
    const scrollPos = window.scrollY + 80;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = $(`nav ul li a[href='#${sec.id}']`);
        if (active) active.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  /* ---------- Intersection Reveal ---------- */
  const revealEls = $$('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  /* ---------- Count‑Up Stats ---------- */
  const counters = $$('.count');
  const runCounter = el => {
    const update = () => {
      const target = +el.dataset.target;
      const current = +el.innerText;
      const increment = Math.ceil(target / 100);
      if (current < target) {
        el.innerText = current + increment;
        requestAnimationFrame(update);
      } else {
        el.innerText = target;
      }
    };
    update();
  };
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Accordion (Careers) ---------- */
  const accordions = $$('.accordion-header');
  accordions.forEach(header => header.addEventListener('click', () => {
    const item = header.parentElement;
    const content = $('.accordion-content', item);
    const icon = $('i', header);
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.classList.remove('open');
      icon.style.transform = 'rotate(0)';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.classList.add('open');
      icon.style.transform = 'rotate(180deg)';
    }
  }));

  /* ---------- AJAX Form Submit (Contact & Apply) ---------- */
  function handleAjax(form, endpoint) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: fd,
        });
        const json = await res.json();
        alert(json.msg); // replace with toast or snackbar in future
        if (json.ok) form.reset();
      } catch (err) {
        console.error('Form submission failed:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = $('#contactForm');
    const applyForm = $('#applyForm');
    if (contactForm) handleAjax(contactForm, '/contact');
    if (applyForm) handleAjax(applyForm, '/apply');
  });

  /* ---------- Footer Year ---------- */
  const yearSpan = $('#year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
})();
