//========================================================================================================================================================================================================================
//Адаптив изображений начало
//========================================================================================================================================================================================================================
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();
//========================================================================================================================================================================================================================
//Адаптив изображений конец
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
//Денамический адаптив начало 
//========================================================================================================================================================================================================================
function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
//========================================================================================================================================================================================================================
//Денамический адаптив конец
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
//Бургер начало
//========================================================================================================================================================================================================================
const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}

};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}
/*
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}
*/

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

const iconMenuForm = document.querySelector('.menu__icon-logaut');
const menuBodyForm = document.querySelector('.burger-form');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		if (iconMenuForm.classList.contains('_active') && menuBodyForm.classList.contains('_active')) {
			document.body.classList.remove('_lock');
			iconMenuForm.classList.remove('_active');
			menuBodyForm.classList.remove('_active');
		}
		
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
	iconMenuForm.addEventListener("click", function (e) {
		if (iconMenuForm && menuBodyForm) {
			if (iconMenu.classList.contains('_active') && menuBody.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			document.body.classList.toggle('_lock');
			iconMenuForm.classList.toggle('_active');
			menuBodyForm.classList.toggle('_active');
		}
	});
}

//========================================================================================================================================================================================================================
//Бургер конец
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Убирания плэйсхолдера при фокусе
//========================================================================================================================================================================================================================
const Forms =  document.querySelectorAll('._input-placeholder');

if (Forms) {
	for (let i = 0; i < Forms.length; i++) {
		let Form = Forms[i];
		let FormPlaceholder = Form.placeholder;

		Form.addEventListener("focus", function (e) {
			Form.placeholder = "";
		});
		Form.addEventListener("blur", function (e) {
			Form.placeholder = FormPlaceholder;
		});
	}
}
//========================================================================================================================================================================================================================
// Убирания плэйсхолдера при фокусе
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Убирания камисия в калькуляторе
//========================================================================================================================================================================================================================
let calculatorFormButton =  document.querySelector('.calculator-form-commission');
let calculatorFormBody =  document.querySelector('.calculator-form-commission__body');

if (calculatorFormButton) {
	calculatorFormButton.addEventListener("click", function (e) {
		let withinBoundaries = e.composedPath().includes(calculatorFormBody);
		if ( ! withinBoundaries) {
			calculatorFormButton.classList.toggle('active');
		}
	});
	document.addEventListener( 'click', (e) => {
		let withinBoundaries = e.composedPath().includes(calculatorFormBody);
		let withinBoundaries2 = e.composedPath().includes(calculatorFormButton);

		if ( ! withinBoundaries && ! withinBoundaries2) {
			calculatorFormButton.classList.remove('active');
		}
	})
}
//========================================================================================================================================================================================================================
// Убирания камисия в калькуляторе
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Табы
//========================================================================================================================================================================================================================
const Tab =  document.querySelectorAll('._tab');

if (Tab.length > 0) {
	for (let i = 0; i < Tab.length; i++) {
		let TabLinks =  Tab[i].querySelectorAll('._tab-link');
		let TabLinkBody =  Tab[i].querySelectorAll('._tab-link-body');
		let TabWraper =  Tab[i].querySelectorAll('._tab-wrapper');
		let TabBodys =  Tab[i].querySelectorAll('._tab-body');
		for (let i = 0; i < TabLinks.length; i++) {
			let TabLink = TabLinks[i];

			TabLink.addEventListener("click", function (e) {
				for (let i = 0; i < TabLinks.length; i++) {
					if (TabLinks[i].classList.contains('active')) {
						TabLinks[i].classList.remove('active');
					}
				}
				TabLink.classList.toggle('active');
				const blockID = TabLink.getAttribute('href').replace('#', '');

				if (blockID == "all") {
					for (let i = 0; i < TabBodys.length; i++) {
						if (TabBodys[i].classList.contains('hide')) {
							TabBodys[i].classList.remove('hide');
						} 
					}
				} else {
					for (let i = 0; i < TabBodys.length; i++) {
						TabBodys[i].classList.add('hide');

						if (TabBodys[i].id == blockID) {
							TabBodys[i].classList.remove('hide');
						} 
					}
				}
			});
		}
	}
}
//========================================================================================================================================================================================================================
// Табы
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Язык в шапке
//========================================================================================================================================================================================================================
const LangvigButton =  document.querySelector('.header-languages__title');
const LangvigWrapper =  document.querySelector('.header-languages');
const LangvigBody =  document.querySelector('.header-languages__wrapper');

