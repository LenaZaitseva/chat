import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';
/*Вывод модального окна с регистрацией/входом при загрузке страницы */

document.addEventListener("DOMContentLoaded", modal_window);

function modal_window() {
    document.getElementById('chat_wrapper').style.display = 'none';
    document.querySelector('body').style.background = "#f1f1f1";
    var body = document.querySelector('body');
    body.innerHTML += '<div class="registration-form" id="registration-form">\t\n' +
        '                    <h1 class="reg">Регистрация</h1>' +
        '                    <form id="my" action="">' +
        '                        <input type="text" id="name" placeholder="Имя или пароль">' +
        '                        <div id="notification"></div>'+
        '                        <div class="input_wrapper">'+
        '                           <input type="button" value="Регистрация" class="btnReg" id="btnReg" >'+
        '                           <input type="button" value="Войти" class="btnEnter" id="btnEnter" >'+
        '                        </div>'+
        '                    </form>'+
        '               </div>  ';
}
window.onload = function() {

    /*Регистрация пользователя*/

    document.getElementById('btnReg').addEventListener('click', registration);

    function registration() {
        var name = document.getElementById('name').value;   console.log(name);
        if(name.length == 0) {
            var notification = document.getElementById('notification');

            notification.style.display = "block";
            notification.innerText += "Поле не может быть пустым"
            document.getElementById("name").style.border = "1px solid #FF3D39";
        }
        else {
            var user = {
                "username": name
            };
            var request1 = new XMLHttpRequest();
            request1.open('POST', 'https://studentschat.herokuapp.com/users/register', true);
            request1.setRequestHeader('Content-Type', 'application/json');
            request1.onreadystatechange = function() {
                // Обработчик ответа в случае удачного соеденения
                if (this.readyState != 4 && this.status == 200) {
                    var res = JSON.parse(request1.responseText);
                    console.log(res);
                }
            }

            request1.onerror = function() {
                var backgr =  document.createElement("div");
                backgr.className = "backgr_modal_error";
                var div = document.createElement("div");
                div.id = "modal_error";
                div.className = "registration-form";
                div.innerHTML +=
                    '<div class="modal-header">Ошибка</div>' +
                    '<div class="modal-content">Регистрация не удалась. Попробуйте ещё раз!</div>' +
                    '<div class="modal-buttons">\n' +
                    '\t\t\t\t<input type="button" value="Ок" class="Ок" id="btnOk" >\n' +
                    '</div>';
                document.getElementById("btnOk").addEventListener("click", location.reload());


            };

            request1.send(JSON.stringify(user));
        }
    }

}