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
var a = document.createElement('div');
a.id = 'modal_error';
a.className = 'registration-form';
a.innerHTML = '<div class="modal-header">Ошибка </div>' +
    '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
    '     <div class="modal-buttons">' +
    '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
    '     </div>';
    // '<div class="registration-form" id="modal_error">' +
    // '<div class="modal-header">Ошибка </div>' +
    // '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
    // '     <div class="modal-buttons">' +
    // '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
    // '     </div>' +
    // '</div>';
    /*Регистрация пользователя*/

    document.getElementById('btnReg').addEventListener('click', registration);
    function registration() {
        autorize('https://studentschat.herokuapp.com/users/register');
    }
    /*Вход пользователя в чат*/
    document.getElementById('btnEnter').addEventListener('click', enter);
    function enter() {
        login('https://studentschat.herokuapp.com/users');
    }

/* функция для регистрации пользователя*/
    function autorize(who) {
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
            request1.open('POST', who, true);
            request1.setRequestHeader('Content-Type', 'application/json');

            request1.onload = function() {
                // Обработчик ответа в случае удачного соеденения
                if (request1.status >= 200 && request1.status < 400) {
                    var res = JSON.parse(request1.responseText);
                    console.log(res);
                    document.getElementById('chat_wrapper').style.display = 'block';
                    document.querySelector('body').style.background = "#ffffff";
                    document.getElementById("registration-form").style.display = 'none';

                } else {
                    document.getElementById("registration-form").style.display = 'none';
                    document.querySelector('body').innerHTML =
                        '<div class="registration-form" id="modal_error">' +
                        '<div class="modal-header">Ошибка</div>' +
                        '     <div class="modal-content">Регистрация не удалась. Попробуйте ещё раз!</div>' +
                        '     <div class="modal-buttons">' +
                        '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
                        '     </div>' +
                        '</div>';
                }
            }

            request1.onerror = function() {
                document.getElementById("registration-form").style.display = 'none';
                document.querySelector('body').innerHTML =
                    '<div class="registration-form" id="modal_error">' +
                    '<div class="modal-header">Ошибка</div>'+
                    '     <div class="modal-content">Регистрация не удалась. Попробуйте ещё раз!</div>' +
                    '     <div class="modal-buttons">' +
                    '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
                    '     </div>' +
                    '</div>'
            };

            request1.send(JSON.stringify(user));
        }
    }
    /* функция для входа пользователя в чат*/
    function login(who) {
        var name = document.getElementById('name').value;   console.log(name);
        if(name.length == 0) {
            var notification = document.getElementById('notification');

            notification.style.display = "block";
            notification.innerText += "Поле не может быть пустым"
            document.getElementById("name").style.border = "1px solid #FF3D39";
        } else {
            var user = {
                "username": name
            };
            var request = new XMLHttpRequest();
            request.open('GET', who, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Обработчик успещного ответа
                    var response = request.responseText;
                    var userList = Response;

                    JSON.parse(response).forEach(
                        function (obj) {
                            console.log(obj);
                            if(obj['username'] === name) {
                                document.getElementById("registration-form").style.display = 'none';
                                document.getElementById("modal_error").style.display = 'none';
                                document.getElementById('chat_wrapper').style.display = 'block';
                                document.querySelector('body').style.background = "#ffffff";

                            } else {
                                document.getElementById("registration-form").style.display = 'none';
                                document.querySelector('body').appendChild(a);
                                //document.querySelector('body').innerHTML =
                                    // '<div class="registration-form" id="modal_error">' +
                                    // '<div class="modal-header">Ошибка </div>' +
                                    // '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
                                    // '     <div class="modal-buttons">' +
                                    // '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
                                    // '     </div>' +
                                    // '</div>';
                            }
                        }
                    )
                } else {
                    // Обработчик ответа в случае ошибки
                    document.getElementById("registration-form").style.display = 'none';
                    document.querySelector('body').innerHTML =
                        '<div class="registration-form" id="modal_error">' +
                        '<div class="modal-header">Ошибка</div>' +
                        '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
                        '     <div class="modal-buttons">' +
                        '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
                        '     </div>' +
                        '</div>';
                }
            }
            request.onerror = function() {
                document.getElementById("registration-form").style.display = 'none';
                document.querySelector('body').innerHTML =
                    '<div class="registration-form" id="modal_error">' +
                    '<div class="modal-header">Ошибка</div>' +
                    '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
                    '     <div class="modal-buttons">' +
                    '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
                    '     </div>' +
                    '</div>';
            };
            request.send(JSON.stringify(user));
        }
    }


}