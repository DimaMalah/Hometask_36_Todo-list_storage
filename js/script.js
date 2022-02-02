'use strict'


const DB_NAME = 'saved_data';
let todoItemId = 0;
let isCheckboxChecked = false;
let itemIdes = [];


document.querySelector('#todoForm')
	.addEventListener('submit', e => {
		e.preventDefault();
		const inputs = e.target.querySelectorAll('input, textarea');

		const obj = {};
		obj.completed = false;
		todoItemId += 1;
		obj["id"] = todoItemId;

		for (const input of inputs) {
			if (!input.value.length) return alert('No way you can add this shit');
			obj[input.name] = input.value;
		}

		console.log(obj);
		saveData(obj);
		renderItem(obj);
		e.target.reset();
	});

document.getElementById('deleteAllBtn')
	.addEventListener("click", (e) => {
		e.preventDefault();
		let allItems = document.getElementById("todoItems")
		allItems.remove()
		localStorage.removeItem(DB_NAME);
	});


function saveData(todoItem) {

	if (localStorage[DB_NAME]) {
		const data = JSON.parse(localStorage[DB_NAME]);

		data.push(todoItem);
		localStorage.setItem(DB_NAME, JSON.stringify(data));
		return data;
	}
	const data = [todoItem]
	localStorage.setItem(DB_NAME, JSON.stringify(data));
	return data
}


window.addEventListener('load', () => {
	if (!localStorage[DB_NAME].length) return;
	const data = JSON.parse(localStorage[DB_NAME]);

	for (let item of data) {
		if (item.completed === "true") itemIdes.push(item.id)
	};

	todoItemId = data[data.length - 1].id;
	console.log(data);
	data.forEach(item => renderItem(item));
	localStorage.setItem(DB_NAME, JSON.stringify(data));
})


function renderItem(todoItem) {
	const template = createTemplate(todoItem.title, todoItem.description, todoItem.id, todoItem.completed);
	document.querySelector('#todoItems').prepend(template);
}



function createTemplate(titleText = '', descriptionText = '', id = '', completed = false) {

	const data = JSON.parse(localStorage[DB_NAME]);

	const mainWrp = document.createElement('div');
	mainWrp.className = 'col-4';

	const wrp = document.createElement('div');
	wrp.className = 'taskWrapper';
	wrp.setAttribute("data-id", id);
	mainWrp.append(wrp);

	const title = document.createElement('div');
	title.innerHTML = titleText;
	title.className = 'taskHeading';
	wrp.append(title);

	const description = document.createElement('div');
	description.innerHTML = descriptionText;
	description.className = 'taskDescription'
	wrp.append(description);

	const isCompleted = document.createElement('input');
	isCompleted.type = "checkbox";
	isCompleted.setAttribute('name', "done");

	if (completed) {
		isCompleted.setAttribute('checked', "checked");
	} else {
		isCompleted.removeAttribute('checked')
	}

	const checkboxLabel = document.createElement('label');
	checkboxLabel.setAttribute("for", 'done');
	checkboxLabel.innerHTML = "Done"
	wrp.append(isCompleted);
	wrp.append(checkboxLabel);

	const deleteItemBtn = document.createElement("button");
	deleteItemBtn.setAttribute("data-id", "deleteBtn")
	deleteItemBtn.className = 'btn';
	deleteItemBtn.classList.add('btn-primary');
	deleteItemBtn.innerHTML = "Delete";
	wrp.append(deleteItemBtn);

	localStorage.setItem(DB_NAME, JSON.stringify(data));
	return mainWrp;
}



document.querySelector('#todoItems')
	.addEventListener("change", e => {

		const data = JSON.parse(localStorage[DB_NAME]);
		const itemId = e.target.parentElement.getAttribute("data-id");

		if (e.target.checked) {
			for (let item of data) {
				if (+item.id === +itemId) {
					item.completed = true;
					localStorage.setItem(DB_NAME, JSON.stringify(data));
				}
			}
		} else {
			for (let item of data) {
				if (+item.id === +itemId) {
					item.completed = false;
					localStorage.setItem(DB_NAME, JSON.stringify(data));
				}
			}
		}
	})


document.querySelector('#todoItems')
	.addEventListener("click", e => {
		const data = JSON.parse(localStorage[DB_NAME]);
		if (e.target.closest("[data-id = 'deleteBtn']")) {
			let wrapId = e.target.closest(".taskWrapper").getAttribute("data-id");
			for (let i = 0; i < data.length; i++) {
				if (+data[i].id === +wrapId) {
					data.splice(i, 1)
					localStorage.removeItem(DB_NAME);
					localStorage.setItem(DB_NAME, JSON.stringify(data));
				}
			}
			localStorage.setItem(DB_NAME, JSON.stringify(data));
			e.target.closest(".col-4").remove();
		}
	})


