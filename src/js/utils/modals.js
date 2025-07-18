(function () {
	let scrollPosition = 0;
	const ANIM_CLASS = 'anim';

	function handleScrollReturn() {
		document.body.classList.remove("lock");
		document.body.style.removeProperty("top");
		document.body.style.removeProperty("position");
		document.body.style.removeProperty("width");
		window.scrollTo(0, scrollPosition);
	}

	function handleScrollBlock() {
		scrollPosition = window.pageYOffset;
		document.body.classList.add("lock");
		document.body.style.position = "fixed";
		document.body.style.width = "100vw";
		document.body.style.top = `-${scrollPosition}px`;
	}

	function closeModalWithAnimation(modal) {
		modal.classList.remove(ANIM_CLASS);
		setTimeout(() => {
			modal.close();
			handleScrollReturn();
		}, 500);
	}

	function initModal(modalId, dataAttr, closeBtnAttr) {
		const modal = document.querySelector(modalId);
		const openBtns = document.querySelectorAll(`[data-modal=${dataAttr}]`);
		const closeBtn = modal?.querySelector(`[${closeBtnAttr}]`);

		if (!modal) return;
		
		openBtns.forEach((el) => {
			el.addEventListener("click", function () {
				handleScrollBlock();
				modal.showModal();
				requestAnimationFrame(() => {
					modal.classList.add(ANIM_CLASS);
					document.activeElement?.blur();
				});
			});
		});

		if (closeBtn) {
			closeBtn.addEventListener("click", () => closeModalWithAnimation(modal));
		}

		modal.addEventListener("cancel", (e) => {
			e.preventDefault();
			closeModalWithAnimation(modal);
		});

		modal.addEventListener("click", (e) => {
			if (e.target === modal) closeModalWithAnimation(modal);
		});
	}

	window.initModal = initModal;

	initModal("#modal-privacy", "privacy", "data-close-button");
	initModal("#modal-menu", "menu", "data-close-button");
})();