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
                usersList = JSON.parse(response); console.log(usersList);
            var userListActive = [];
            usersList.forEach(             //вывести количество активных пользователей
                function (obj) {
                    if(obj['status'] === "active") userListActive.push(obj);
                    return userListActive;
                })
            users_online.innerText = userListActive.length;

            /*Вывод списка пользователей*/
            var users_list = document.querySelector(".users_list");
            var online = '<li class="user_link">\n' +
                '                                    <div class="user" data-id ="\n';
            var online1 = '<div class="user_icon">\n' +
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
        '                                </li>'
        usersList.forEach(
            function (obj) {
                if(obj['status'] === 'active') users_list.innerHTML += online + obj['user_id'] +'">'+online1 +obj['username']+ ' ' + online2;
                else users_list.innerHTML += offline + obj['username'] + ' ' + offline2;

            })
        compare(usersList);
    }
    request.onerror = function() {
            users_online.innerText = ' ';
    };
    request.send(JSON.stringify(user));

    /**/


/*Назначить событие открытия вкладки сообщений при нажатии на юзера*/

    var elements = document.getElementById('users_list').addEventListener('click',findTarget);
    var selectedTd;
    function findTarget(event) {
        var target = event.target;

        while (target.className !== 'users_list') {
            if (target.className === 'user') {
                // нашли элемент, который нас интересует!
                openTab(target);
                return;
            }
            target = target.parentNode;
        }
    }
        function openTab(target) {

            var userDataId = target.getAttribute('data-id');
            console.log(userDataId); //сохраняем в переменную user id

            /* получаем имя выбранного пользователя для вставки в tab*/
            var userName = target.getElementsByClassName('user_name');
            console.dir(userName);
            for (var i = 0; i < userName.length; i++) {
                var g = userName[i].innerText;
                console.log(g);
            }
            /*GET-запрос для вывода сообщений по пользователю target*/
            var user = {
                "user_id": userDataId
            };
            var messageList;
            var messages;
            var currentMessage;
            var request = new XMLHttpRequest();
            request.open('GET', 'https://studentschat.herokuapp.com/messages', true);

            request.onload = function () {
                // Обработчик успешного ответа
                var response = request.responseText;
                messageList = JSON.parse(response);
                console.log(messageList);
                var userMessageActive = [];
                messageList.forEach(             //вывести cообщения по конкретному юзеру
                    function (obj) {
                        if (obj['user_id'] === +userDataId) {
                            messages = obj;
                            console.log(messages);
                            currentMessage = messages['message'];
                            console.log(currentMessage);
                            createTab(currentMessage);
                        }
                        else createClearTab()
                    });

            }
            request.onerror = function () {
                //users_online.innerText = ' ';
            };
            request.send(JSON.stringify(user));

            function createTab() {
                document.getElementById('tabs').innerHTML += '<div class="tab">\n' +
                    '                                    <input type="radio" id="tab1" name="tab-group" checked>\n' +
                    '                                    <label for="tab1" class="tab-title">' + g + '</label>\n' +
                    '                                    <section class="tab-content">\n' +
                    '                                            <div class="wrap_for_users_messages">\n' +
                    '                                                <div class="users_messages_text" id=' +
                    ' "users_messages_text" style="display: none"></div>\n' +
                    '                                                <div class="your_messages_text" id=' +
                    ' "your_messages_text">' + currentMessage + '</div>\n' +
                    '                                            </div>\n' +
                    '                                        <div class="area_create_new_message">\n' +
                    '                                             <div class="field_for_typing">\n' +
                    '                                                 <textarea class="type_message" rows="1"\n' +
                    '                                                           placeholder="Type something..."></textarea>\n' +
                    '                                                 <input type="button" value="Send" class="send">\n' +
                    '                                             </div>\n' +
                    '                                            <div class="wrapper_for_customize">\n' +
                    '                                                <div class="field_for_customize">\n' +
                    '                                                    <button>B</button>\n' +
                    '                                                    <button>I</button>\n' +
                    '                                                    <button>S</button>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="symbols">\n' +
                    '                                                    <div>Leters: <span>13</span></div>|\n' +
                    '                                                    <div>Invisible symbols: <span>2</span></div>|\n' +
                    '                                                    <div>Punctuation marks: <span>1</span></div>|\n' +
                    '                                                    <div >All symbols: <span>16</span></div>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                        </div>\n' +
                    '                                    </section>\n' +
                    '                                </div>';
            }
            function createClearTab() {
                document.getElementById('tabs').innerHTML += '<div class="tab">\n' +
                    '                                    <input type="radio" id="tab1" name="tab-group" checked>\n' +
                    '                                    <label for="tab1" class="tab-title">' + g + '</label>\n' +
                    '                                    <section class="tab-content">\n' +
                    '                                            <div class="wrap_for_users_messages">\n' +
                    '                                            </div>\n' +
                    '                                        <div class="area_create_new_message">\n' +
                    '                                             <div class="field_for_typing">\n' +
                    '                                                 <textarea class="type_message" rows="1"\n' +
                    '                                                           placeholder="Type something..."></textarea>\n' +
                    '                                                 <input type="button" value="Send" class="send">\n' +
                    '                                             </div>\n' +
                    '                                            <div class="wrapper_for_customize">\n' +
                    '                                                <div class="field_for_customize">\n' +
                    '                                                    <button>B</button>\n' +
                    '                                                    <button>I</button>\n' +
                    '                                                    <button>S</button>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="symbols">\n' +
                    '                                                    <div>Leters: <span>13</span></div>|\n' +
                    '                                                    <div>Invisible symbols: <span>2</span></div>|\n' +
                    '                                                    <div>Punctuation marks: <span>1</span></div>|\n' +
                    '                                                    <div >All symbols: <span>16</span></div>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                        </div>\n' +
                    '                                    </section>\n' +
                    '                                </div>';
            }
        }




     }







