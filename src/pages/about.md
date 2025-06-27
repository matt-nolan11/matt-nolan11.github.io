---
title: About
cover: '../assets/about.png'
layout: '../layouts/Markdown.astro'
---

Stargarden is a markdown-first Astro theme designed for simplicity and ease of use. It’s built for quick, clean markdown publishing—ideal for personal blogs, documentation, or straightforward content sites.

## Built with Tailwind CSS & DaisyUI
Stargarden was built with Tailwind CSS and DaisyUI, making customization simple and practical. DaisyUI's theming ensures your site looks good without extra effort.

## Simple and Effective
The core idea is to keep things minimal and markdown-friendly. Future updates may include convenient features like built-in search and flexible content types, always keeping complexity low.

## Make it Your Own
Feel free to personalize Stargarden to fit your style and content. This theme is here as a starting point—make it uniquely yours.

## Contact Me

If you'd like to get in touch, please use the form below:

<div id="contact-form-root" class="max-w-lg mx-auto mt-8">
  <form
    id="contact-form"
    action="https://formspree.io/f/xjkrjkrp"
    method="POST"
    class="bg-base-200 rounded-box shadow-lg flex flex-col gap-6 p-6"
    autocomplete="off"
  >
    <div class="form-control w-full">
      <label for="name" class="label">
        <span class="label-text font-semibold">Name</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        class="input input-bordered w-full"
        required
        autocomplete="name"
      />
    </div>
    <div class="form-control w-full">
      <label for="email" class="label">
        <span class="label-text font-semibold">Email</span>
      </label>
      <input
        type="email"
        id="email"
        name="email"
        class="input input-bordered w-full"
        required
        autocomplete="email"
      />
    </div>
    <div class="form-control w-full">
      <label for="message" class="label">
        <span class="label-text font-semibold">Message</span>
      </label>
      <textarea
        id="message"
        name="message"
        class="textarea textarea-bordered w-full"
        rows="5"
        required
      ></textarea>
    </div>
    <button type="submit" class="btn btn-primary w-full mt-2">Send Message</button>
    <div id="form-status" class="text-success text-center mt-2 hidden"></div>
  </form>
</div>

<script>
// Accessible AJAX Formspree handler for in-page confirmation
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (form && status) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        status.classList.add('hidden');
        const data = new FormData(form);
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' },
          });
          if (res.ok) {
            form.reset();
            status.textContent = 'Thank you! Your message has been sent.';
            status.classList.remove('hidden');
            status.classList.add('text-success');
          } else {
            status.textContent = 'Sorry, there was a problem. Please try again later.';
            status.classList.remove('hidden');
            status.classList.add('text-error');
          }
        } catch {
          status.textContent = 'Sorry, there was a problem. Please try again later.';
          status.classList.remove('hidden');
          status.classList.add('text-error');
        }
      });
    }
  });
}
</script>

<!--
  To activate this form:
  1. Go to https://formspree.io/ and create a free account.
  2. Create a new form and copy your unique endpoint (replace 'your-form-id' above).
  3. Optionally, set up email notifications and spam protection in your Formspree dashboard.
-->
