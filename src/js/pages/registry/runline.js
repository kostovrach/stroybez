(function () {
	const runline = document.querySelector(".registry-hero__runline");

	if (!runline) return;

	const runlineInner = runline.querySelector(".registry-hero__runline-inner");

	const content = runlineInner.textContent;

	const clone = document.createElement("div");
	clone.className = "registry-hero__runline-inner registry-hero__runline-inner--clone";
    clone.innerHTML = content;
    runline.appendChild(clone);
})();
