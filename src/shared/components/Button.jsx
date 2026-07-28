import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs";
  
  const variantClasses = {
    primary: "bg-blue-900 text-white hover:bg-blue-950 shadow-blue-900/10",
    secondary: "bg-slate-600 text-white hover:bg-slate-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-600/10",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span>{children}</span>
    </button>
  );
};
