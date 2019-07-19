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
    var start_of_session;
    var userId;
    var date_of_last_message;

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
                    create_userlist();
                    create_messages();
                    userId = res['user_id'];
                    return userId;

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
        current_time_at_the_header();
        interval_current_time_at_the_header();
        timer_of_being_online();
        return {userId:userId, start_of_session:start_of_session};
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


                    JSON.parse(response).forEach(
                        function (obj) {
                            if(obj['username'] === name || obj['password'] === name  ) {
                                document.getElementById("registration-form").style.display = 'none';
                                document.getElementById("modal_error").style.display = 'none';
                                document.getElementById('chat_wrapper').style.display = 'block';
                                document.querySelector('body').style.background = "#ffffff";
                                start_of_session = new Date().getTime();
                                create_userlist();
                                create_messages();
                                userId = obj['user_id'];
                                return {userId:userId, start_of_session:start_of_session};

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
                return {userId:userId, start_of_session:start_of_session};
            }
            request.onerror = function() {
                document.getElementById("registration-form").style.display = 'none';
                document.querySelector('body').appendChild(enter_error);
            };
            request.send(JSON.stringify(user));
        }
        current_time_at_the_header();
        interval_current_time_at_the_header();
        timer_of_being_online();
        return {userId:userId, start_of_session:start_of_session};
    }
    function timer_of_being_online() {
        var b = setInterval(counter_of_being_online,1000);
    }
    function counter_of_being_online() {
        var curent = new Date().getTime();
        var milliseconds = curent - start_of_session;
        var hours = milliseconds / (1000*60*60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

        //Get remainder from minutes and convert to seconds
        var seconds = (minutes - absoluteMinutes) * 60;
        var absoluteSeconds = Math.floor(seconds);
        var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

        document.getElementById('online_hours').innerText = h;
        document.getElementById('online_minutes').innerText = m;
        document.getElementById('online_seconds').innerText = s;
    }
    function interval_current_time_at_the_header(){
        var c = setInterval(current_time_at_the_header,10000);
    }
    function current_time_at_the_header() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        if (hours <= 9) hours = "0" + hours;
        if (minutes <= 9) minutes = "0" + minutes;
        document.getElementById('current_hours').innerText = hours;
        document.getElementById('current_minutes').innerText = minutes;
    }
    function create_userlist() { //"Глобальная" функция создания списка юзеров, срабатывающая при входе пользователя

     /*Вывод количества активных пользователей*/

     var users_online = document.querySelector('.count');
     var user = {
         "username": name
     };
     var usersList;
     var request = new XMLHttpRequest();
     request.open('GET', 'https://studentschat.herokuapp.com/users', true);

     request.onload = function () {
         // Обработчик успешного ответа
         var response = request.responseText;
         usersList = JSON.parse(response);
         var userListActive = [];
         usersList.forEach(             //вывести количество активных пользователей
             function (obj) {
                 if (obj['status'] === "active") userListActive.push(obj);
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
                 if (obj['status'] === 'active') users_list.innerHTML += online + obj['user_id'] + '">' + online1 + obj['username'] + ' ' + online2;
                 else users_list.innerHTML += online + obj['user_id'] + '">' + online1 + obj['username'] + ' ' + offline2;
             });
     }
     request.onerror = function () {
         users_online.innerText = ' ';
     };
     request.send(JSON.stringify(user));
 } // Конец "Глобальной" функции вывода списка пользователей



     function create_messages() {//"Глобальная" функция вывода сообщений во вкладку Main
         /*Вывод сообщений во вкладку Main*/
         //GET-запрос на получение списка пользователей для вывода в сообщениях Имени по ID
         var user = {
             "username": name
         };
         var usersList1;
         var request1 = new XMLHttpRequest();
         request1.open('GET', 'https://studentschat.herokuapp.com/users', true);

         request1.onload = function () {
             // Обработчик успешного ответа
             var response1 = request1.responseText;
             usersList1 = JSON.parse(response1);

             //GET-запрос на получение сообщений

             var messageList;
             var request = new XMLHttpRequest();
             request.open('GET', 'https://studentschat.herokuapp.com/messages', true);

             request.onload = function () {
                 // Обработчик успешного ответа
                 var response = request.responseText;
                 messageList = JSON.parse(response);
                 var dayI=0;
                 messageList.forEach(
                     function (obj,i) {
                         var date = new Date(obj['datetime']);
                         var day = date.getDate();
                         var hours = date.getHours();
                         var minutes = date.getMinutes();
                         usersList1.forEach(function (obj2) {
                             if (obj['user_id'] == obj2['user_id']) {
                                 if (dayI < obj['datetime']) {
                                     document.getElementById('wrap_for_users_messages').innerHTML += '' +
                                         '<div>hhhhhhhhhhhhhhhhhhhhhhhkkkkkkkkkkkkkkkk</div>'+
                                         '<div class = "user_message users_messages_text" data-date = "' + obj["datetime"] + '">' +
                                         '<p class="user_message_name">' + obj2['username'] +
                                         '        <span class="user_message_date" >'+ hours + ':' + minutes + '</span>' +
                                         '</p>' +
                                         '<p class="user_message_text">' + obj['message'] + '</p>' +
                                         '</div>';
                                     scroll_to_end();

                                 }else {
                                     document.getElementById('wrap_for_users_messages').innerHTML += '' +
                                         '<div class = "user_message users_messages_text" data-date = "' + obj["datetime"] + '">' +
                                         '<p class="user_message_name ">' + obj2['username'] +
                                         '        <span class="user_message_date">'+hours + ':' + minutes + '</span>' +
                                         '</p>' +
                                         '<p class="user_message_text">' + obj['message'] + '</p>' +
                                         '</div>';
                                     scroll_to_end();
                                 }
                             }
                         });

                         return dayI;
                     });
                 interval_of_uploading_messages();
             };
             request.onerror = function () {
             };
             request.send(JSON.stringify(user));
         };
         request1.onerror = function () {
         };
         request1.send(JSON.stringify(user));

     }


    function uploading_new_messages() {
        date_of_last_message = document.getElementById('wrap_for_users_messages').lastChild.getAttribute('data-date');
        var user = {
            "username": name
        };
        var usersList1;
        var request1 = new XMLHttpRequest();
        request1.open('GET', 'https://studentschat.herokuapp.com/users', true);

        request1.onload = function () {
            // Обработчик успешного ответа
            var response1 = request1.responseText;
            usersList1 = JSON.parse(response1);

            //GET-запрос на получение сообщений

            var messageList;
            var request = new XMLHttpRequest();
            request.open('GET', 'https://studentschat.herokuapp.com/messages', true);

            request.onload = function () {
                // Обработчик успешного ответа
                var response = request.responseText;
                messageList = JSON.parse(response);
                messageList.filter(function (obj) {
                    var date = new Date(date_of_last_message);
                    var obj_date = new Date(obj['datetime']);
                    if (date.getTime() < obj_date.getTime()) {
                                var date = new Date(obj['datetime']);
                                var day = date.getDate();
                                var hours = date.getHours();
                                var minutes = date.getMinutes();
                                usersList1.forEach(function (obj2) {
                                    if (obj['user_id'] == obj2['user_id']) {
                                        document.getElementById('wrap_for_users_messages').innerHTML += '' +
                                            '<div class = "user_message users_messages_text" data-date = "' + obj["datetime"] + '">' +
                                            '<p class="user_message_name">' + obj2['username'] +
                                            '        <span class="user_message_date" >' + hours + ':' + minutes + '</span>' +
                                            '</p>' +
                                            '<p class="user_message_text">' + obj['message'] + '</p>' +
                                            '</div>';
                                    };
                                });
                        scroll_to_end();
                    };
                });
            };
            request.onerror = function () {
            };
            request.send(JSON.stringify(user));
        };
        request1.onerror = function () {
        };
        request1.send(JSON.stringify(user));
    }

    function interval_of_uploading_messages() {
        var interval_getting_new_messages = setInterval(uploading_new_messages,2000);
    }

    function scroll_to_end() {
        document.getElementById('wrap_for_users_messages').scrollTop = 9999; //автопрокрутка к концу сообщений
    }


     //подсчет кол-ва введенных символов
     var message_value;
     document.getElementById('type_message').addEventListener('keyup',counter_of_symbols);
     
     function counter_of_symbols() {

         var all_symbols = this.value.length;
         document.getElementById('all_symbols').innerText = all_symbols; //общее кол-во символов

         var regLetters = this.value.match(/[\wа-я]+/gi); //и буквы и цифры
            (regLetters !=null) ? regLetters = regLetters.join('').length : regLetters = 0;
         document.getElementById('letters').innerText = regLetters;

         var regEmpty = this.value.match(/\s/gi);
         (regEmpty !=null) ? regEmpty = regEmpty.join('').length : regEmpty = 0;
         document.getElementById('invisible_symbols').innerText = regEmpty;

         var regMarks = all_symbols - (regLetters+regEmpty);
         document.getElementById('punctuation_marks').innerText = regMarks;

         message_value = document.getElementById('type_message').value;
         if ((/^\s*$/).test(message_value))document.getElementById('send').style.opacity = '0.4';
         else document.getElementById('send').style.opacity = '1';

         return message_value;
         }

         //Жирный, Курсив, подчеркнутый
    document.getElementById('bold').addEventListener('click',bold, {capture:true});
    function bold() {
        document.getElementById('type_message').value += '<strong></strong>';
    }

    document.getElementById('italic').addEventListener('click',italic);
    function italic() {
        document.getElementById('type_message').value += '<em></em>';
    }

    document.getElementById('underline').addEventListener('click',underline);
    function underline() {
        document.getElementById('type_message').value += '<u></u>';
       console.log(start_of_session);
    }

     //отправка сообщения на сервер

     document.getElementById('send').addEventListener('click',sendMessage);
     function sendMessage() {
         var now = new Date();
         if (!(/^\s*$/).test(message_value)){
             var mess = {
                 "datetime": now,
                 "message": message_value,
                 "user_id": userId
             };
             var request2 = new XMLHttpRequest();
             request2.open('POST', 'https://studentschat.herokuapp.com/messages', true);
             request2.setRequestHeader('Content-Type', 'application/json');

             request2.onload = function () {
                 // Обработчик ответа в случае удачного соеденения
                 if (request2.status >= 200 && request2.status < 400) {
                     var res1 = JSON.parse(request2.responseText);
                     document.getElementById('type_message').value = '';
                 }
             }
             request2.onerror = function () {
             };

             request2.send(JSON.stringify(mess));
         }
     }