if (LangvigButton) {
	LangvigButton.addEventListener( 'click', (e) => {
		LangvigWrapper.classList.toggle('_active');
	});
	document.addEventListener( 'click', (e) => {
		let withinBoundaries = e.composedPath().includes(LangvigBody);
		let withinBoundaries2 = e.composedPath().includes(LangvigButton);

		if ( ! withinBoundaries && ! withinBoundaries2) {
			LangvigWrapper.classList.remove('_active');
		}
	})
}
//========================================================================================================================================================================================================================
// Язык в шапке
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Калькулятор (index)
//========================================================================================================================================================================================================================

const calculatorsWrapper =  document.querySelectorAll('._calculator-wrapper');

if (calculatorsWrapper) {
	//const calculatorWrapperImg_1 =  document.querySelector('._calculator-wrapper__IMG-1');
	//const calculatorWrapperImg_2 =  document.querySelector('._calculator-wrapper__IMG-2');
}

const calculators =  document.querySelectorAll('._calculator');

if (calculators) {
	const calculatorWrapperImg_1 =  document.querySelector('._calculator-wrapper__IMG-1');
	const calculatorWrapperImg_2 =  document.querySelector('._calculator-wrapper__IMG-2');
	const calculatorWrapperTEXT_1 =  document.querySelector('._calculator-wrapper__TEXT-1');
	const calculatorWrapperTEXT_2 =  document.querySelector('._calculator-wrapper__TEXT-2');

	for (let i = 0; i < calculators.length; i++) {
		let calculator = calculators[i];
		let calculatorImg_1 =  calculator.querySelector('._calculator__IMG-1');
		let calculatorImg_2 =  calculator.querySelector('._calculator__IMG-2');
		let calculatorLinks =  calculator.querySelectorAll('._calculator-link');

		for (let i = 0; i < calculatorLinks.length; i++) {
			let calculatorLink = calculatorLinks[i];
			calculatorLink.addEventListener( 'click', (e) => {
				for (let i = 0; i < calculatorLinks.length; i++) {
					calculatorLinks[i].classList.remove('_active');
				}
				calculatorLink.classList.add('_active');
				let calculatorLinkImg = calculatorLink.querySelector('._calculator-link__img').src;
				let calculatorLinkText = calculatorLink.querySelector('.index-calculator-blok-list__text').textContent;
				if (calculatorImg_1) {
					calculatorImg_1.style.backgroundImage = `url(${calculatorLinkImg})`;
				}
				if (calculatorImg_2) {
					calculatorImg_2.style.backgroundImage = `url(${calculatorLinkImg})`;
				}
				if (calculator.closest('._calculator-1')) {
					//alert("1");
					calculatorWrapperImg_1.style.backgroundImage = `url(${calculatorLinkImg})`;
					calculatorWrapperTEXT_1.textContent = calculatorLinkText;
				}
				if (calculator.closest('._calculator-2')) {
					//alert("2");
					calculatorWrapperImg_2.style.backgroundImage = `url(${calculatorLinkImg})`;
					calculatorWrapperTEXT_2.textContent = calculatorLinkText;
				}
			});
		}
	}
}



const calculatorMbButtons =  document.querySelectorAll('._calculator-blok-mb__title');
const calculatorMbBodys =  document.querySelectorAll('._calculator-blok-mb__body');
//const calculatorMbBlokSearchs =  document.querySelectorAll('._calculator-blok-search');

