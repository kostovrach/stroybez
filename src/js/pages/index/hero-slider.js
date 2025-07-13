(function () {
	const slider = document.querySelector(".index-hero__slider");

	if (!slider) return;

	const sliderParams = {
		slidesPerView: 1,
        parallax: true,
        speed: 800,
		effect: "creative",
		creativeEffect: {
			next: {
				opacity: 0,
			},
			prev: {
				opacity: 0,
			},
		},
		navigation: {
			prevEl: ".index-hero__slider-button--prev",
			nextEl: ".index-hero__slider-button--next",
		},
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        autoplay: {
            enabled: true,
            delay: 5000,
            pauseOnMouseEnter: true,
        }
	};

	new Swiper(slider, sliderParams);
})();
