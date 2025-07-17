(function () {
	const filterToggle = document.querySelector("[data-filter-toggle]");
	const filterValue = document.querySelector("[data-filter-value]");
	const filterItems = document.querySelectorAll("[data-filter]");
	const sortContainer = document.querySelector("[data-sort-container]");

	function sortElements(order) {
		const items = Array.from(document.querySelectorAll("[data-sortable-item]"));

		items.sort((a, b) => {
			const titleA = a.querySelector("[data-sort]");
			const titleB = b.querySelector("[data-sort]");

			if (!titleA || !titleB) return 0;

			const textA = titleA.getAttribute("data-sort").toLowerCase();
			const textB = titleB.getAttribute("data-sort").toLowerCase();

			const comparison = textA.localeCompare(textB, "ru");

			return order === "asc" ? comparison : -comparison;
		});

		items.forEach((item) => {
			sortContainer.appendChild(item);
		});
	}

	if (filterToggle) {
		filterToggle.addEventListener("click", function (e) {
			e.stopPropagation();
			filterToggle.classList.toggle("active");
		});
	}

	filterItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.stopPropagation();

			const filterOrder = this.getAttribute("data-filter");
			const filterText = this.textContent.trim();

			if (filterValue) {
				filterValue.textContent = filterText;
			}

			if (filterToggle) {
				filterToggle.classList.remove("active");
			}

			sortElements(filterOrder);
		});
	});

	document.addEventListener("click", function () {
		if (filterToggle) {
			filterToggle.classList.remove("active");
		}
	});

	function fillSortAttributes() {
		const sortElements = document.querySelectorAll('[data-sort=""]');

		sortElements.forEach((element) => {
			const textContent = element.textContent.trim();

			const hasRussianChars = /[а-яё]/i.test(textContent);

			if (hasRussianChars && textContent) {
				element.setAttribute("data-sort", textContent);
			} else {
				element.removeAttribute("data-sort");
			}
		});
	}

	function init() {
		fillSortAttributes();

		const defaultFilter = document.querySelector('[data-filter="asc"]');
		if (defaultFilter && filterValue) {
			filterValue.textContent = defaultFilter.textContent.trim();
			sortElements("asc");
		}
	}

	init();
})();
