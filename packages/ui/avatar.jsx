import React from 'react';

/**
 * Generate a consistent color from a string
 * @param {string} str - Input string (name, email, etc.)
 * @returns {string} HSL color string
 */
const stringToColor = (str) => {
  if (!str) return 'hsl(200, 70%, 50%)';

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
};

/**
 * Get initials from a full name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
const getInitials = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Avatar component with image fallback to initials
 * @param {Object} props
 * @param {string} props.name - User's full name
 * @param {string} props.src - Avatar image URL (optional)
 * @param {string} props.size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} props.className - Additional CSS classes
 */
export function Avatar({ name, src, size = 'md', className = '' }) {
  const [imageError, setImageError] = React.useState(false);
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full font-semibold
    ${sizeClasses[size]}
    ${className}
  `;

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        className={`${baseClasses} object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} text-white`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {initials}
    </div>
  );
}
