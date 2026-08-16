import { isEmpty } from "lodash";
import {
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import { ThemePalette } from "@/types/ThemeTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

interface StepIndicatorProps {
    currentStep: number;
    errors?: any;
}

const ColorConnector = styled(StepConnector)<{ bordercolor: string }>(({ bordercolor }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 12 },
    [`& .${stepConnectorClasses.line}`]: {
        height: 2,
        border: 0,
        borderRadius: 1,
        width: 24,
        backgroundColor: bordercolor,
    },
}));

function CustomStepIcon({
    active,
    completed,
    hasError,
    icon,
    theme,
}: {
    active: boolean;
    completed: boolean;
    hasError: boolean;
    icon: number;
    theme: ThemePalette;
}) {
    const base = "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200";

    if (hasError) {
        return (
            <div className={base} style={{ backgroundColor: theme.error, color: theme.textInverse }}>
                <ErrorIcon sx={{ fontSize: 14 }} />
            </div>
        );
    }
    if (completed) {
        return (
            <div className={base} style={{ backgroundColor: theme.success, color: theme.textInverse }}>
                <CheckIcon sx={{ fontSize: 14 }} />
            </div>
        );
    }
    if (active) {
        // ✅ active + no error = gray transparent
        return (
            <div className={base} style={{ backgroundColor: theme.bgSecondary, color: theme.textMuted, border: `1.5px solid ${theme.border}` }}>
                {icon}
            </div>
        );
    }
    return (
        <div className={base} style={{ backgroundColor: theme.bgSecondary, color: theme.textMuted }}>
            {icon}
        </div>
    );
}

export default function StepIndicator({ currentStep, errors }: StepIndicatorProps) {
    const { state: { currentTheme: theme } } = useStoreConfigCtx();

    if (currentStep < 1) return null;

    const { submit, ...errorsWithoutSubmit } = errors || {};

    const stepErrors: Record<number, boolean> = {
        1: !isEmpty(errorsWithoutSubmit),
        2: !isEmpty(submit),
    };

    const steps = ["Shipping", "Payment"];
    const activeStep = currentStep - 1;

    const getLabelSx = (stepIndex: number) => {
        const isCompleted = stepIndex < activeStep;
        const isActive = stepIndex === activeStep;
        const stepNumber = stepIndex + 1;
        // ✅ check error for both completed and active steps
        const isErrored = stepErrors[stepNumber] && (isCompleted || isActive);

        return {
            "& .MuiStepLabel-label": {
                fontSize: "0.7rem",
                fontWeight: 500,
                marginTop: "3px !important",
                color: isErrored
                    ? theme.error
                    : isCompleted
                    ? theme.success
                    : isActive
                    ? theme.textSecondary   // ✅ active label also muted gray
                    : theme.textSecondary,
            },
        };
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }} className="py-4">
            <Stepper
                activeStep={activeStep}
                connector={<ColorConnector bordercolor={theme.border} />}
                sx={{
                    p: 0,
                    width: "fit-content",
                    backgroundColor: "transparent",
                    "& .MuiStep-root": { px: 0.5 },
                    "& .MuiStepLabel-root": { gap: 0 },
                }}
            >
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    // ✅ error fires for both completed and active
                    const isErrored = stepErrors[stepNumber] && (isCompleted || isActive);

                    return (
                        <Step key={label} completed={isCompleted}>
                            <StepLabel
                                sx={getLabelSx(index)}
                                StepIconComponent={(props) => (
                                    <CustomStepIcon
                                        {...props}
                                        hasError={isErrored}
                                        theme={theme}
                                    />
                                )}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}
