const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const request = require('request');

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const apiKey = '8e071f12efc25a5b8642583d1c49d9e1';

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                const $knots = Math.round(weather.wind.speed * 1.944).toFixed(1);

                let weatherDegrees= `It's ${weather.main.temp} degrees Celcius in ${weather.name}!`;
                let weatherWind= `The windspeed is ${$knots} in knots!`;

                res.render('index', {weather: weatherDegrees, test: weatherWind, error: null});
            }
        }
    });
});

module.exports = app;
app.listen(10308);