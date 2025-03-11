// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

window.addEventListener("load", windowLoad);

let collectionsElement, categoriesElements;

function windowLoad() {
	collectionsElement = document.querySelector('.collections');
	categoriesElements = document.querySelectorAll('.collections__column');

	if (collectionsElement) {
		loadProducts();
	}
}

async function loadProducts(start = 0, limit = 3) {
	const productsJson = "files/json/collections.json";
	const response = await fetch(productsJson, {
		method: "GET"
	});
	if (response.ok) {
		const results = await response.json();
		setProducts(results, start, limit);
	}
}

function setProducts(products, start, limit) {

	const productsArray = products.collections;

	let productTamplate;
	productsArray.forEach((element, index) => {
		if (index >= start && index < (limit + start)) {
			productTamplate = `
		<article id="pid-${element.id}" class="collections__item item">
		   <a href="${element.url}" class="item__image">
		      <img src="${element.image}" alt="image">
	      </a>
			<div class="item__body">
			   <h4 class="item__title">
				   <a href="${element.url}" class="item__link-title">${element.title}</a>
			   </h4>
			   %OLD%
			   <div class="item__price">Rp ${element.price.value}</div>
		   </div>
      </article>
		`;
			if (element.price.oldvalue) {
				const oldPrice = `<div class="item__old-price">Rp ${element.price.oldvalue}</div>`;
				productTamplate = productTamplate.replace("%OLD%", oldPrice);
			} else {
				productTamplate = productTamplate.replace("%OLD%", '');
			}

			const category = element.category;
			let collectionsItems;
			if (category === 1) {
				collectionsItems = document.querySelector('#cat-01');
			}
			if (category === 2) {
				collectionsItems = document.querySelector('#cat-02');
			}
			if (category === 3) {
				collectionsItems = document.querySelector('#cat-03');
			}

			collectionsItems.insertAdjacentHTML("beforeend", productTamplate);
		}
	});
}



document.addEventListener('click', documentActions);

function documentActions(e) {
	const targetElement = e.target;
	if (targetElement.closest('.footer-collections__button')) {
		const productsQuantity = document.querySelectorAll('.collections__item').length;
		console.log(productsQuantity);
		loadProducts(productsQuantity);
		e.preventDefault();
	}
	if (targetElement.closest('.body-product__add-to-cart')) {
		addToCart();
		e.preventDefault();
	}
}


//Добавление в корзину (анимация)


function addToCart() {
	const speed = 800;
	const headerCart = document.querySelector('.actions-header__cart');
	const headerCartQuantity = headerCart.querySelector('span');
	const productImage = document.querySelector('.images-product__slide.swiper-slide-active img');
	const productName = document.querySelector('.body-product__title').innerHTML;
	const productOldPrice = document.querySelector('.price-product__old') ? document.querySelector('.price-product__old').innerHTML : null;
	const productPrice = document.querySelector('.price-product__value').innerHTML;
	const productQuantity = document.querySelector('.quantity__input input').value;

	const imageFly = productImage.cloneNode(true);

	const imageFlyBlock = document.createElement('div');
	imageFlyBlock.classList.add('image-fly');
	imageFlyBlock.append(imageFly);


	document.body.append(imageFlyBlock);

	imageFlyBlock.style.cssText = `
		top: ${productImage.getBoundingClientRect().top}px;
		left: ${productImage.getBoundingClientRect().left}px;
		width: ${productImage.offsetWidth}px;
		height: ${productImage.offsetHeight}px;
	`;

	setTimeout(() => {
		imageFlyBlock.style.cssText = `
		top: ${headerCart.getBoundingClientRect().top}px;
		left: ${headerCart.getBoundingClientRect().left}px;
		width: 0;
		height: 0;
		opacity: 0;
		transition: all ${speed}ms;
	`;
	}, 0);

	setTimeout(() => {
		headerCartQuantity.innerHTML = +headerCartQuantity.innerHTML + +productQuantity;
		imageFlyBlock.remove();
	}, speed);
}
