import {priceFormatter} from './formatters.js'

const maxPrice = 100000000;
const minPrice = 375000;

// Инпуты
const inputCost = document.querySelector('#input-cost');
const inputDownPayment = document.querySelector('#input-downpayment');
const inputTerm = document.querySelector('#input-term');

const form = document.querySelector('#form');
const totalCost = document.querySelector('#total-cost');
const totalMonthPayment = document.querySelector('#total-month-payment');

// Cleave опции форматирования
const cleavePriceSettings = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' '
};

// Запускаем форматирование Cleave
const cleaveCost = new Cleave(inputCost, cleavePriceSettings);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSettings);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSettings);

// Сумма кредита
calcMortgage();

// Отображение и расчёт суммы кредита
form.addEventListener('input', function () {
    // Сумма кредита
    calcMortgage()
})

function calcMortgage() {

    // Проверка чтобы стоимость не была больше максимальной
    let cost = +cleaveCost.getRawValue();
    if (cost > maxPrice) {
        cost = maxPrice;
    }

    let DownPayment = cleaveDownPayment.getRawValue();
    if (DownPayment > maxPrice * 0.9) {
        DownPayment = maxPrice * 0.9;
    }

    // Общая сумма кредита
    const totalAmount = cost - DownPayment;
    totalCost.innerText = priceFormatter.format(totalAmount);
    
    // Ставка по кредиту
    const creditRate = +document.querySelector('input[name="program"]:checked').value;
    const monthRate = creditRate / 12;

    // Срок ипотеки в годах
    const years = +cleaveTerm.getRawValue();
    const months = years * 12;

    // Расчёт ежемесячного платежа
    const monthPayment = (totalAmount * monthRate) / (1 - Math.pow(1 + monthRate, -months));

    // Отображение ежемесячного платежа
    totalMonthPayment.innerText = priceFormatter.format(monthPayment);
}

// Slider Cost
const sliderCost = document.getElementById('slider-cost');

noUiSlider.create(sliderCost, {
    start: 12000000,
    connect: 'lower',
    //tooltips: true,
    step: 10000,
    range: {
        'min': 370000,
        '5%': [1000000, 100000],
        '50%': [10000000, 1000000],
        'max': 100000000,
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    }),
});


sliderCost.noUiSlider.on('slide', function () {
    const sliderValue = parseInt(sliderCost.noUiSlider.get(true));
    cleaveCost.setRawValue(sliderValue);
    calcMortgage();
});

// Slider DownPayment
const sliderDownPayment = document.getElementById('slider-downpayment');

noUiSlider.create(sliderDownPayment, {
    start: 1000000,
    connect: 'lower',
    tooltips: true,
    step: 100000,
    range: {
        'min': 100000,
        '50%': [10000000, 1000000],
        'max': 90000000,
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    }),
});


sliderDownPayment.noUiSlider.on('update', function () {
    const sliderValue = parseInt(sliderDownPayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderValue);
    calcMortgage();
});

// Slider Term
const sliderTerm = document.getElementById('slider-term');

noUiSlider.create(sliderTerm, {
    start: 15,
    connect: 'lower',
    tooltips: true,
    step: 1,
    range: {
        'min': 1,
        'max': 30,
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    }),
});


sliderTerm.noUiSlider.on('update', function () {
    const sliderValue = parseInt(sliderTerm.noUiSlider.get(true));
    cleaveTerm.setRawValue(sliderValue);
    calcMortgage();
});

// Форматирование inputCost
inputCost.addEventListener('input', function () {
    const value = +cleaveCost.getRawValue();

    // Обвновление range slider
    sliderCost.noUiSlider.set(value);
    sliderDownPayment.noUiSlider.set(value * 0.15);

    // Проверки на max и min цену
    if (value > maxPrice || value < minPrice) inputCost.closest('.param__details').classList.add('param__details--error');
    if (value <= maxPrice || value < minPrice) inputCost.closest('.param__details').classList.remove('param__details--error');

    // Зависимость начального взноса от стоимости
    const percentMin = value * 0.15;
    const percentMax = value * 0.90;

    sliderDownPayment.noUiSlider.updateOptions({
        range: {
            min: percentMin,
            max: percentMax,
        }
    })
});

inputCost.addEventListener('change', function () {
    const value = +cleaveCost.getRawValue();
    if (value >= maxPrice || value <= minPrice) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        cleaveCost.setRawValue(maxPrice);
        calcMortgage();
    }
});