/*Назначить событие открытия вкладки сообщений при нажатии на юзера*/

    document.getElementById('users_list').addEventListener('click',findTarget);
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
        var g = userName[0].innerText;
        createClearTab(g);
    }

        // /*GET-запрос для вывода сообщений по пользователю target*/
            // var user = {
            //     "user_id": userDataId
            // };
            // var messageList;
            // var messages;
            // var currentMessage;
            // var request = new XMLHttpRequest();
            // request.open('GET', 'https://studentschat.herokuapp.com/messages', true);
            //
            // request.onload = function () {
            //     // Обработчик успешного ответа
            //     var response = request.responseText;
            //     messageList = JSON.parse(response);
            //     console.log(messageList);
            //     var userMessageActive = [];
            //     messageList.forEach(             //вывести cообщения по конкретному юзеру
            //         function (obj) {
            //             if (obj['user_id'] === +userDataId) {
            //                 messages = obj;
            //                 console.log(messages);
            //                 currentMessage = messages['message'];
            //                 console.log(currentMessage);
            //                 var child = document.getElementById('tabs').childNodes; console.log(child);
            //
            //                  // for (var i = 0; i < child.length; i++) {
            //                  //     var title = child[i].innerText;
            //                  //        if (title === g) {
            //                        createTab(currentMessage);
            //                  //         }
            //                  // }
            //
            //             }
            //             else createClearTab()
            //         });
            //
            // }
            // request.onerror = function () {
            //     //users_online.innerText = ' ';
            // };
            // request.send(JSON.stringify(user));

            function createTab(g) { //функция для открытия окна доалога с пользователем, где есть сообщения
                        document.getElementById('tabs').innerHTML += '<div class="tab">\n' +
                            '                                    <input type="radio" name="tab-group" id="'+g+'" checked>\n' +
                            '                                    <label for="'+g+'" class="tab-title" data-title="'+ g +'">' + g + '</label>\n' +
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
            function createClearTab(g) {
                document.getElementById('tabs').innerHTML += '<div class="tab">\n' +
                    '                                    <input type="radio" name="tab-group" id="'+ g +'" checked>\n' +
                    '                                    <label for="'+g+'" class="tab-title" data-title="'+ g +'">' + g + '</label>\n' +
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







