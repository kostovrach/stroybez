(function () {
	const timelineBlock = document.querySelectorAll(".timeline-list");

	if (!timelineBlock.length) return;

	timelineBlock.forEach((block) => {
		const items = block.querySelectorAll(".timeline-list__item");

		document.addEventListener("scroll", () => {
			items.forEach((el) => {
				const itemImage = el.querySelector(".timeline-list__item-image-container");

				const rectY = el.getBoundingClientRect();
				const rectHeight = el.getBoundingClientRect();

				const position = rectY.top * -1;
				const size = rectHeight.height;
				itemImage.style.top = `${position + size}px`;
			});
		});
	});
})();
