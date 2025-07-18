(function () {
	const wrapper = document.querySelector(".partners-slider__wrapper");
	const sliderEl = document.querySelector(".partners-slider");

	if (!wrapper || !sliderEl) return;

	let swiper = null;
	let isInitialized = false;

	function setupViewportAutoplay(swiper, targetEl) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						swiper.autoplay.start();
					} else {
						swiper.autoplay.stop();
					}
				});
			},
			{
				root: null,
				threshold: 0.1,
			}
		);

		observer.observe(targetEl);
		return observer;
	}

	function duplicateSlides() {
		wrapper.querySelectorAll(".partners-slider__slide--duplicate").forEach((slide) => slide.remove());

		const originalSlides = Array.from(wrapper.querySelectorAll(".partners-slider__slide:not(.partners-slider__slide--duplicate)"));

		if (originalSlides.length === 0) return;

		const slideTotalWidth = originalSlides.reduce((sum, slide) => {
			return sum + slide.offsetWidth + 16;
		}, 0);

		const targetWidth = window.innerWidth * 3;
		let currentWidth = slideTotalWidth;

		while (currentWidth < targetWidth) {
			originalSlides.forEach((slide) => {
				const clone = slide.cloneNode(true);
				clone.classList.add("partners-slider__slide--duplicate");
				wrapper.appendChild(clone);
				currentWidth += slide.offsetWidth + 16;
			});
		}
	}

	function initializeSwiper() {
		if (swiper) {
			swiper.destroy(true, true);
		}

		duplicateSlides();

		const clientsSliderParams = {
			spaceBetween: 8,
			slidesPerView: "auto",
			allowTouchMove: false,
			simulateTouch: false,
			waitForTransition: false,
			loop: true,
			speed: 8000,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
				pauseOnMouseEnter: false,
				reverseDirection: false,
			},
			freeMode: {
				enabled: true,
				momentum: false,
			},
			breakpoints: {
				540: {
					spaceBetween: 16,
				},
			},
			on: {
				init(swiperInstance) {
					isInitialized = true;
				},
				slideChange(swiperInstance) {},
			},
		};

		swiper = new Swiper(sliderEl, clientsSliderParams);

		const observer = setupViewportAutoplay(swiper, sliderEl);

		return { swiper, observer };
	}

	let observer = null;
	const { swiper: swiperInstance, observer: intersectionObserver } = initializeSwiper();
	observer = intersectionObserver;

	let resizeTimeout;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			if (swiperInstance) {
				duplicateSlides();
				swiperInstance.update();
			}
		}, 300);
	});

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden && swiperInstance && swiperInstance.autoplay) {
			const rect = sliderEl.getBoundingClientRect();
			const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

			if (isVisible) {
				setTimeout(() => {
					swiperInstance.autoplay.start();
				}, 100);
			}
		}
	});

	window.addEventListener("beforeunload", () => {
		if (observer) {
			observer.disconnect();
		}
	});
})();
