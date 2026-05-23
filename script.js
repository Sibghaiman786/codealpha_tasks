// Get references to the main input and output elements in the DOM.
const dateInput = document.getElementById('dateInput');
const resultCard = document.getElementById('result');
const outputs = {
    years: document.getElementById('years'),
    months: document.getElementById('months'),
    days: document.getElementById('days'),
    zodiac: document.getElementById('zodiacOutput'),
    countdown: document.getElementById('birthdayCountdown')
};

// Zodiac sign data used to determine astrological sign from birth date.
const zodiacSigns = [
    { sign: 'Capricorn', emoji: '♑', endDay: 19 },
    { sign: 'Aquarius', emoji: '♒', endDay: 18 },
    { sign: 'Pisces', emoji: '♓', endDay: 20 },
    { sign: 'Aries', emoji: '♈', endDay: 19 },
    { sign: 'Taurus', emoji: '♉', endDay: 20 },
    { sign: 'Gemini', emoji: '♊', endDay: 20 },
    { sign: 'Cancer', emoji: '♋', endDay: 22 },
    { sign: 'Leo', emoji: '♌', endDay: 22 },
    { sign: 'Virgo', emoji: '♍', endDay: 22 },
    { sign: 'Libra', emoji: '♎', endDay: 22 },
    { sign: 'Scorpio', emoji: '♏', endDay: 21 },
    { sign: 'Sagittarius', emoji: '♐', endDay: 21 }
];

// Number of milliseconds in a single day, used to convert time differences.
const DAY_MS = 24 * 60 * 60 * 1000;
const today = new Date();

// Prevent the user from choosing a future birth date.
dateInput.max = today.toISOString().slice(0, 10);

// Trigger the calculation when the button is clicked.
document.getElementById('calcBtn').addEventListener('click', calculateAge);

// Main handler for reading the date, calculating the age, and updating the UI.
function calculateAge() {
    const value = dateInput.value;
    if (!value) {
        alert('Please select your birth date.');
        return;
    }

    const birthDate = new Date(value);
    const age = getDetailedAge(birthDate, today);

    resultCard.classList.remove('hidden');
    outputs.years.textContent = age.y;
    outputs.months.textContent = age.m;
    outputs.days.textContent = age.d;
    outputs.zodiac.textContent = formatZodiac(birthDate);
    outputs.countdown.textContent = getNextBirthday(birthDate, today);
}

// Calculate exact years, months, and days by comparing two dates.
function getDetailedAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
        // Borrow days from the previous month when current day is earlier than birth day.
        months -= 1;
        days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
        // Borrow a year if current month is before birth month.
        years -= 1;
        months += 12;
    }

    return { y: years, m: months, d: days };
}

// Map birth date to the corresponding zodiac sign and emoji.
function formatZodiac(birthDate) {
    const monthIndex = birthDate.getMonth();
    const day = birthDate.getDate();
    const zodiac = day > zodiacSigns[monthIndex].endDay
        ? zodiacSigns[(monthIndex + 1) % 12]
        : zodiacSigns[monthIndex];
    return `${zodiac.emoji} ${zodiac.sign}`;
}

// Compute days remaining until the next birthday and format the countdown text.
function getNextBirthday(birthDate, today) {
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBday) nextBday.setFullYear(today.getFullYear() + 1);
    
    const diff = Math.ceil((nextBday - today) / DAY_MS);
    return diff === 0 ? "It's Today! 🎉" : `${diff} Days Left`;
}