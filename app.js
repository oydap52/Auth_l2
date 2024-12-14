const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Обработка регистрации
app.post("/save", (req, res) => {
    const { username, email, birthdate, gender, password } = req.body;

    // Чтение файла пользователей
    fs.readFile("users.json", "utf8", (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        // Проверка, существует ли пользователь с таким логином
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            // Если пользователь с таким логином уже существует
            return res.status(400).send("Пользователь с таким логином уже существует.");
        }

        // Создание нового пользователя с датой регистрации
        const newUser = {
            username,
            email,
            birthdate,
            gender,
            password,
            registrationDate: new Date().toLocaleString("ru-RU", { 
                timeZone: "Europe/Moscow", 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
            })
        };

        // Добавление нового пользователя в массив
        users.push(newUser);

        // Запись обновлённого массива пользователей в файл
        fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Ошибка сохранения:", err);
                res.status(500).send("Ошибка сервера.");
            } else {
                // Перенаправление на страницу профиля с данными
                res.redirect(`/4.html?username=${username}&email=${email}&birthdate=${birthdate}&gender=${gender}&registrationDate=${newUser.registrationDate}`);
            }
        });
    });
});

// Обработка входа
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            res.status(500).send("Ошибка сервера.");
            return;
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.redirect(`/4.html?username=${user.username}&email=${user.email}&birthdate=${user.birthdate}&gender=${user.gender}&registrationDate=${user.registrationDate}`);
        } else {
            res.send("Неверное имя пользователя или пароль.");
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
