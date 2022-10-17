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

    // Проверка чтобы стоимость не была больше максимальной и меньше минимальной
    let cost = +cleaveCost.getRawValue();
    if (cost > maxPrice) {
        cost = maxPrice;
    }
    
    if (cost < minPrice) {
        cost = minPrice;
    }

    // Проверка чтобы DownPayment не был больше максимума и меньше минимума
    let DownPayment = +cleaveDownPayment.getRawValue();
    if (DownPayment > maxPrice * 0.9) {
        DownPayment = maxPrice * 0.9;
    }

    if (DownPayment < minPrice * 0.15) {
        DownPayment = minPrice * 0.15;
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
    behaviour: 'snap',
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

    // Зависимость границ DownPayment от стоимости
    const value = +cleaveCost.getRawValue();
    const percentMin = value * 0.15;
    const percentMax = value * 0.90;
    sliderDownPayment.noUiSlider.updateOptions({
        range: {
            min: percentMin,
            max: percentMax,
        }
    })    
    
    // Пересчёт значения в форме DownPayment
    const sliderDownPaymentValue = parseInt(sliderDownPayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderDownPaymentValue);

    calcMortgage();
});

// Slider DownPayment
const sliderDownPayment = document.getElementById('slider-downpayment');

noUiSlider.create(sliderDownPayment, {
    start: 3000000,
    behaviour: 'snap',
    connect: 'lower',
    //tooltips: true,
    step: 100000,
    range: {
        'min': 1800000,
        '50%': [10000000, 1000000],
        'max': 10800000,
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    }),
});


sliderDownPayment.noUiSlider.on('slide', function () {
    const sliderValue = parseInt(sliderDownPayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderValue);
    calcMortgage();
});

// Slider Term
const sliderTerm = document.getElementById('slider-term');

noUiSlider.create(sliderTerm, {
    start: 15,
    behaviour: 'snap',
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
    if (value > maxPrice || value < minPrice) {
        inputCost.closest('.param__details').classList.add('param__details--error');
        inputDownPayment.closest('.param__details').classList.add('param__details--error');
    }

    if (value <= maxPrice || value <= minPrice) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
    }

    // Зависимость начального взноса от стоимости
    const percentMin = value * 0.15;
    const percentMax = value * 0.90;

    sliderDownPayment.noUiSlider.updateOptions({
        range: {
            min: percentMin,
            max: percentMax,
        }
    })

    // Пересчёт значения в форме DownPayment
    const sliderDownPaymentValue = parseInt(sliderDownPayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderDownPaymentValue);
});

inputCost.addEventListener('change', function () {
    const value = +cleaveCost.getRawValue();
    if (value >= maxPrice) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
        cleaveCost.setRawValue(maxPrice);

        // Зависимость границ DownPayment от стоимости
        const percentMin = maxPrice * 0.15;
        const percentMax = maxPrice * 0.90;
        sliderDownPayment.noUiSlider.updateOptions({
            range: {
                min: percentMin,
                max: percentMax,
        }
        })
        calcMortgage();
    }

    if (value <= minPrice) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
        cleaveCost.setRawValue(minPrice);

        // Зависимость границ DownPayment от стоимости
        const percentMin = minPrice * 0.15;
        const percentMax = minPrice * 0.90;
        sliderDownPayment.noUiSlider.updateOptions({
            range: {
                min: percentMin,
                max: percentMax,
        }
        })
        calcMortgage();
    }

    // Пересчёт значения в форме DownPayment
    const sliderDownPaymentValue = parseInt(sliderDownPayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderDownPaymentValue);
});

// Форматирование inputDownPayment
inputDownPayment.addEventListener('input', function () {
    const valueCost = +cleaveCost.getRawValue();
    const valueDownPayment = +cleaveDownPayment.getRawValue();
    

    sliderDownPayment.noUiSlider.set(valueDownPayment);

    if (valueDownPayment > valueCost * 0.9 || valueDownPayment < valueCost * 0.15) {
        inputDownPayment.closest('.param__details').classList.add('param__details--error');
    }

    /*if (valueDownPayment <= valueCost * 0.9 || valueDownPayment >= valueCost * 0.15) {
        console.log('True');
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
    }*/
});

inputDownPayment.addEventListener('change', function () {
    const valueCost = +cleaveCost.getRawValue();
    const valueDownPayment = +cleaveDownPayment.getRawValue();

    if (valueDownPayment >= valueCost * 0.9) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
        cleaveDownPayment.setRawValue(valueCost * 0.9);

        calcMortgage();
    }

    if (valueDownPayment <= valueCost * 0.15) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        inputDownPayment.closest('.param__details').classList.remove('param__details--error');
        cleaveDownPayment.setRawValue(valueCost * 0.15);

        calcMortgage();

    }
});
