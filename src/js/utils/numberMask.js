(function () {
	const inputs = document.querySelectorAll('input[type="tel"]');
	const mask = "+7 (___) ___-__-__";
	const def = mask.replace(/\D/g, "");
	const matrix = mask;

	inputs.forEach((input) => {
		const label = input.closest('[class*="__inputbox"]')?.querySelector('[class*="__label"]');

		function checkFilled() {
			const val = input.value.replace(/\D/g, "");
			const isFilled = val.length > def.length;
			input.classList.toggle("filled", isFilled);
			if (label) label.classList.toggle("filled", isFilled);
		}

		function setCursorPosition(pos, el) {
			el.focus();
			if (el.setSelectionRange) {
				el.setSelectionRange(pos, pos);
			} else if (el.createTextRange) {
				const range = el.createTextRange();
				range.collapse(true);
				range.moveEnd("character", pos);
				range.moveStart("character", pos);
				range.select();
			}
		}

		function normalizePhoneNumber(value) {
			// Удаляем все нецифровые символы
			let digits = value.replace(/\D/g, "");
			
			// Если начинается с 8, заменяем на 7
			if (digits.startsWith("8")) {
				digits = "7" + digits.substring(1);
			}
			
			// Если начинается с 7, оставляем как есть
			if (digits.startsWith("7")) {
				return digits;
			}
			
			// Если номер без кода страны (10 цифр), добавляем 7
			if (digits.length === 10) {
				return "7" + digits;
			}
			
			// Если номер с другим кодом страны или некорректный, форсируем 7
			if (digits.length > 0) {
				return "7" + digits.substring(digits.length >= 11 ? 1 : 0);
			}
			
			return "7";
		}

		function maskInput(event) {
			let val = input.value;
			
			// Обработка paste события
			if (event.type === "paste" || event.type === "input") {
				val = normalizePhoneNumber(val);
			} else {
				val = val.replace(/\D/g, "");
			}
			
			// Если поле пустое при blur, очищаем его
			if (val.length <= 1 && event.type === "blur") {
				input.value = "";
				checkFilled();
				return;
			}
			
			// Всегда начинаем с 7
			if (val.length === 0 || !val.startsWith("7")) {
				val = "7";
			}

			let i = 0;
			const newValue = matrix.replace(/./g, (char) => {
				return /[_\d]/.test(char) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : char;
			});

			input.value = newValue;
			checkFilled();

			if (event.type !== "blur") {
				// Если только +7 (, ставим курсор после скобки
				if (input.value === "+7 (") {
					setCursorPosition(4, input);
				} else {
					setCursorPosition(input.value.length, input);
				}
			}
		}

		function handleKeyDown(event) {
			const cursorPos = input.selectionStart;
			
			// Запрещаем удаление +7 
			if ((event.key === "Backspace" || event.key === "Delete") && cursorPos <= 3) {
				event.preventDefault();
				setCursorPosition(4, input);
			}
		}

		input.addEventListener("input", maskInput, false);
		input.addEventListener("focus", (event) => {
			// При фокусе, если поле пустое, устанавливаем +7
			if (input.value === "") {
				input.value = "+7 (";
				setCursorPosition(4, input);
			} else {
				maskInput(event);
			}
		}, false);
		input.addEventListener("blur", maskInput, false);
		input.addEventListener("paste", maskInput, false);
		input.addEventListener("keydown", handleKeyDown, false);

		input.addEventListener("click", () => {
			if (input.selectionStart < 4) {
				setCursorPosition(4, input);
			}
		});

		// Инициализация для уже заполненных полей
		if (input.value.length > 0) {
			input.value = normalizePhoneNumber(input.value);
			maskInput({ type: "input" });
		}
	});
})();