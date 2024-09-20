export type validationType = {
  phone: string;
  password: string;
  sms: string;
  bool: boolean;
};
type ValidObject = {
  [name in keyof validationType]: ValidFunction<name>;
};
type ValidFunction<T extends keyof validationType> = (
  value: validationType[T],
) => string;

const valid: ValidObject = {
  phone: (value) => {
    const regex = new RegExp('[+]7 [(]\\d{3}[)] \\d{3} \\d{2} \\d{2}', 'g');
    if (value.length === 0) {
      return 'Введите номер телефона';
    }
    if (!regex.test(value)) {
      return 'Телефон введен неверно';
    }
    return '';
  },
  password: (value) => {
    if (value.length === 0) {
      return 'Введите пароль';
    }
    return '';
  },
  sms: (value) => {
    if (value.length === 0) {
      return 'Введите код из SMS';
    }
    return '';
  },
  bool: (value) => {
    if (!value) {
      return 'Пожалуйста, ознакомьтесь с условиями';
    }
    return '';
  },
};

export default async <T extends keyof validationType>(
  type: T,
  value: validationType[T],
): Promise<string> => {
  return valid[type](value);
};
