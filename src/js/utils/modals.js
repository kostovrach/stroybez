(function () {
	let scrollPosition = 0;
	const ANIM_CLASS = "anim";
	let modalStack = [];
	let isScrollBlocked = false;

	function handleScrollReturn() {
		if (modalStack.length === 0 && isScrollBlocked) {
			document.body.classList.remove("lock");
			document.body.style.removeProperty("top");
			document.body.style.removeProperty("position");
			document.body.style.removeProperty("width");
			window.scrollTo(0, scrollPosition);
			isScrollBlocked = false;
		}
	}

	function handleScrollBlock() {
		if (!isScrollBlocked) {
			scrollPosition = window.pageYOffset;
			document.body.classList.add("lock");
			document.body.style.position = "fixed";
			document.body.style.width = "100vw";
			document.body.style.top = `-${scrollPosition}px`;
			isScrollBlocked = true;
		}
	}

	function addModalToStack(modal) {
		modalStack.push(modal);
	}

	function removeModalFromStack(modal) {
		const index = modalStack.indexOf(modal);
		if (index > -1) {
			modalStack.splice(index, 1);
		}
	}

	function getTopModal() {
		return modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
	}

	function closeModal(modal) {
		modal.classList.remove(ANIM_CLASS);
		removeModalFromStack(modal);
		handleScrollReturn();
		setTimeout(() => {
			modal.close();
		}, 500);
	}

	function handleModalOpen(modal) {
		handleScrollBlock();
		addModalToStack(modal);
		modal.showModal();
		requestAnimationFrame(() => {
			modal.classList.add(ANIM_CLASS);
			document.activeElement?.blur();
		});
	}

	function handleEscape(e) {
		if (e.key === "Escape") {
			e.preventDefault();
			const topModal = getTopModal();
			if (topModal) {
				closeModal(topModal);
			}
		}
	}

	function handleBackdropClick(e) {
		const topModal = getTopModal();
		if (topModal && e.target === topModal) {
			closeModal(topModal);
		}
	}

	function initModal(modalId, dataAttr, closeBtnAttr) {
		const modal = document.querySelector(modalId);
		const openBtns = document.querySelectorAll(`[data-modal=${dataAttr}]`);
		const closeBtn = modal?.querySelector(`[${closeBtnAttr}]`);

		if (!modal) return;

		openBtns.forEach((el) => {
			el.addEventListener("click", function () {
				handleModalOpen(modal);
			});
		});

		if (closeBtn) {
			closeBtn.addEventListener("click", () => closeModal(modal));
		}

		modal.addEventListener("cancel", (e) => {
			e.preventDefault();
			if (getTopModal() === modal) {
				closeModal(modal);
			}
		});

		modal.addEventListener("click", (e) => {
			if (e.target === modal && getTopModal() === modal) {
				closeModal(modal);
			}
		});
	}

	document.addEventListener("keydown", handleEscape);
	document.addEventListener("click", handleBackdropClick);

	window.initModal = initModal;

	initModal("#modal-menu", "menu", "data-close-button");
	initModal("#modal-privacy", "privacy", "data-close-button");
	initModal("#modal-connection", "connection", "data-close-button");
	initModal("#modal-application", "application", "data-close-button");
	initModal("#modal-question", "question", "data-close-button");
})();
