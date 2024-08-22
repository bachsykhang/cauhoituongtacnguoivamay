document.addEventListener("DOMContentLoaded", function() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const questionNumber = document.getElementById('question-number');
    const startAllBtn = document.getElementById('start-all-btn');
    const start60Btn = document.getElementById('start-60-btn');
    const finalScoreContainer = document.getElementById('final-score-container');

    let questions = [];
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectAnswers = [];

    // Load JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Event listener for "Giải toàn bộ câu hỏi" button
    startAllBtn.addEventListener('click', () => {
        selectedQuestions = questions; // Use all questions
        startQuiz();
    });

    // Event listener for "Giải 60 câu hỏi" button
    start60Btn.addEventListener('click', () => {
        selectedQuestions = getRandomQuestions(60, questions); // Select 60 random questions
        startQuiz();
    });

    function getRandomQuestions(num, questionsArray) {
        const shuffled = questionsArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    function startQuiz() {
        score = 0;
        incorrectAnswers = [];
        currentQuestionIndex = 0;
        startAllBtn.style.display = 'none';
        start60Btn.style.display = 'none';
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            displayFinalScore();
            return;
        }

        const question = selectedQuestions[currentQuestionIndex];
        questionContainer.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const optionElem = document.createElement('div');
            optionElem.className = 'option';
            optionElem.textContent = option;
            optionElem.addEventListener('click', () => selectOption(optionElem, option));
            optionsContainer.appendChild(optionElem);
        });

        questionNumber.textContent = `Câu hỏi ${currentQuestionIndex + 1} / ${selectedQuestions.length}`;
        submitBtn.style.display = 'none';
        resultContainer.textContent = '';
    }

    function selectOption(optionElem, selectedOption) {
        const correctAnswer = selectedQuestions[currentQuestionIndex].answer;
        const optionsElems = optionsContainer.querySelectorAll('.option');
        
        optionsElems.forEach(elem => {
            elem.classList.remove('correct', 'incorrect');
            if (elem.textContent === correctAnswer) {
                elem.classList.add('correct');
            } else if (elem.textContent === selectedOption) {
                elem.classList.add('incorrect');
            }
        });

        if (selectedOption === correctAnswer) {
            score++;
            resultContainer.textContent = "Đáp án đúng!";
        } else {
            resultContainer.textContent = "Đáp án sai!";
            incorrectAnswers.push(selectedQuestions[currentQuestionIndex]);
        }
        submitBtn.style.display = 'block';
    }

    submitBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    function displayFinalScore() {
        questionContainer.innerHTML = "";
        optionsContainer.innerHTML = "";
        questionNumber.textContent = '';
        finalScoreContainer.innerHTML = `<h2>Điểm số của bạn: ${(score / selectedQuestions.length * 10).toFixed(2)} / 10</h2>`;
        
        if (incorrectAnswers.length > 0) {
            finalScoreContainer.innerHTML += "<h3>Câu trả lời sai:</h3>";
            incorrectAnswers.forEach(question => {
                finalScoreContainer.innerHTML += `<p>${question.question} - Đáp án đúng: ${question.answer}</p>`;
            });
        } else {
            finalScoreContainer.innerHTML += "<p>Bạn đã trả lời đúng tất cả các câu hỏi!</p>";
        }

        startAllBtn.style.display = 'block';
        start60Btn.style.display = 'block';
    }
});
