const consentKit = (settings) => {
  window.addEventListener("load", () => {
    // DOM elements
    const consent_banner = document.getElementById("consent_banner");
    const consent_curtain = document.getElementById("consent_curtain");
    const consent_settings = document.getElementById("consent_settings");
    const consent_all = document.getElementById("consent_agree");
    const consent_update = document.getElementById("cookies_update");

    // Global cookie_consented variable
    let cookie_consented = [];

    // Function to set a cookie
    // Create cookie
    const setCookie = () => {
      let expires;

      let date = new Date();
      date.setTime(date.getTime() + settings.expiry_days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
      document.cookie =
        settings.cookie_name + "=" + cookie_consented + expires + "; path=/";

      // Close the curtain and consent banner.
      consent_banner.classList.add("hidden");
      consent_curtain.classList.add("hidden");
    };

    // Function to agree all cookies.
    const agreeAll = () => {
      // Loop through all cookie options
      document
        .querySelectorAll(".cookie_switch .switch")
        .forEach((cookie_switch) => {
          cookie_consented.push(
            cookie_switch.querySelector("input").name.substring(7)
          );
        });
      setCookie();
    };

    // Function to get a specific cookie.
    const getCookie = (cname) => {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    };

    // Function to check if a cookie exists
    const consentBanner = () => {
      let consent = getCookie(settings.cookie_name);
      if (consent !== "") {
      } else {
        showBanner();
      }
    };

    const showBanner = () => {
      consent_banner.classList.remove("hidden");
    };

    const switchCookie = (e) => {
      let input = e.currentTarget.querySelector("input");
      let display =
        e.currentTarget.parentElement.querySelector(".cookie_display");
      if (input.checked) {
        display.classList.add("enabled");
        cookie_consented.push(input.name.substring(7));
      } else {
        display.classList.remove("enabled");
        cookie_consented = cookie_consented.filter(
          (cookie) => cookie !== input.name.substring(7)
        );
      }
    };

    updateConsent = () => {
      // Always add essential cookies
      cookie_consented.push("essential");
      // Call the update of the cookies.
      setCookie();
    };

    const closeCurtain = () => {
      consent_curtain.classList.add("hidden");
    };

    const showCurtain = () => {
      consent_curtain.classList.remove("hidden");

      // If the close icon exists, add it's event listener.
      let close_link = document.getElementById("curtain_close")
      if(close_link) close_link.addEventListener("click", closeCurtain);


      // Add event listeners on all non-locked switches.
      document
        .querySelectorAll(".cookie_switch .switch")
        .forEach((cookie_switch) => {
          if (!cookie_switch.classList.contains("locked"))
            cookie_switch.addEventListener("click", switchCookie);
        });

      // Add event listener to the update button and set a cookie.
      consent_update.addEventListener("click", updateConsent);
    };

    const switchTab = (e) => {
      let page = e.currentTarget.dataset.page;

      // Unset all tab indicators
      document.querySelectorAll(".cookies .filters > li").forEach((tab) => {
        tab.firstChild.classList.remove("active");
      });

      // Highlight the new tab
      e.currentTarget.classList.add("active");

      // Hide all pages
      document
        .querySelectorAll(".cookies .cookie_content .cookie")
        .forEach((page) => {
          page.classList.remove("active");
        });

      // Highlight the new page
      document
        .querySelector(`.cookies .cookie_content .cookie[data-page="${page}"]`)
        .classList.add("active");

      // Scroll back to the top of the cookie details
      document.querySelector(".cookies .cookie_content").scrollTop = 0;
    };

    // Listen for clicks on the settings and agree buttons.
    consent_settings.addEventListener("click", showCurtain);
    consent_all.addEventListener("click", agreeAll);

    // Add event listeners on all the tabs
    document.querySelectorAll(".cookies .filters > li").forEach((tab) => {
      tab.firstChild.addEventListener("click", switchTab);
    });

    consentBanner();
  });
};
