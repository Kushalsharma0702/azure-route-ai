import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  steps: string[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: Props) => (
  <div className="flex items-center justify-center gap-0 mb-10 max-w-2xl mx-auto">
    {steps.map((step, i) => (
      <div key={step} className="flex items-center flex-1 last:flex-initial">
        <div className="flex flex-col items-center relative">
          <motion.div
            initial={false}
            animate={{
              scale: i === currentStep ? 1.1 : 1,
              backgroundColor: i <= currentStep ? "hsl(230 80% 56%)" : "hsl(220 14% 94%)",
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
          >
            {i < currentStep ? (
              <Check className="w-5 h-5 text-primary-foreground" />
            ) : (
              <span className={i <= currentStep ? "text-primary-foreground" : "text-muted-foreground"}>{i + 1}</span>
            )}
          </motion.div>
          <span className={`text-xs mt-2 whitespace-nowrap font-medium ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className="flex-1 h-0.5 mx-2 mt-[-20px]">
            <motion.div
              initial={false}
              animate={{ scaleX: i < currentStep ? 1 : 0 }}
              style={{ transformOrigin: "left" }}
              className="h-full bg-primary rounded-full"
              transition={{ duration: 0.4 }}
            />
            <div className="h-full bg-muted rounded-full -mt-0.5" />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default StepProgress;
