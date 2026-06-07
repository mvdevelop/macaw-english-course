import type { Feature } from '../types';
import type { LucideIcon } from 'lucide-react';
import { BookOpenIcon, UsersIcon, AwardIcon, GlobeIcon } from "lucide-react";

export const featuresData: Feature[] = [
    {
        icon: BookOpenIcon as LucideIcon,
        title: "feature.structured.title",
        description: "feature.structured.desc",
    },
    {
        icon: UsersIcon as LucideIcon,
        title: "feature.teachers.title",
        description: "feature.teachers.desc",
    },
    {
        icon: AwardIcon as LucideIcon,
        title: "feature.certifications.title",
        description: "feature.certifications.desc",
    },
    {
        icon: GlobeIcon as LucideIcon,
        title: "feature.flexible.title",
        description: "feature.flexible.desc",
    },
];
