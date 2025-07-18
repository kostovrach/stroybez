(function () {
	const sliderEl = document.querySelector(".fields-slider__slider");
	const sliderPagination = document.querySelector(".fields-slider__pagination");

	if (!sliderEl || !sliderPagination) return;

	const state = {
		isInViewport: false,
		scrollLocked: false,
		isCentering: false,
		startTouchY: null,
		mousewheelTemporarilyDisabled: false,
		isDestroyed: false,
		centeringTimeout: null,
		unlockTimeout: null,
		mousewheelEnableTimeout: null,
		observer: null,
		swiper: null,
        
		trackpadState: {
			lastWheelTime: 0,
			wheelDeltaSum: 0,
			wheelEventCount: 0,
			isTrackpadScrolling: false
		}
	};

	const CONSTANTS = {
		CENTERING_DURATION: 600,
		UNLOCK_DELAY: 400,
		MOUSEWHEEL_ENABLE_DELAY: 400,
		TOUCH_THRESHOLD: 10,
		OBSERVER_THRESHOLD: 0.5,
        
		TRACKPAD_DETECTION_TIME: 50,
		TRACKPAD_DELTA_THRESHOLD: 30,
		TRACKPAD_EVENT_COUNT_THRESHOLD: 3,
		TRACKPAD_SCROLL_THRESHOLD: 100
	};

	function initSwiper() {
		if (state.swiper) return state.swiper;

		try {
			state.swiper = new Swiper(sliderEl, {
				direction: "vertical",
				mousewheel: {
					enabled: true,
					forceToAxis: true,
					sensitivity: 1,
				},
				speed: 800,
				parallax: true,
				effect: "creative",
				creativeEffect: {
					next: {
						translate: [0, "150%", 0],
					},
					prev: {
						translate: [0, "-100%", 0],
					},
				},
				pagination: {
					el: sliderPagination,
					clickable: true,
				},
				on: {
					init: handleSwiperInit,
					slideChange: handleSlideChange,
					destroy: handleSwiperDestroy
				},
			});
			
			return state.swiper;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	function handleSwiperInit(swiper) {
		highlightActiveBullet(swiper);
	}

	function handleSlideChange(swiper) {
		if (!state.isDestroyed) {
			highlightActiveBullet(swiper);
		}
	}

	function handleSwiperDestroy() {
		state.isDestroyed = true;
	}

	function initObserver() {
		if (state.observer) return;

		state.observer = new IntersectionObserver(
			(entries) => {
				if (state.isDestroyed) return;

				entries.forEach((entry) => {
					const wasInViewport = state.isInViewport;
					state.isInViewport = entry.isIntersecting;

					if (wasInViewport === state.isInViewport) return;

					if (state.isInViewport) {
						handleEnterViewport();
					} else {
						handleExitViewport();
					}
				});
			},
			{
				root: null,
				threshold: CONSTANTS.OBSERVER_THRESHOLD,
			}
		);

		state.observer.observe(sliderEl);
	}

	function enableMousewheelWithDelay() {
		if (state.mousewheelEnableTimeout) {
			clearTimeout(state.mousewheelEnableTimeout);
		}

		state.mousewheelEnableTimeout = setTimeout(() => {
			if (state.swiper && state.mousewheelTemporarilyDisabled && !state.isDestroyed) {
				state.swiper.mousewheel.enable();
				state.mousewheelTemporarilyDisabled = false;
			}
			state.mousewheelEnableTimeout = null;
		}, CONSTANTS.MOUSEWHEEL_ENABLE_DELAY);
	}

	function handleEnterViewport() {
		centerSlider();
		
		if (state.mousewheelTemporarilyDisabled && state.swiper) {
			enableMousewheelWithDelay();
		}
		
		lockScroll();
	}

	function handleExitViewport() {
		unlockScroll();
	}

	function centerSlider() {
		if (state.isCentering || state.isDestroyed) return;
		
		state.isCentering = true;

		if (state.centeringTimeout) {
			clearTimeout(state.centeringTimeout);
		}

		try {
			sliderEl.scrollIntoView({ behavior: "smooth", block: "start" });
		} catch (error) {
			console.error(error);
		}

		state.centeringTimeout = setTimeout(() => {
			state.isCentering = false;
			state.centeringTimeout = null;
		}, CONSTANTS.CENTERING_DURATION);
	}

	function lockScroll() {
		if (state.scrollLocked || state.isDestroyed) return;
		
		try {
			document.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden";
			state.scrollLocked = true;
		} catch (error) {
			console.error(error);
		}
	}

	function unlockScroll() {
		if (!state.scrollLocked || state.isDestroyed) return;
		
		try {
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
			state.scrollLocked = false;
		} catch (error) {
			console.error(error);
		}
	}

	function scheduleUnlock() {
		if (state.unlockTimeout) {
			clearTimeout(state.unlockTimeout);
		}

		state.unlockTimeout = setTimeout(() => {
			unlockScroll();
			state.unlockTimeout = null;
		}, CONSTANTS.UNLOCK_DELAY);
	}

	function detectInputDevice(e) {
		const currentTime = Date.now();
		const deltaY = Math.abs(e.deltaY);
		
		if (currentTime - state.trackpadState.lastWheelTime > CONSTANTS.TRACKPAD_DETECTION_TIME) {
			state.trackpadState.wheelDeltaSum = 0;
			state.trackpadState.wheelEventCount = 0;
		}
		
		state.trackpadState.lastWheelTime = currentTime;
		state.trackpadState.wheelDeltaSum += deltaY;
		state.trackpadState.wheelEventCount++;
		
		const avgDelta = state.trackpadState.wheelDeltaSum / state.trackpadState.wheelEventCount;
		const isTrackpad = (
			state.trackpadState.wheelEventCount >= CONSTANTS.TRACKPAD_EVENT_COUNT_THRESHOLD &&
			avgDelta < CONSTANTS.TRACKPAD_DELTA_THRESHOLD
		);
		
		return {
			isTrackpad,
			avgDelta,
			eventCount: state.trackpadState.wheelEventCount
		};
	}

	function handleTrackpadExit(e, isFirst, isLast) {
		const inputDevice = detectInputDevice(e);
		
		if (!inputDevice.isTrackpad) return false;
		
		const shouldExit = (
			(isFirst && e.deltaY < 0 && Math.abs(e.deltaY) > CONSTANTS.TRACKPAD_SCROLL_THRESHOLD) ||
			(isLast && e.deltaY > 0 && Math.abs(e.deltaY) > CONSTANTS.TRACKPAD_SCROLL_THRESHOLD)
		);
		
		if (shouldExit) {
			state.trackpadState.isTrackpadScrolling = true;
			state.swiper.mousewheel.disable();
			state.mousewheelTemporarilyDisabled = true;
			scheduleUnlock();
			
			setTimeout(() => {
				state.trackpadState.isTrackpadScrolling = false;
				state.trackpadState.wheelDeltaSum = 0;
				state.trackpadState.wheelEventCount = 0;
			}, 200);
			
			return true;
		}
		
		return false;
	}

	function handleWheel(e) {
		if (!state.isInViewport || state.isDestroyed || !state.swiper) return;

		const isFirst = state.swiper.isBeginning;
		const isLast = state.swiper.isEnd;

		if (handleTrackpadExit(e, isFirst, isLast)) {
			return;
		}

		if ((isFirst && e.deltaY < 0) || (isLast && e.deltaY > 0)) {
			state.swiper.mousewheel.disable();
			state.mousewheelTemporarilyDisabled = true;
			scheduleUnlock();
			return;
		}

		e.preventDefault();
		lockScroll();
	}

	function handleTouchStart(e) {
		if (!state.isInViewport || state.isDestroyed || !e.touches || !e.touches[0]) return;
		state.startTouchY = e.touches[0].clientY;
	}

	function handleTouchMove(e) {
		if (!state.isInViewport || state.isDestroyed || state.startTouchY === null || !e.touches || !e.touches[0] || !state.swiper) return;

		const currentY = e.touches[0].clientY;
		const deltaY = currentY - state.startTouchY;

		const isFirst = state.swiper.isBeginning;
		const isLast = state.swiper.isEnd;

		if ((isFirst && deltaY > CONSTANTS.TOUCH_THRESHOLD) || (isLast && deltaY < -CONSTANTS.TOUCH_THRESHOLD)) {
			state.swiper.mousewheel.disable();
			state.mousewheelTemporarilyDisabled = true;
			scheduleUnlock();
			return;
		}

		e.preventDefault();
		lockScroll();
	}

	function handleTouchEnd() {
		state.startTouchY = null;
	}

	function highlightActiveBullet(swiper) {
		if (!sliderPagination || state.isDestroyed) return;

		try {
			const bullets = sliderPagination.querySelectorAll(".swiper-pagination-bullet");
			bullets.forEach((bullet) => bullet.classList.remove("is-active"));

			const activeBullet = sliderPagination.querySelector(".swiper-pagination-bullet-active");
			if (activeBullet) {
				activeBullet.classList.add("is-active");
			}
		} catch (error) {
			console.error(error);
		}
	}

	function cleanup() {
		state.isDestroyed = true;

		if (state.centeringTimeout) {
			clearTimeout(state.centeringTimeout);
			state.centeringTimeout = null;
		}

		if (state.unlockTimeout) {
			clearTimeout(state.unlockTimeout);
			state.unlockTimeout = null;
		}

		if (state.mousewheelEnableTimeout) {
			clearTimeout(state.mousewheelEnableTimeout);
			state.mousewheelEnableTimeout = null;
		}

		state.trackpadState = {
			lastWheelTime: 0,
			wheelDeltaSum: 0,
			wheelEventCount: 0,
			isTrackpadScrolling: false
		};

		if (state.observer) {
			state.observer.disconnect();
			state.observer = null;
		}

		window.removeEventListener("wheel", handleWheel);
		window.removeEventListener("touchstart", handleTouchStart);
		window.removeEventListener("touchmove", handleTouchMove);
		window.removeEventListener("touchend", handleTouchEnd);
		window.removeEventListener("beforeunload", cleanup);

		unlockScroll();

		if (state.swiper && typeof state.swiper.destroy === 'function') {
			try {
				state.swiper.destroy(true, true);
			} catch (error) {
				console.error(error);
			}
			state.swiper = null;
		}
	}

	function init() {
		const swiper = initSwiper();
		if (!swiper) return;

		initObserver();

		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("touchstart", handleTouchStart, { passive: true });
		window.addEventListener("touchmove", handleTouchMove, { passive: false });
		window.addEventListener("touchend", handleTouchEnd, { passive: true });
		window.addEventListener("beforeunload", cleanup);

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				window.addEventListener('pagehide', cleanup);
			});
		} else {
			window.addEventListener('pagehide', cleanup);
		}
	}

	init();
})();