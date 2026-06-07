import type { PricingPlan } from '../types';
import type { LucideIcon } from 'lucide-react';
import { CheckIcon } from "lucide-react";

export const pricingData: PricingPlan[] = [
    {
        title: "plan.beginner.title",
        price: 99,
        features: [
            {
                name: "plan.beginner.feature1",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.beginner.feature2",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.beginner.feature3",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.beginner.feature4",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.beginner.feature5",
                icon: CheckIcon as LucideIcon,
            },
        ],
        buttonText: "plan.beginner.button",
    },
    {
        title: "plan.intermediate.title",
        price: 199,
        mostPopular: true,
        features: [
            {
                name: "plan.intermediate.feature1",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.intermediate.feature2",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.intermediate.feature3",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.intermediate.feature4",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.intermediate.feature5",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.intermediate.feature6",
                icon: CheckIcon as LucideIcon,
            }
        ],
        buttonText: "plan.intermediate.button",
    },
    {
        title: "plan.advanced.title",
        price: 349,
        features: [
            {
                name: "plan.advanced.feature1",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.advanced.feature2",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.advanced.feature3",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.advanced.feature4",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.advanced.feature5",
                icon: CheckIcon as LucideIcon,
            },
            {
                name: "plan.advanced.feature6",
                icon: CheckIcon as LucideIcon,
            }
        ],
        buttonText: "plan.advanced.button",
    }
];
