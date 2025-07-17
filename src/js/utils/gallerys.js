(function () {
	function initGallery(galleryName) {
		Fancybox.bind(`[data-fancybox="${galleryName}"]`, {
			Toolbar: false,
			Carousel: {
				infinite: false,
			},
			Video: {
				autoplay: false,
			},
		});
	}

	initGallery("index-awards");
	initGallery("index-supports");
	
	initGallery("docs-thank-you");
	initGallery("docs-docs");
	initGallery("docs-reports");
	initGallery("docs-claims");
	initGallery("docs-awards");
	initGallery("docs-protocols");
	initGallery("docs-checks");
	initGallery("docs-standarts");
	initGallery("docs-other");
})();
