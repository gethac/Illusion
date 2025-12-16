/**
 * 步骤流程管理 Composable
 */

export function useSteps() {
    const { ref } = Vue;

    const step = ref(0);

    const nextStep = () => {
        step.value++;
    };

    const prevStep = () => {
        if (step.value > 0) {
            step.value--;
        }
    };

    const goToStep = (targetStep) => {
        step.value = targetStep;
    };

    return {
        step,
        nextStep,
        prevStep,
        goToStep
    };
}
