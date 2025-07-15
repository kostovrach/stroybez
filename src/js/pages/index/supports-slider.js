(function () {
	const slider = document.querySelector(".index-supports__slider");

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
			prevEl: ".index-supports__navigation-button--prev",
			nextEl: ".index-supports__navigation-button--next",
		},
		pagination: {
			type: 'fraction',
			el: ".index-supports__controls-pagination",
			totalClass: "index-supports__controls-pagination-total",
			currentClass: "index-supports__controls-pagination-current",
			renderFraction: function (currentClass, totalClass) {
				return `<span>0<span class="${currentClass}"></span></span>
						<span class="index-supports__controls-pagination-separator">/</span>
						<span>0<span class="${totalClass}"></span></span>
                `
			},
		},
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
	};

	new Swiper(slider, sliderParams);
})();
