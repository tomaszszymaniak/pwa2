//Pobierz wszystkie elementy html, które mają być wykorzystywane w JS i przypisz je do zmiennych (15 zmiennych)
const input = document.querySelector('input')
const button = document.querySelector('button')
const errorMsg = document.querySelector('p.error_message')
const cityName = document.querySelector('h2.city_name')
const weatherImg = document.querySelector('img.weather_img')
const temp = document.querySelector('span.temp')
const weatherDescription = document.querySelector('p.weather_description')
const feelsLike = document.querySelector('span.feels_like')
const pressure = document.querySelector('span.pressure')
const humidity = document.querySelector('span.humidity')
const windSpeed = document.querySelector('span.wind_speed')
const clouds = document.querySelector('span.clouds')
const visibility = document.querySelector('span.visibility')
const pollutionImg = document.querySelector('img.pollution_img')
const pollutionValue = document.querySelector('span.value')

const apiInfo = {
    link : 'https://api.openweathermap.org/data/2.5/weather?q=',
    key : '&appid=7dc1e3959907f252891451585f715299',
    units : '&units=metric',
    lang : '&lang=pl'
}

const getWeather = () => {
    const apiInfoCity = input.value;
    const apiURL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`
    console.log(apiURL);

    axios.get(apiURL).then((response) => {
        console.log(response.data);
        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        //Uzupełnić wszystkie dane pogodowe razem z jednostkami. Zaokrąglić do liczb całkowitych temperature i prędkość wiatru
        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        weatherDescription.textContent = `${response.data.weather[0].description}`;
        temp.textContent = `${Math.round(response.data.main.temp)}℃`;
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)}℃`;
        humidity.textContent = `${response.data.main.humidity}%`;
        pressure.textContent = `${response.data.main.pressure}hPa`;
        windSpeed.textContent = `${Math.round(response.data.wind.speed * 3.6)}km/h`;
        clouds.textContent = `${response.data.clouds.all}%`;
        visibility.textContent = `${response.data.visibility / 1000}km`;
        errorMsg.textContent = '';

        //Dodać zmienną przechowującą link do pollution API, i pobrać dane o zanieczyszczeniu pyłami pm 2.5

        const pollutionURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${apiInfo.key}`;
        // console.log(pollutionURL);

        axios.get(pollutionURL).then(response => {
            console.log(response);
            pollutionValue.textContent = `${response.data.list[0].components.pm2_5}`;
            const pollutionValueNumber = response.data.list[0].components.pm2_5

            if (pollutionValueNumber < 10) {
                pollutionImg.style.backgroundColor = 'green';
            } else if (pollutionValueNumber >= 10 && pollutionValueNumber < 25) {
                pollutionImg.style.backgroundColor = 'yellowgreen';
            } else if (pollutionValueNumber >= 25 && pollutionValueNumber < 50) {
                pollutionImg.style.backgroundColor = 'yellow';
            } else if (pollutionValueNumber >= 50 && pollutionValueNumber < 75) {
                pollutionImg.style.backgroundColor = 'orange';
            } else {
                pollutionImg.style.backgroundColor = 'red';
            }
        })

    }).catch(error => {
        // console.log(error);
        errorMsg.textContent = `${error.response.data.message}`;
        [cityName, temp, weatherDescription, feelsLike, pressure, humidity, clouds, visibility, pollutionValue, windSpeed].forEach(el => {
            el.textContent = '';
        })
        weatherImg.src = '';
        pollutionImg.style.backgroundColor = 'transparent';

    }).finally(() => {
        input.value = '';
    })
}

button.addEventListener('click', getWeather);