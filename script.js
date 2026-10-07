// Little bits of behaviour for Jess's site.
// No frameworks, no build step. Just open index.html and go.

(function () {

  // Where inquiries get sent. Placeholder until the domain is set up.
  const INQUIRY_EMAIL = "hello@yourdomain.com";

  // Prices are written straight into index.html, so there's nothing to calculate here.

  // ─── Footer year + email ───
  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelectorAll(".js-email").forEach((a) => {
    a.href = "mailto:" + INQUIRY_EMAIL;
    a.textContent = INQUIRY_EMAIL;
  });

  const form = document.getElementById("inquiry-form");

  // ─── Sending the inquiry ───
  // There's no server here, so we open the visitor's email app with
  // everything filled in. If Jess later wants inquiries to land without an
  // email app (Formspree, Netlify Forms, etc.), this is the bit to swap.
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";

    const data = new FormData(form);

    // which required answers are missing, in the order they appear in the form
    const problems = [
      { field: "name", bad: !data.get("name"), say: "your name" },
      { field: "who", bad: !data.get("who"), say: "who's filling this out" },
      { field: "email", bad: !data.get("email") || !form.email.checkValidity(), say: "a valid email" },
      { field: "package", bad: !data.get("package"), say: "a package (\"Not sure yet\" is fine)" },
    ];

    // mark each field so screen readers and the red underline agree
    problems.forEach(({ field, bad }) => {
      if (field === "who") return; // radios share one name; the message covers them
      form[field].setAttribute("aria-invalid", bad ? "true" : "false");
    });

    const missing = problems.filter((p) => p.bad);
    if (missing.length) {
      status.textContent = "Please add " + missing.map((p) => p.say).join(", ") + ".";
      status.classList.add("is-error");
      // jump to the first thing that needs fixing
      const first = missing[0].field;
      (first === "who" ? form.querySelector('[name="who"]') : form[first]).focus();
      return;
    }

    const pkg = form.package.options[form.package.selectedIndex].textContent;
    const lines = [
      `Hi Jessie, I'm interested in postpartum support.`,
      ``,
      `Name: ${data.get("name")}`,
      `I'm: ${data.get("who")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      `Due date / baby's birthday: ${data.get("due") || "-"}`,
      `Package: ${pkg}`,
      `Prenatal planning visit: ${data.get("planning") ? "yes" : "no"}`,
      `Neighborhood: ${data.get("area") || "-"}`,
      ``,
      `Notes: ${data.get("notes") || "-"}`,
    ];

    const subject = `Inquiry · ${data.get("name")} · ${pkg}`;
    window.location.href =
      `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    // lots of phones have no mail app set up, so always show the address too
    status.innerHTML =
      `Your email app should open with your message. If it doesn't, email me at ` +
      `<a href="mailto:${INQUIRY_EMAIL}">${INQUIRY_EMAIL}</a>.`;
    status.classList.add("is-ok");
  });

})();
