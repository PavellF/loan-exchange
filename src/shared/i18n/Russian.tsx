import React from 'react';
import {PaymentInterval} from "../model/payment-interval";

export default {
  genericDeleteError: "Ошибка при удалении.",
  noItems: "Пусто",
  seeProblem: "Перейти",
  remove: "Удалить",
  notifications: "Уведомления",
  creditStatistic: "Статистика",
  dealDeletionSuccess: "Займ успешно удален.",
  dealDeletionFail: "Ошибка при попытке удаления, возможно займ уже был кем то взят.",
  loanTakenSuccess: "Займ успешно взят.",
  logsLoading: "Загрузка истории.",
  logsLoadFail: "Не удалось загрузить историю.",
  balance: "Баланс",
  change: "Изменение",
  allTime: "Все время",
  active: "Активен",
  requestToWithdraw: "Запрос на вывод",
  refill: "Пополнить",
  overallIncoming: "Всего поступлений",
  loanPayments: "Платежи по займам",
  year: "Год",
  day: "день",
  thirtyDays: "30 дней",
  LogsTab: {
    LOGS: "История",
    GRAPH: "График",
  },
  loanTakeFail: "Невозможно взять займ, возможно он был уже кем то взят.",
  BalanceLogEvent: {
    NEW_DEAL_OPEN: 'Открыт новый займ',
    LOAN_TAKEN: 'Займ взят',
    PERCENT_CHARGE: 'Начисление процента',
    DEAL_PAYMENT: 'Платеж по займу',
    DEAL_CLOSED: 'Займ закрыт'
  },
  dealFetchError: "Не удалось загрузить займ, попробуйте позже.",
  takeLoan: "Взять",
  amount: "Сумма",
  revenue: "Прибыль",
  rate: "Процент",
  term: "Срок",
  dateOpen: "Дата открытия",
  dateBecomeActive: "Дата взятия",
  loanDetails: "Параметры",
  averagePayment: "Средний платеж",
  successRate: "Вероятность успеха",
  paymentsOverall: "Всего выплат",
  difference: "Разница",
  search: "Поиск",
  DealStatus: {
    PENDING: 'В ожидании',
    ACTIVE: 'Активно',
    CLOSED: 'Закрыто',
    SUCCESS: 'Погашено'
  },
  perTemporal: (unit: PaymentInterval): string => {
    if (unit === PaymentInterval.MONTH) {
      return "в месяц";
    } else if (unit === PaymentInterval.DAY) {
      return "в день";
    } else {
      return "за все время"
    }
  },
  temporal: (unit: PaymentInterval): string => {
    if (unit === PaymentInterval.MONTH) {
      return "месяц";
    } else {
      return "день";
    }
  },
  LoanOverview: {
    dealsFetchError: "Не удалось загрузить сделки, попробуйте позже.",
    dealSearch: "Поиск кредита",
    instantDeal: "Быстрый займ",
    deal: "Займ",
    dealLoading: "Идет загрузка",
    newDeal: "Новая сделка",
  },
  LoanListCard: {
    searchTab: "Поиск",
    activeTab: "Активные",
    pending: "В ожидании",
    all: "Все",
  },
  CreateLoanSteps: {
    allowedToSpend: "Доступно для использования",
    refill: "Пополнить",
    amountToLend: "Сколько отдать в долг",
    setRate: "Установите процент",
    oneTime: "За все время",
    day: "В день",
    month: "В месяц",
    expectedProfit: "Ожидаемая прибыль",
    fee: "Коммисия",
    successRate: "Вероятность успеха",
    lengthOfTerm: (unit: string) => unit === 'month' ? "Срок займа месяцев" : "Срок займа дней",
    perTemporal: (unit: PaymentInterval): string => {
      if (unit === PaymentInterval.MONTH) {
        return "в месяц";
      } else if (unit === PaymentInterval.DAY) {
        return "в день";
      } else {
        return "за все время"
      }
    },
    temporal: (unit: PaymentInterval): string => {
      if (unit === PaymentInterval.MONTH) {
        return "месяц";
      } else {
        return "день";
      }
    },
    endDate: "Дата окончания",
    averagePayment: "Средняя прибыль",
    amount: "Сумма",
    revenue: "Прибыль",
    rate: "Процент",
    term: "Срок",
    previous: "Назад",
    next: "Далее",
    done: "Разместить",
    summary: "Подтверждение",
    sendingError: "Невозможно создать сделку, попробуйте позже.",
    noMoney: "На балансе не достаточно средств для открытия сделки."
  },
  AuthFlow: {
    signIn: "Войти",
    usingAccount: 'Используя аккаунт loanExchange',
    createAccountLabel: 'Создать аккаунт loanExchange',
    orLoginWith: 'Или войдите используя',
    createAccount: 'Создать аккаунт',
    next: 'Далее',
    welcome: 'Добро пожаловать',
    passwordRequired: 'Необходимо ввести пароль.',
    passwordMin: (min: number) => `Пароль должен содержать хотя бы ${min} символов`,
    passwordMax: (max: number) => `Пароль не может быть длинее чем ${max} символов`,
    passwordPlaceholder: 'Пароль',
    emailRequired: 'Введите e-mail',
    emailPattern: 'Неверный формат e-mail',
    selectRole: 'Выберите тип аккаунта',
    creditor: 'Инвестор',
    creditorDesc: 'Выдает займы и зарабатывает с процента. Насколько велик процент полностью определяет инвестор.',
    debtor: 'Заемщик',
    confirmPassword: 'Подтвердите пароль',
    debtorDesc: <>Берет займы у инвестора и платит по ним проценты.<br/>Займ выбирается из предложенных вариантов по сроку и значению процента.</>,
    resetPasswordSuccess: 'Проверьте ваш email для подробной информации о том, как сбросить пароль.',
    resetPasswordFailure: <><strong>Email адрес не зарегистрирован!</strong> Пожалуйста проверьте и попробуйте снова</>,
    registrationSuccess: <strong>Регистрация успешна!</strong>,
    registrationFailure: <><strong>Ошибка при регистрации!</strong> Пожалуйста, попробуйте позже.</>,
    loginError: <><strong>Не удалось войти!</strong> Пожалуйста, проверьте ваши учетные данные и попробуйте еще раз.</>,
    firstName: 'Имя',
    firstNameRequired: 'Введите имя',
    firstNameMin: (min: number) => `Минимальная длина имени ${min} символов`,
    firstNameMax: (max: number) => `Имя не должно быть длиннее ${max} символов`,
    lastName: 'Фамилия',
    lastNameRequired: 'Введите фимилию',
    lastNameMin: (min: number) => `Минимальная длина фамилии ${min} символов`,
    lastNameMax: (max: number) => `Фамилия не должна быть длиннее ${max} символов`,
    email: 'E-mail',
    passwordEquality: 'Пароли должны совпадать',
    passwordStrengthMessage: "Используйте 6 или более символов среди которых буквы, числа и символы.",
    captcha: "Проверка",
    getCaptcha: "Загрузить картинку",
    captchaExtra: "Мы должны убедится что вы не робот.",
    captchaRequired: 'Введите символы с картинки которую вы получили',
    iHaveRead: 'Я прочитал ',
    agreement: 'соглашение',
    signInInstead: 'Вернутся и войти',
    register: 'Зарегистрироватся',
    legalLabel: 'Соглашение',
    forgotPassword: "Забыли пароль?",
    legal: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at viverra tortor. Fusce euismod vehicula ante non iaculis. Quisque non lectus sed ante luctus mollis vel a nisl. Aenean vestibulum consectetur fringilla. Cras aliquam, sem ut suscipit sodales, justo arcu posuere nibh, vitae fringilla velit odio sit amet diam. Phasellus vestibulum maximus tincidunt. Duis ligula lacus, porttitor a ex sollicitudin, pharetra hendrerit enim. Maecenas rhoncus odio non molestie vulputate. Nulla non arcu hendrerit turpis interdum consectetur ac varius dolor. Vivamus vel tristique nisi. Nunc vitae erat nunc. Quisque vehicula non urna eu maximus.\\n\\nSuspendisse iaculis purus eget ipsum scelerisque, eu dapibus metus laoreet. Praesent gravida magna quis dui semper commodo. Vestibulum elementum accumsan magna, eu molestie neque semper sit amet. In hac habitasse platea dictumst. Sed sit amet gravida ligula, eget sollicitudin orci. Curabitur vehicula, nunc vel pretium ornare, ligula turpis laoreet dolor, sit amet posuere enim libero in nisi. Mauris est ipsum, egestas nec arcu quis, bibendum gravida tortor. Fusce convallis et nunc auctor convallis. Sed sagittis euismod diam, at suscipit ex tempus vehicula. Aenean euismod mauris ac accumsan pharetra. Praesent non sagittis eros. Donec ac posuere urna, non sollicitudin felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat eleifend tellus, vel mattis odio semper et.\\n\\nProin sagittis in elit ac sagittis. Praesent at venenatis lorem. Aliquam nec metus at sapien ultricies dignissim. Cras id purus et magna tincidunt rutrum eget at metus. Cras metus est, lacinia nec lectus in, tristique porta velit. Etiam accumsan aliquam pretium. Aenean eget blandit velit, quis finibus urna. Nullam pretium pretium magna. Sed ultricies eros dignissim, luctus nisl vitae, ultricies orci. In sodales nulla at lorem finibus vulputate. Aenean sit amet tempor elit. Suspendisse auctor, quam vitae laoreet venenatis, enim neque ullamcorper urna, id fringilla nunc mi eu odio. Mauris at luctus dui.\\n\\nIn ac risus nibh. Cras vitae purus fermentum, vehicula magna in, elementum libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in enim in est dictum viverra. Vestibulum dapibus consectetur nulla, ut faucibus nunc egestas in. Sed laoreet feugiat neque vel faucibus. Nulla pretium enim id ultrices tristique. Aenean non nisi magna. Vivamus et lacinia arcu, vel elementum enim.\\n\\nVestibulum eget commodo sapien, in hendrerit sem. Aenean bibendum nisi non metus porta rutrum. Duis et arcu massa. Pellentesque ullamcorper tellus ut arcu dapibus mattis. Pellentesque feugiat diam sed turpis ullamcorper tempus. Sed imperdiet quis neque in aliquam. Nam maximus id nisi ac cursus. Donec feugiat pulvinar dolor ut imperdiet. Etiam a scelerisque nisi.\\n\\nSed turpis tellus, dignissim sit amet rhoncus vitae, gravida eu magna. Sed non metus risus. Duis imperdiet urna sed sem varius, eu luctus magna bibendum. Proin semper massa odio, quis faucibus velit rhoncus ac. In vitae blandit magna, sed egestas ex. Quisque viverra nibh ac porta pretium. Sed sit amet diam et felis imperdiet ullamcorper. Aliquam erat volutpat. Sed gravida aliquam pretium. Donec commodo placerat lectus, a consectetur tortor blandit eu. Duis eu dictum orci. Suspendisse sollicitudin, ex ut vulputate vulputate, sem nisi congue massa, vitae euismod metus tellus ut dui. Morbi efficitur, justo nec varius hendrerit, purus lorem euismod eros, at varius augue leo non dolor. Suspendisse eleifend felis at odio mattis interdum. In tincidunt vitae nibh ut euismod.\\n\\nNunc vitae eros eget purus volutpat luctus ut nec lorem. Vestibulum egestas ultricies varius. Nullam facilisis convallis dolor, vel porttitor magna volutpat sit amet. Nulla facilisi. In quis fringilla justo, vel interdum massa. Nunc scelerisque vel elit eget porttitor. Nullam velit ex, lobortis at erat at, interdum ultrices ex. Donec tempus, libero laoreet placerat volutpat, sem urna condimentum tortor, quis pellentesque nulla est semper turpis. Aliquam laoreet vel dui nec lobortis. Aenean at tortor mattis arcu eleifend hendrerit et sit amet orci. Duis arcu odio, sodales nec egestas non, convallis sed felis. Nullam eu quam mattis arcu ultrices placerat. Vestibulum tellus enim, dictum quis dolor eget, volutpat elementum dolor. Vivamus scelerisque fringilla lacus, quis dignissim enim. Sed vitae felis quis ex ornare consequat id vitae lorem. Cras lacus arcu, rhoncus quis ex eget, vestibulum vulputate nunc.\\n\\nDonec eu neque in leo imperdiet cursus sed a mi. Curabitur suscipit ac nulla non blandit. Quisque ut mi in nisl tincidunt bibendum. Nunc mauris tortor, efficitur at odio eu, lobortis efficitur ipsum. Phasellus molestie porta lacus, sed semper enim congue nec. Integer dignissim nec tellus a faucibus. Maecenas rutrum vehicula aliquam. Duis suscipit dolor efficitur tincidunt auctor. Aenean sed accumsan felis. Aliquam pharetra lorem enim, vel commodo libero molestie at. Proin eget bibendum mauris. Nullam laoreet velit ipsum, ac lobortis ante pellentesque non. Morbi accumsan pulvinar mauris sed posuere. Integer quis dolor vitae dui viverra finibus ut at est. Curabitur non pharetra velit.\\n\\nAenean scelerisque nulla eget varius scelerisque. Ut dui sapien, gravida in nunc vitae, ultricies scelerisque tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis sodales dui in ante molestie volutpat. Nunc blandit nibh eget turpis vulputate semper. Suspendisse rutrum nulla nisl, nec auctor mi congue ut. Donec eros mi, pulvinar vel sollicitudin eu, dapibus ac mi. Fusce vitae diam vel lacus facilisis ultrices. Nam et nisl sit amet purus vulputate elementum. Sed et nisi mauris. Pellentesque mattis lacus at justo vestibulum, ut bibendum lorem tincidunt.\\n\\nMorbi ut urna erat. Nulla volutpat lacus vel ligula dictum euismod. Curabitur id facilisis ex. Ut consequat erat at turpis gravida fermentum. Ut non nisl non velit mollis lobortis ut at magna. Donec condimentum porta quam. Nulla porta et lacus at facilisis. Aenean ut vehicula arcu, eget maximus odio. In laoreet lacus quis libero cursus egestas. Proin mattis mauris quis tristique lobortis. Praesent pellentesque metus purus, non ultrices velit suscipit et. Nam eleifend lectus nibh, bibendum dapibus ligula rhoncus mollis.\\n\\nQuisque consequat mattis ipsum, ac malesuada tellus. Nulla facilisi. Aliquam rutrum volutpat quam, eu rutrum erat mattis ut. Pellentesque maximus aliquam purus bibendum porttitor. Phasellus iaculis id elit quis convallis. Praesent purus dui, sodales a mi non, congue facilisis justo. Aliquam sodales neque velit, ut pretium sapien euismod quis. Nulla pulvinar rhoncus elementum. Integer gravida facilisis nibh, ut tincidunt metus accumsan in. Cras non interdum sapien. Curabitur ipsum magna, vehicula vitae dolor eget, feugiat dapibus dui. Curabitur risus ante, congue ac erat sit amet, viverra iaculis ex. Nulla eget ex bibendum, sagittis justo vitae, interdum felis. In et accumsan nisl. Nullam ornare mi tincidunt tincidunt lobortis.\\n\\nQuisque faucibus mi in lorem lobortis, eu tempus massa commodo. Ut elementum rhoncus dictum. Fusce vestibulum rhoncus ante, sit amet suscipit lectus commodo at. Aliquam viverra malesuada ligula vitae tincidunt. Vivamus pellentesque ut sem at posuere. Sed eget auctor lectus. Cras in placerat orci. Fusce urna felis, porta sit amet posuere sit amet, commodo vehicula nunc. Duis dapibus sit amet est sed venenatis. Nam quis purus tellus. Integer bibendum tincidunt commodo. Morbi pulvinar justo et faucibus facilisis. Etiam vel molestie dolor, vel blandit sapien. Aenean pretium condimentum dolor, sed convallis justo gravida id. Sed sed dignissim erat.\\n\\nMaecenas consequat lacus eu eros aliquam ornare. Integer diam purus, ultricies sit amet dolor a, vulputate lacinia orci. Sed a turpis eros. Praesent ac magna a justo sollicitudin consectetur. Praesent id mi a justo euismod varius ut eu arcu. Sed aliquet odio id est venenatis, sit amet blandit felis posuere. Ut vitae ultricies lectus. Nullam quis erat placerat, dignissim dolor et, scelerisque eros. Quisque ornare dolor fermentum, lobortis quam sit amet, viverra nisi. Donec nunc orci, tincidunt non consequat at, dignissim ultricies lacus. Cras elementum ultrices massa, ac aliquet augue sagittis non. In auctor viverra gravida. Aliquam auctor mi ex, non gravida odio pharetra eu. Aenean vitae faucibus arcu.\\n\\nMaecenas vehicula ante non pretium tincidunt. Phasellus accumsan orci convallis aliquam euismod. Quisque consequat sem nibh, lacinia vehicula lacus eleifend eget. Sed luctus sodales quam, nec sodales mi pretium in. Duis non mi non ligula feugiat gravida et eget augue. Nullam mollis nisl vel congue pellentesque. Nunc ornare lobortis feugiat. Curabitur faucibus ultrices pulvinar. Etiam vel augue tristique, dictum dui in, consectetur lectus. Nam turpis mauris, gravida vitae diam quis, lacinia convallis dolor. Sed et velit ut dolor interdum condimentum vel sollicitudin urna. Aliquam erat volutpat. Vivamus vitae auctor lorem, sed fermentum mauris.\\n\\nAenean ultricies massa justo, sed sollicitudin nisi commodo nec. Quisque commodo, dui eu mollis aliquam, purus leo aliquam odio, at accumsan nisi mi in lorem. Maecenas lacinia lectus sit amet risus pulvinar, vitae commodo tellus elementum. Aliquam tempor, risus et placerat sagittis, neque dolor fringilla magna, in molestie nibh velit nec augue. Praesent convallis dui non elit interdum, eu congue mauris aliquet. Phasellus eget aliquam mauris. Etiam gravida lorem sed felis aliquam, in dignissim erat interdum. In sed erat enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    resetPassword: 'Сброс пароля',
    resetRequest: 'Запрос на сброс пароля',
    resetRequestSuccess: 'Пароль успешно сброшен'
  },
  LocaleMenu: {
    allLanguages: 'все языки...',
    language: 'Язык'
  },
  Footer: {
    goUp: 'Вверх',
    logout: 'Выход'
  },
};
