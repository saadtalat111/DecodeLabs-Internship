/* =========================================================================
   DigitalCraft Studio — script.js
   Plain, vanilla JavaScript. No frameworks, no build step.
   Features:
     1. Hamburger menu toggle (open/close, closes on link click / outside click / Esc)
     2. Active nav link highlighting while scrolling (scroll-spy)
     3. Header shadow once the page has been scrolled
     4. Contact form validation with inline messages
     5. Project filter by technology tag
     6. Auto-updating footer year
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     1. HAMBURGER MENU
     --------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  var navLinks = document.querySelectorAll('[data-nav-link]');

  function openMenu() {
    primaryNav.classList.add('is-open');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    primaryNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function isMenuOpen() {
    return primaryNav.classList.contains('is-open');
  }

  navToggle.addEventListener('click', function () {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the mobile menu automatically once a nav link is clicked,
  // so the user lands on the section instead of staring at an open menu.
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isMenuOpen()) {
        closeMenu();
      }
    });
  });

  // Close the menu if the user clicks anywhere outside of it.
  document.addEventListener('click', function (event) {
    var clickedInsideNav = primaryNav.contains(event.target) || navToggle.contains(event.target);
    if (isMenuOpen() && !clickedInsideNav) {
      closeMenu();
    }
  });

  // Close the menu with the Escape key for keyboard users.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------------------------------------------------------------------
     2 & 3. SCROLL-SPY (active link) + HEADER SHADOW ON SCROLL
     --------------------------------------------------------------------- */
  var siteHeader = document.getElementById('siteHeader');
  var sections = document.querySelectorAll('main section[id]');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      // Only consider links that point to a section (#id), not the "Start a Project" CTA repeat
      var isSectionLink = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isSectionLink);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' } // triggers when a section crosses the vertical middle
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  window.addEventListener('scroll', function () {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  });

  /* ---------------------------------------------------------------------
     4. CONTACT FORM VALIDATION
     --------------------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  var fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: function (value) {
        return value.trim().length > 0 ? '' : 'Please enter your name.';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: function (value) {
        var trimmed = value.trim();
        if (trimmed.length === 0) {
          return 'Please enter your email address.';
        }
        // Simple, beginner-friendly check rather than a full regex: must contain
        // an "@" and a "." after it, which covers the brief's requirement.
        var atIndex = trimmed.indexOf('@');
        var dotIndex = trimmed.lastIndexOf('.');
        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === trimmed.length - 1) {
          return 'Please enter a valid email address (must include @ and .).';
        }
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: function (value) {
        return value.trim().length > 0 ? '' : 'Please enter a message.';
      }
    }
  };

  function showFieldError(field, message) {
    field.error.textContent = message;
    field.input.closest('.form-group').classList.add('has-error');
    field.input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(field) {
    field.error.textContent = '';
    field.input.closest('.form-group').classList.remove('has-error');
    field.input.removeAttribute('aria-invalid');
  }

  function validateField(key) {
    var field = fields[key];
    var message = field.validate(field.input.value);
    if (message) {
      showFieldError(field, message);
      return false;
    }
    clearFieldError(field);
    return true;
  }

  // Validate a field as soon as the user leaves it, so feedback is immediate
  // rather than only appearing after a failed submit.
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('blur', function () {
      validateField(key);
    });
  });

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault(); // this demo never sends data anywhere

    var isNameValid = validateField('name');
    var isEmailValid = validateField('email');
    var isMessageValid = validateField('message');
    var isFormValid = isNameValid && isEmailValid && isMessageValid;

    if (isFormValid) {
      formStatus.textContent = '✓ Message sent! We will be in touch soon.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      formStatus.className = 'form-status error';
    }
  });

  /* ---------------------------------------------------------------------
     5. PROJECT FILTER
     --------------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  var filterEmptyMessage = document.getElementById('filterEmpty');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filterValue = button.getAttribute('data-filter');

      // Update which button looks "active"
      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // Show only cards whose data-tags include the chosen filter
      var visibleCount = 0;
      projectCards.forEach(function (card) {
        var tags = card.getAttribute('data-tags');
        var matches = filterValue === 'all' || tags.indexOf(filterValue) !== -1;
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount++;
        }
      });

      filterEmptyMessage.hidden = visibleCount !== 0;
    });
  });

  /* ---------------------------------------------------------------------
     6. FOOTER YEAR
     --------------------------------------------------------------------- */
  var yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
