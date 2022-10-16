 // 4,752%
export const percentFormatter = new Intl.NumberFormat('ru-RU',
    {
        style: 'percent',
        maximumFractionDigits: 3
    }
);

// 7 000 000 P
export const priceFormatter = new Intl.NumberFormat('ru-RU',
    {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
    }
);

// 7 000 000,00 P
/* export const priceFormatterDecimals = new Intl.NumberFormat('ru-RU',
    {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
    }
); */