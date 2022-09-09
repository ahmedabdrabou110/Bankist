'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//! BANKIST APP

//! Data
const account1 = {
  owner: 'Ahmed Abdrabou',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account2 = {
  owner: 'Mohamed Sayed',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, // %
  pin: 2222,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account3 = {
  owner: 'Abdo Elsayed',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7, // %
  pin: 3333,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account4 = {
  owner: 'Ahmed Mahmoud',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1, // %
  pin: 4444,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const accounts = [account1, account2, account3, account4];

//! Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//! UPADTE UI

const updateUI = function (currentAccount) {
  displayMovements(currentAccount);

  //* display balance
  calculateBalance(currentAccount);

  //* diaplay summary
  calculateBalanceSummary(currentAccount);
};

//! Settings Timer

const timerLoggedOut = function () {
  let time = 300;

  const timer = setInterval(function () {
    let minute = String(Math.trunc(time / 60)).padStart(2, '0');
    let seconds = String(Math.trunc(time % 60)).padStart(2, '0');
    labelTimer.textContent = `${minute}:${seconds}`;

    time--;

    if (time == 0) {
      clearInterval(timer);
      opacityApp(0);
      labelWelcome.textContent = `Log in to get started`;
    }
  }, 1000);
};

//! Format Date

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

//! format of movements
const formatCurrency = function (movement, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(movement);
};
//! display the movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

//! Create the function that make username

const createUserName = function (accounts) {
  accounts.forEach(account => {
    account.user = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

//! Create the function that calculate the balance

const calculateBalance = function (account) {
  account.balance = account.movements.reduce(
    (movement, accumulator) => movement + accumulator,
    0
  );
  labelBalance.textContent = `${account.balance} €`;
};

// calculateBalance(account1.movements);

//! Create the function that calculate summary of income and outcome

const calculateBalanceSummary = function (account) {
  //* Income
  const income = account.movements
    .filter(movement => movement > 0)
    .reduce((movement, accumulator) => movement + accumulator);

  labelSumIn.textContent = `${income}€`;

  //* Outcome
  const outcome = account.movements
    .filter(movement => movement < 0)
    .reduce((movement, accumulator) => movement + accumulator, 0);

  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  //* Interest

  const interset = account.movements
    .filter(movement => movement > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter(rate => rate >= 1)
    .reduce((movement, accumulator) => accumulator + movement);

  labelSumInterest.textContent = `${interset}€`;

  // console.log(account.interestRate);
};

// calculateBalanceSummary(account1.movements);
//! create the funcction that convert Euro to USD

const EUROTOUSD = 1.1;

const euroToUsd = function (movements) {
  return movements.map(movement => movement * EUROTOUSD);
};

// console.log(euroToUsd(account1.movements));

//! opacity container

const opacityApp = function (opacity) {
  containerApp.style.opacity = opacity;
};

//! Impelementation Login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //* Prevent default eveent handle
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.user === inputLoginUsername.value
  );

  if (
    // currentAccount && //* first solution for error of undefined user => check if exist or not

    currentAccount?.user === inputLoginUsername.value && //* second solution => optional chaining
    currentAccount.pin === Number(inputLoginPin.value)
  ) {
    //* Display UI and welcome Message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;

    opacityApp(100);

    //! Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      // day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // //* display Movement
    // displayMovements(currentAccount.movements);

    // //* display balance
    // calculateBalance(currentAccount);

    // //* diaplay summary
    // calculateBalanceSummary(currentAccount);
    timerLoggedOut();

    //update UI
    updateUI(currentAccount);

    //* Empty the  input
    inputLoginUsername.value = inputLoginPin.value = '';

    //* clear the focus of input password
    inputLoginPin.blur();
  }
});

//! Transfer money

btnTransfer.addEventListener('click', function (e) {
  //* prevent default handle
  e.preventDefault();

  //* Amount of transfer money
  const amount = Number(inputTransferAmount.value);
  //* recevier Account
  const receiverAccount = accounts.find(
    account => account.user === inputTransferTo.value
  );

  // console.log(amount, receiverAccount);

  //* transfer with conditions :- amount > 0 && receiverAccount exist && balance >= amount && can't transfer to him self

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.user !== currentAccount.user
  ) {
    //* Add negative amount to current Account
    currentAccount.movements.push(-amount);

    currentAccount.movementsDates.push(new Date());
    //* Add positive amount to receiverAccount
    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(new Date());

    //* UPDATEUI
    updateUI(currentAccount);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();
  }
});

//! Loan amount

btnLoan.addEventListener('click', function (e) {
  //* prevent default handle
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(movement => movement * 0.1)
  ) {
    //* Add Positive movement to current user
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date());
    //* UPDATE UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

//! close account

btnClose.addEventListener('click', function (e) {
  //* prevent default handle
  e.preventDefault();

  //* confirm user
  const confirmUser = inputCloseUsername.value;

  //* confirm pin

  const confirmPin = inputClosePin.value;

  if (
    currentAccount.user === confirmUser &&
    currentAccount.pin === Number(confirmPin)
  ) {
    const deleteAccount = accounts.findIndex(
      account => account.user === currentAccount.user
    );

    //* delete data from account array
    accounts.splice(deleteAccount, 1);

    inputCloseUsername.value = inputClosePin.value = '';

    opacityApp(0);
    labelWelcome.textContent = `Log in to started`;

    // console.log(accounts);
  }
});

//! Sort movements

let sorted = false;

btnSort.addEventListener('click', function (e) {
  //* prevent default handle

  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
