import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Details {
    that = this;
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.showResultButtonElement = document.getElementById('showResult');
        this.showResultButtonElement.onclick = this.showResultsPage.bind(this);

        this.init();
    }

    async init() {
        this.userInfo = Auth.getUserInfo();
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);
                if (result || result.test) {
                    if (result.error) throw new Error(result.error);
                    this.quizDetails = result.test;
                    this.showQuizAnswers();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    showQuizAnswers() {
        document.getElementById('pre-title').innerHTML = 'Результат прохождения теста <img src="images/small-arrow-gray.png" alt="Стрелка">' + '<span>' + this.quizDetails.name + '<span>';
        document.getElementById('userName').innerHTML = 'Тест выполнил <span>' + this.userInfo.fullName + ', ' + this.userInfo.email + '</span>';
        this.answersWrapper = document.getElementById('answersWrapper');

        this.showQuestions();
    }

    showQuestions() {
        this.currentTestQuestions = this.quizDetails.questions;

        this.currentTestQuestions.forEach((question, index) => {
            // Wrapper для Question
            const currentAnswersWrapperQuestion = document.createElement('div');
            currentAnswersWrapperQuestion.className = 'answers-wrapper-question';

            const currentAnswersWrapperQuestionTitle = document.createElement('p');
            currentAnswersWrapperQuestionTitle.classList.add('answers-wrapper-question-title', 'question-title');
            currentAnswersWrapperQuestionTitle.innerHTML = '<span>Вопрос ' + (index + 1) + ':</span> ' + question.question;

            const currentAnswersWrapperQuestionOptions = document.createElement('div');
            currentAnswersWrapperQuestionOptions.className = 'answers-wrapper-question-options';

            const inputNameIndex = index;

            question.answers.forEach((answer, index) => {
                const answerCorrect = answer.correct;

                const questionOption = document.createElement('div');
                questionOption.classList.add('answers-wrapper-question-option', 'question-option');
                const questionInput = document.createElement('input');
                questionInput.setAttribute('type', 'radio');
                questionInput.setAttribute('name', 'answer' + inputNameIndex);
                questionInput.setAttribute('id', answer.id);
                questionInput.setAttribute('value', answer.id);

                // ------------- Отключение возможности выбора radio-button
                questionInput.setAttribute('disabled', 'disabled');
                // -------------

                const questionLabel = document.createElement('label');
                questionLabel.setAttribute('for', answer.id);
                questionLabel.innerText = answer.answer;

                // // Если текущий input был выбран пользователем при прохождении теста - то он выделяется
                if (answer.hasOwnProperty('correct')) {
                    questionInput.setAttribute('checked', 'checked');
                    if (answerCorrect) {
                        questionInput.classList.add('answer-input-right');
                        questionLabel.classList.add('answer-text-right');
                    } else {
                        questionInput.classList.add('answer-input-wrong');
                        questionLabel.classList.add('answer-text-wrong');
                    }
                }
                questionOption.appendChild(questionInput);
                questionOption.appendChild(questionLabel);

                currentAnswersWrapperQuestionOptions.appendChild(questionOption);
            });

            currentAnswersWrapperQuestion.appendChild(currentAnswersWrapperQuestionTitle);
            currentAnswersWrapperQuestion.appendChild(currentAnswersWrapperQuestionOptions);
            this.answersWrapper.appendChild(currentAnswersWrapperQuestion);
        });
    }

    showResultsPage() {
        location.href = '#/result?id=' + this.routeParams.id;
    }
}