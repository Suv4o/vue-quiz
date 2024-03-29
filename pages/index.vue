<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/20/solid";
import { CheckCircleIcon } from "@heroicons/vue/20/solid";
import { LightBulbIcon } from "@heroicons/vue/20/solid";
import { ArrowPathIcon } from "@heroicons/vue/20/solid";

const quiz = ref({
    isVueOrNuxtQuestion: "",
    question: "",
    fistAnswer: "",
    secondAnswer: "",
    thirdAnswer: "",
    correctAnswer: "",
});
const isLoading = ref(true);
const answerPicked = ref(false);
const isSelectedAnswerCorrect = ref(false);
const message = ref("");

onMounted(async () => {
    await getQuizData();
});

const vueOrNuxt = computed(() => {
    return quiz.value.isVueOrNuxtQuestion;
});

const quizQuestion = computed(() => {
    return quiz.value.question;
});

const quizAnswers = computed(() => {
    const fistAnswer = quiz.value.fistAnswer;
    const secondAnswer = quiz.value.secondAnswer;
    const thirdAnswer = quiz.value.thirdAnswer;
    return [fistAnswer, secondAnswer, thirdAnswer];
});

const correctAnswer = computed(() => {
    return quiz.value.correctAnswer;
});

async function getQuizData() {
    try {
        isLoading.value = true;
        quiz.value = await $fetch("/api/quiz");
        isLoading.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

function selectAnswer(index: number) {
    answerPicked.value = true;
    if (quizAnswers.value[index] === correctAnswer.value) {
        message.value = "Congratulations! Your answer is correct!";
        isSelectedAnswerCorrect.value = true;
    } else {
        message.value = "Sorry! Your answer is wrong! Try again!";
    }
}

async function resetQuiz() {
    quiz.value = {
        isVueOrNuxtQuestion: "",
        question: "",
        fistAnswer: "",
        secondAnswer: "",
        thirdAnswer: "",
        correctAnswer: "",
    };
    isLoading.value = true;
    answerPicked.value = false;
    isSelectedAnswerCorrect.value = false;
    message.value = "";
    await getQuizData();
}
</script>

<template>
    <div class="container mx-auto">
        <div v-if="isLoading" class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8 flex justify-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl inline-flex justify-center gap-4">
                <ArrowPathIcon class="h-12 w-12 animate-spin" aria-hidden="true" />Loading...
            </h2>
        </div>
        <div v-if="!isLoading" class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <h2
                    class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex flex-wrap justify-center items-center gap-4"
                >
                    <LightBulbIcon class="h-8 w-8" aria-hidden="true" />
                    <p>{{ vueOrNuxt }} Question!</p>
                </h2>
                <p class="mx-auto mt-6 max-w-xl text-3xl leading-8 text-gray-600 text-center">
                    {{ quizQuestion }}
                </p>
                <div class="flex flex-col justify-center gap-y-6 mt-10">
                    <button
                        v-for="(answer, index) in quizAnswers"
                        @click="selectAnswer(index)"
                        :key="`${answer}-${index}`"
                        type="button"
                        class="inline-flex items-start gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        :class="
                            answerPicked
                                ? answer === correctAnswer
                                    ? 'bg-green-500 hover:bg-green-600 focus-visible:outline-green-800'
                                    : 'bg-red-500 hover:bg-red-600 focus-visible:outline-red-800'
                                : 'bg-gray-800 hover:bg-gray-600 focus-visible:outline-gray-800'
                        "
                    >
                        <CheckCircleIcon
                            v-if="answerPicked && answer === correctAnswer"
                            class="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                        />
                        <XCircleIcon
                            v-if="answerPicked && answer !== correctAnswer"
                            class="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                        />
                        <span>{{ index + 1 }}.</span> <span>{{ answer }}</span>
                    </button>
                </div>
                <p
                    v-if="message"
                    class="mx-auto mt-8 max-w-xl text-3xl leading-8"
                    :class="`${isSelectedAnswerCorrect ? 'text-green-700' : 'text-red-700'}`"
                >
                    {{ message }}
                </p>
                <div class="flex justify-center">
                    <button
                        v-if="message"
                        @click="resetQuiz"
                        class="mt-5 text-2xl font-semibold leading-6 text-gray-600"
                    >
                        {{ isSelectedAnswerCorrect ? "Try with another question!" : "Try again!" }}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