if (calculatorMbButtons.length > 0  && calculatorMbBodys.length > 0) {
	for (let i = 0; i < calculatorMbBodys.length; i++) {
		let calculatorMbButton = calculatorMbButtons[i];
		let calculatorMbBody = calculatorMbBodys[i];
		//let calculatorMbBlokSearch = calculatorMbBlokSearchs[i];

		calculatorMbButton.addEventListener("click", function (e) {
			calculatorMbButton.classList.toggle('_active');
			calculatorMbBody.classList.toggle('_active');
			//calculatorMbBlokSearch.classList.toggle('active');
		});
		document.addEventListener( 'click', (e) => {
			let withinBoundaries = e.composedPath().includes(calculatorMbButton);
			let withinBoundaries2 = e.composedPath().includes(calculatorMbBody);
			//let withinBoundaries3 = e.composedPath().includes(calculatorMbBlokSearch);

			if ( ! withinBoundaries && ! withinBoundaries2) {
				calculatorMbButton.classList.remove('_active');
				calculatorMbBody.classList.remove('_active');
				//calculatorMbBlokSearch.classList.remove('active');
			}
		})
	}
}
//========================================================================================================================================================================================================================
// Калькулятор (index)
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Валидация 
//========================================================================================================================================================================================================================

const FormValidationWrappers =  document.querySelectorAll('._form-validation__wrapper');

if (FormValidationWrappers) {
	for (var i = 0; i < FormValidationWrappers.length; i++) {
		//alert(i);
		let FormValidationWrapper = FormValidationWrappers[i];
		let FormValidationButton =  FormValidationWrapper.querySelector('._form-validation__button'); //onclick="return false"
		let FormValidationBodys =  FormValidationWrapper.querySelectorAll('._form-validation__body');
		let FormValidationInputs =  FormValidationWrapper.querySelectorAll('._form-validation__input');

		FormValidationButton.addEventListener( 'click', (e) => {
			if (FormValidationInputs.length = FormValidationBodys.length) {
				let sum = 0;
				for (let i = 0; i < FormValidationBodys.length; i++) {
					let FormValidationInput = FormValidationInputs[i];
					let FormValidationBody = FormValidationBodys[i];

					//alert(FormValidationInput);
					if (FormValidationInput.getAttribute("type") === "checkbox") {
						if (FormValidationInput.checked === true) {

						} else {
							FormValidationInput.classList.add('error');
							FormValidationBody.classList.add('error');
							sum++;
						}
					} else {
						if (FormValidationInput.value) {

						} else if (false) {

						} else {
							FormValidationInput.classList.add('error');
							FormValidationBody.classList.add('error');
							sum++;
						}
					}
				}
				if (FormValidationButton.closest('#popup-password-recovery') && sum <= 0) {
					let popupPasswordRecovery = document.querySelector('#popup-password-recovery');
					let popupPasswordRecovery2 = document.querySelector('#popup-password-recovery2');

					popupPasswordRecovery.classList.remove('open');
					popupPasswordRecovery2.classList.toggle('open');
				} else if (sum <= 0) {
					FormValidationWrapper.submit();
				}
				/*if (sum <= 0) {
					FormValidationWrapper.submit();
				}*/
			}
		});

		for (let i = 0; i < FormValidationInputs.length; i++) {
			let FormValidationInput = FormValidationInputs[i];
			
			FormValidationInput.addEventListener( 'click', (e) => {
				for (let i = 0; i < FormValidationBodys.length; i++) {
					let FormValidationInput = FormValidationInputs[i];
					let FormValidationBody = FormValidationBodys[i];

					FormValidationInput.classList.remove('error');
					FormValidationBody.classList.remove('error');
				}
			});
		}

	}
}
//========================================================================================================================================================================================================================
// Валидация 
//========================================================================================================================================================================================================================



//========================================================================================================================================================================================================================
// Попапы
//========================================================================================================================================================================================================================

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 300;

if (popupLinks.length > 0) {
	for (let i = 0; i < popupLinks.length; i++) {
		const popupLink = popupLinks[i];
		popupLink.addEventListener("click", function (e){
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let i = 0; i < popupCloseIcon.length; i++) {
		const el = popupCloseIcon[i];
		el.addEventListener('click', function (e){
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	if ( !(body.classList.contains("on")) ) {
		body.classList.add('_lock');
	}

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let i = 0; i < lockPadding.length; i++) {
				const el = lockPadding[i];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		if (document.querySelector(".burger-form") && document.querySelector(".burger-wrapper")) {
			if ( !(document.querySelector(".burger-form").classList.contains("_active")) && !(document.querySelector(".burger-wrapper").classList.contains("_active"))) {
				body.classList.remove('_lock');
			}
		} else {
			body.classList.remove('_lock');
		}
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}
//========================================================================================================================================================================================================================
// Попапы
//========================================================================================================================================================================================================================

