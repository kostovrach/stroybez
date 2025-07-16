(function () {
	const header = document.querySelector(".header");
    const indexLogo = document.querySelector(".index-hero__title")

	if (!header || !indexLogo) return;

	window.addEventListener("scroll", () => {
		const isStickyMode = window.scrollY > 10 && header.classList.contains("no-logo");

		header.classList.toggle("scroll", isStickyMode);
		indexLogo.classList.toggle("scroll", isStickyMode);
	});

})();
