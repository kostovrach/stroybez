(function () {
	if (!document.getElementById("contacts-map")) return;

	ymaps.ready(() => {
		const map = new ymaps.Map("contacts-map", {
			center: [55.737360, 37.590497],
			zoom: 18,
			controls: ["zoomControl"],
		});

		map.behaviors.disable("scrollZoom");

		const placemark = new ymaps.Placemark([55.737360, 37.590497]);

		map.geoObjects.add(placemark);
	});
})();
