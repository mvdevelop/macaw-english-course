interface Props {
  className?: string;
}

export default function UKFlagIcon({ className = "size-5" }: Props) {
  return (
    <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" rx="3" fill="#012169"/>
      <path d="M0,0 L60,40" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M60,0 L0,40" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M0,0 L60,40" stroke="#C8102E" strokeWidth="2"/>
      <path d="M60,0 L0,40" stroke="#C8102E" strokeWidth="2"/>
      <path d="M30,0 L30,40" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M0,20 L60,20" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M30,0 L30,40" stroke="#C8102E" strokeWidth="3"/>
      <path d="M0,20 L60,20" stroke="#C8102E" strokeWidth="3"/>
    </svg>
  );
}
