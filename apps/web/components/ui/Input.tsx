type InputProps = {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
};

export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  className = "",
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-muted mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-foreground placeholder:text-muted/50 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
      />
    </div>
  );
}
