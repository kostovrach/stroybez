(function () {
	const slider = document.querySelector(".index-hero__slider");

	if (!slider) return;

	const sliderParams = {
		slidesPerView: 1,
        parallax: true,
        speed: 800,
		allowTouchMove: false,
		simulateTouch: false,
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
		pagination: {
			type: 'fraction',
			el: ".index-hero__slider-pagination",
			totalClass: "index-hero__slider-pagination-total",
			currentClass: "index-hero__slider-pagination-current",
			renderFraction: function (currentClass, totalClass) {
				return `<span>0<span class="${currentClass}"></span></span>
						<span class="index-hero__slider-pagination-separator">/</span>
						<span>0<span class="${totalClass}"></span></span>`
			},
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
