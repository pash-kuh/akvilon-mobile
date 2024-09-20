interface IPriceInfo {
  priceType: string;
  price: {
    basePrice: number;
    clubPrice: number;
    discountPrice: number;
    discountValue: number;
    latestPrice: number;
    wholesalePrice: number;
  };
}

export const MathRoundPrice = (value: number) => {
  const val = value;

  if (Number.isNaN(val)) {
    console.error('Ты пытаешься округлить не число. Цена должна быть числом');
  } // Передали бяку
  if (val < 1 && val !== 0) {
    return val.toFixed(1);
  } // Цена менее единицы, не пытаемся ничего округлять. Только отрезаем лишние знаки после запятой. Иначе 5 шайб по пол тенге будут стоить 5 тенге, а не 3
  return Math.round(val); // Цена более единицы, делаем обычное округление
};

export const catalogItemPriceGenerator = ({
  discount = 0,
  basePrice = 0,
  clubPrice = 0,
  finalPrice = 0,
  type = 'base',
  wholesalePrice = 0,
}) => {
  const result: any = {};

  const discountPrice = MathRoundPrice((basePrice * (100 - discount)) / 100);
  result.priceType = type;
  if (wholesalePrice && wholesalePrice <= basePrice) {
    result.priceType = 'wholesale';
  }

  result.price = {
    basePrice,
    discountPrice: wholesalePrice || discountPrice,
    clubPrice,
    latestPrice: finalPrice,
    discountValue: discount,
  };

  return result;
};
export const spaseOnPrice = (value: number | string): string => {
  // Получаем индекс символа, начиная с которого нужно разделить строку
  const index = value.toString().length - 3;
  // Вставляем разделитель после третьего символа с конца
  const result =
    value.toString().slice(0, index) + ' ' + value.toString().slice(index);
  return result;
};
