(function () {
	const wrapper = document.querySelector(".partners-slider__wrapper");
	const sliderEl = document.querySelector(".partners-slider");

	if (!wrapper || !sliderEl) return;

	function duplicateSlides(swiper) {
		const originalSlides = Array.from(wrapper.querySelectorAll(".partners-slider__slide"));
		const slideTotalWidth = originalSlides.reduce((sum, slide) => {
			return sum + slide.offsetWidth;
		}, 0);

		const targetWidth = window.innerWidth * 2.5;
		let currentWidth = slideTotalWidth;

		while (currentWidth < targetWidth) {
			originalSlides.forEach((slide) => {
				const clone = slide.cloneNode(true);
				clone.classList.add("partners-slider__slide--duplicate");
				wrapper.appendChild(clone);
				currentWidth += slide.offsetWidth;
			});
		}

		swiper.update();
	}

	const clientsSliderParams = {
		spaceBetween: 16,
		slidesPerView: "auto",
		allowTouchMove: false,
		simulateTouch: false,
		waitForTransition: false,
		loop: true,
		speed: 8000,
		autoplay: {
			delay: 1,
			disableOnInteraction: false,
		},
		on: {
			init(swiper) {
				duplicateSlides(swiper);
			}
		}
	};

	new Swiper(sliderEl, clientsSliderParams);
})();
