'use strict'


const DB_NAME = 'saved_data';
let todoItemId = 0;


document.querySelector('#todoForm')
	.addEventListener('submit', e => {
		e.preventDefault();
		const inputs = e.target.querySelectorAll('input, textarea'); //собераем данные с инпутов и текстэрий...

		const obj = {}; //...в обьект
		obj.completed = false; // добавляем поле для чекбокса
		todoItemId += 1; // счетчик, чтоб сетить Id в обьект obj
		obj["id"] = todoItemId; // сетим поле с Id

		for (const input of inputs) { //запускаем цикл...
			if (!input.value.length) return alert('No way you can add this shit');// проверка
			obj[input.name] = input.value; //сетим параметры из инпутов в обьект obj
		}

		console.log(obj);
		saveData(obj); // сохраняем обьект в localStorage
		renderItem(obj); // отображаем данные на UI
		e.target.reset(); // очищаем инпуты
	});

//=== удаляем все айтемы ====
document.getElementById('deleteAllBtn')
	.addEventListener("click", (e) => {
		e.preventDefault();
		let allItems = document.getElementById("todoItems")
		allItems.remove() //...удаляем из DOM
		localStorage.removeItem(DB_NAME); // ...удаляем из памяти localStorage
	});

//======= сохраняем обьект в память localStorage ======
function saveData(todoItem) {

	if (localStorage[DB_NAME]) {// усли в localStorage уже что-то есть...
		const data = JSON.parse(localStorage[DB_NAME]); //...парсим данные из lS в массив обьектов...

		data.push(todoItem);// ...пушим наш обьект todoItem в распарсенный масив обьектов data...
		localStorage.setItem(DB_NAME, JSON.stringify(data));//...сохраняем заново уже обновленный массив обьектов ( + обьект todoItem)...
		return data;
	} //если localStorage пуст...
	const data = [todoItem]//...создаем массив с одним (первым) обьектом todoItem...
	localStorage.setItem(DB_NAME, JSON.stringify(data));//...и слозраняем его в localStorage...
	return data
}

//============== ловим загрузку страницы ===============
window.addEventListener('load', () => {
	if (!localStorage[DB_NAME].length) return; // если localStorage пуст - ничего не делаем...
	const data = JSON.parse(localStorage[DB_NAME]); // если нет - парсим в обьект data...

	todoItemId = data[data.length - 1].id; //...возвращаем счетчику айдишек значение Id последнего сохраненного в LS обьекта +1
	console.log(data);
	data.forEach(item => renderItem(item)); // ...методом forEach отрисовываем вчсе таблички с сохраненными данными...
	localStorage.setItem(DB_NAME, JSON.stringify(data)); //думаю, можно без этой строчки обойтись :)
})

//======= функция отрисовки табличек с сохраненными данными ==========
function renderItem(todoItem) {
	const template = createTemplate(todoItem.title, todoItem.description, todoItem.id, todoItem.completed);
	document.querySelector('#todoItems').prepend(template);
}


//======= функция создания таблички с сохраненными данными ==========
function createTemplate(titleText = '', descriptionText = '', id = '', completed = false) {

	const data = JSON.parse(localStorage[DB_NAME]);//распарсиваем данные с localStorage

	const mainWrp = document.createElement('div'); //создаем главный блок...
	mainWrp.className = 'col-4'; // вешаем ему класс...

	const wrp = document.createElement('div');//...создаем главный длок для кадлой таблички с данными...
	wrp.className = 'taskWrapper';//...вешаем ему класс...
	wrp.setAttribute("data-id", id);//...сетим этому блоку Id (чтоб позже сравнить его с id чекбокса и изменить поле "completed")...
	mainWrp.append(wrp);//помещаем его внутрь главного блока

	const title = document.createElement('div');//создаем блок с полем текста title
	title.innerHTML = titleText;
	title.className = 'taskHeading';
	wrp.append(title);

	const description = document.createElement('div');//создаем блок с полем текста title description
	title.innerHTML = titleText;
	description.innerHTML = descriptionText;
	description.className = 'taskDescription'
	wrp.append(description);

	const isCompleted = document.createElement('input'); //создаем чекбокс...
	isCompleted.type = "checkbox";
	isCompleted.setAttribute('name', "done");

	if (completed) { //...если в распарсенном обьекте поле completed = true, рендерим чекбокс с галочкой...
		isCompleted.setAttribute('checked', "checked");
	} else {
		isCompleted.removeAttribute('checked')
	}

	const checkboxLabel = document.createElement('label');
	checkboxLabel.setAttribute("for", 'done');
	checkboxLabel.innerHTML = "Done"							//...оформляем чекбокс...
	wrp.append(isCompleted);
	wrp.append(checkboxLabel);

	const deleteItemBtn = document.createElement("button"); //...рисуем кнопку удаления айтема...
	deleteItemBtn.setAttribute("data-id", "deleteBtn")
	deleteItemBtn.className = 'btn';
	deleteItemBtn.classList.add('btn-primary');
	deleteItemBtn.innerHTML = "Delete";
	wrp.append(deleteItemBtn);

	localStorage.setItem(DB_NAME, JSON.stringify(data)); // думаю, можно обойтись и без этой строчки :)
	return mainWrp;
}


//========= ловим галочку в чекбоксе ===========
document.querySelector('#todoItems')
	.addEventListener("change", e => {

		const data = JSON.parse(localStorage[DB_NAME]); //распарсиваем данные с localStorage
		const itemId = e.target.parentElement.getAttribute("data-id"); // вытаскиваем id блока (таблички) с данными, на котором споймалм изменение чекбокса...

		if (e.target.checked) { //...если галочка есть...
			for (let item of data) { //...ищем циклом совпадение id блока с id  обьекта распарсенном массиве обьектов data...
				if (+item.id === +itemId) {
					item.completed = true; //...и меняем значение поля completed на true...
					localStorage.setItem(DB_NAME, JSON.stringify(data)); //...сохраняем изменение в localStorage.
				}
			}
		} else { // если галочки нет...
			for (let item of data) { //...ищем циклом совпадение id блока с id  обьекта распарсенном массиве обьектов data...
				if (+item.id === +itemId) {
					item.completed = false; //...и меняем значение поля completed на false...
					localStorage.setItem(DB_NAME, JSON.stringify(data)); //...сохраняем изменение в localStorage.
				}
			}
		}
	})

//======= удаляем таблички с данными (таргетно) на UI и в localStorage ===========
document.querySelector('#todoItems') // делегируем событие главному блоку с табличками
	.addEventListener("click", e => {
		const data = JSON.parse(localStorage[DB_NAME]);//распарсиваем данные с localStorage, чтоб с него тоже удалить таргетный обьект...
		if (e.target.closest("[data-id = 'deleteBtn']")) { //ловим клик на кнопки удаления блочка (таблички) с данными
			let wrapId = e.target.closest(".taskWrapper").getAttribute("data-id"); //достаем id таблички с данными, чтоб ниже сравнить с id обьекта... 
			for (let i = 0; i < data.length; i++) { // циклом ищем совпадение id-ишек таблички и обьекта...
				if (+data[i].id === +wrapId) {
					data.splice(i, 1) //когда совпало - удаляем этот обьект из распарсенного массива обьектов data
					localStorage.removeItem(DB_NAME); // очищаем localStorage, чтоб обновить данные...
					localStorage.setItem(DB_NAME, JSON.stringify(data)); // сохраняем обновленные данные...
				}
			}
			e.target.closest(".col-4").remove();//удаляем ближайший родительский блочок (табличку) с данными.
		}
	})


