export type OnboardingStep = {
    step_id: number;
    user_id?: number;
    step_description: string;
    completed?: boolean;
};