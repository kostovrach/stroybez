(function () {
	const timelineBlock = document.querySelector(".index-feedback__list");

	if (!timelineBlock) return;

	const timelineItems = timelineBlock.querySelectorAll(".index-feedback__item");

	document.addEventListener("scroll", () => {
		timelineItems.forEach((el) => {
			const timelineImage = el.querySelector(".index-feedback__item-image-container");

			const rectY = el.getBoundingClientRect();
			const rectHeight = el.getBoundingClientRect();

			const position = rectY.top * -1;
			const size = rectHeight.height;
			timelineImage.style.top = `${position + size}px`;
		});
	});
})();
