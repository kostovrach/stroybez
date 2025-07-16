(function () {
	const slider = document.querySelector(".news-slider__slider");

	if (!slider) return;

	const sliderParams = {
		spaceBetween: 16,
		speed: 600,
		mousewheel: {
			forceToAxis: true,
		},
		navigation: {
			prevEl: ".news-slider__nav-button--prev",
			nextEl: ".news-slider__nav-button--next",
		},
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},
		},
	};

	new Swiper(slider, sliderParams);
})();
