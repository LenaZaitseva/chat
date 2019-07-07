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

    var enter_error = document.createElement('div');
    enter_error.id = 'modal_error';
    enter_error.className = 'registration-form';
    enter_error.innerHTML = '<div class="modal-header">Ошибка </div>' +
        '     <div class="modal-content">Вход не выполнен. Попробуйте ещё раз!</div>' +
        '     <div class="modal-buttons">' +
        '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
        '     </div>';

    var register_error = document.createElement('div');
    register_error.id = 'modal_error';
    register_error.className = 'registration-form';
    register_error.innerHTML = '<div class="modal-header">Ошибка </div>' +
        '     <div class="modal-content">Регистрация не удалась. Попробуйте ещё раз!</div>' +
        '     <div class="modal-buttons">' +
        '          <input type="button" value="Ок" class="btnEnter" id="btnOk" onclick="location.reload()">' +
        '     </div>';

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
                    document.querySelector('body').appendChild(register_error);
                }
            }

            request1.onerror = function() {
                document.getElementById("registration-form").style.display = 'none';
                document.querySelector('body').appendChild(register_error);
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
                            if(obj['username'] === name) {
                                document.getElementById("registration-form").style.display = 'none';
                                document.getElementById("modal_error").style.display = 'none';
                                document.getElementById('chat_wrapper').style.display = 'block';
                                document.querySelector('body').style.background = "#ffffff";

                            } else {
                                document.getElementById("registration-form").style.display = 'none';
                                document.querySelector('body').appendChild(enter_error);
                            }
                        }
                    )
                } else {
                    // Обработчик ответа в случае ошибки
                    document.getElementById("registration-form").style.display = 'none';
                    document.querySelector('body').appendChild(enter_error);
                }
            }
            request.onerror = function() {
                document.getElementById("registration-form").style.display = 'none';
                document.querySelector('body').appendChild(enter_error);
            };
            request.send(JSON.stringify(user));
        }
    }

    /*Вывод количества активных пользователей*/

    var users_online = document.querySelector('.count');
    var user = {
        "username": name
    };
    var usersList;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://studentschat.herokuapp.com/users', true);

    request.onload = function() {
            // Обработчик успешного ответа
            var response = request.responseText;
                usersList = JSON.parse(response);
            var userListActive = [];
            usersList.forEach(
                function (obj) {
                    if(obj['status'] === "active") userListActive.push(obj);
                    return userListActive;
                })
            users_online.innerText = userListActive.length;

            /*Вывод списка пользователей*/
            var users_list = document.querySelector(".users_list");
            var online = '<a href="" class="user_link">\n' +
                '                                    <div class="user">\n' +
                '                                        <div class="user_icon">\n' +
                '                                            <img src="images/capitanamerica.jpg" alt="Captain' +
                ' America " style="visibility: hidden">\n' +
                '                                        </div>\n' +
                '                                        <div class="user_name">';

            var online2 = '<span class="status_marker"></span>\n' +
                '                                        </div>\n' +
                '                                        <div class="new_messages_from_user_tag active"' +
                ' style="visibility: hidden">\n' +
                '                                            2\n' +
                '                                        </div>\n' +
                '                                    </div>\n' +
                '                                </a>';
            var offline = '<a href="" class="user_link">\n' +
                '                                    <div class="user">\n' +
                '                                        <div class="user_icon">\n' +
                '                                            <img src="images/capitanamerica.jpg" alt="Captain' +
                ' America " style="visibility: hidden">\n' +
                '                                        </div>\n' +
                '                                        <div class="user_name">';
            var offline2 = '<span class="status_marker sleep"></span>\n' +
        '                                        </div>\n' +
        '                                        <div class="new_messages_from_user_tag active"' +
        ' style="visibility: hidden">\n' +
        '                                            2\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </a>'
        usersList.forEach(
            function (obj) {
                if(obj['status'] === 'active') users_list.innerHTML += online + obj['username']+ ' ' + online2;
                else users_list.innerHTML += offline + obj['username'] + ' ' + offline2;

            })


    }
    request.onerror = function() {
            users_online.innerText = ' ';
    };
    request.send(JSON.stringify(user));










}