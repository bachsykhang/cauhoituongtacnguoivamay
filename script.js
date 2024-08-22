document.addEventListener("DOMContentLoaded", function() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const questionNumber = document.getElementById('question-number');

    let questions = [];
    let currentQuestionIndex = 0;

    // Load JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            displayQuestion();
        })
        .catch(error => console.error('Error loading JSON:', error));

    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            questionContainer.textContent = "Bạn đã hoàn thành tất cả các câu hỏi!";
            optionsContainer.innerHTML = "";
            submitBtn.style.display = 'none';
            questionNumber.textContent = '';
            return;
        }

        const question = questions[currentQuestionIndex];
        questionContainer.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const optionElem = document.createElement('div');
            optionElem.className = 'option';
            optionElem.textContent = option;
            optionElem.addEventListener('click', () => selectOption(optionElem, option));
            optionsContainer.appendChild(optionElem);
        });

        // Update question number
        questionNumber.textContent = `Câu hỏi ${currentQuestionIndex + 1} / ${questions.length}`;
    }

    function selectOption(optionElem, selectedOption) {
        const correctAnswer = questions[currentQuestionIndex].answer;
        const optionsElems = optionsContainer.querySelectorAll('.option');
        
        optionsElems.forEach(elem => {
            elem.classList.remove('correct', 'incorrect');
            if (elem.textContent === correctAnswer) {
                elem.classList.add('correct');
            } else if (elem.textContent === selectedOption) {
                elem.classList.add('incorrect');
            }
        });

        resultContainer.textContent = selectedOption === correctAnswer ? "Đáp án đúng!" : "Đáp án sai!";
        submitBtn.style.display = 'block';
    }

    submitBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        resultContainer.textContent = "";
        displayQuestion();
    });
});
