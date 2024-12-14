document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Отключаем отправку формы

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Проверка пользователя в LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        alert('Пользователь не найден!');
        return;
    }

    if (user.password !== password) {
        alert('Неверно введён логин и/или пароль!');
        return;
    }

    // Сохранение текущего пользователя и переход на страницу
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Вход выполнен успешно!');
    window.location.href = 'user.html'; // Переход на страницу пользователя
});
