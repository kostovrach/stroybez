(function () {
	const slider = document.querySelector(".registry-hero__slider");

	if (!slider) return;

	const sliderParams = {
		spaceBetween: 24,
		slidesPerView: "auto",
        speed: 800,
        mousewheel: {
            forceToAxis: true,
        },
		navigation: {
			prevEl: ".registry-hero__button--prev",
			nextEl: ".registry-hero__button--next",
		},
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
	};

	new Swiper(slider, sliderParams);
})();
