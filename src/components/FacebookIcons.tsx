import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  fill?: string;
  active?: boolean;
}

// 1. Facebook Official Blue Logo
export const FbLogo: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 36 36"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path
      fill="#1877F2"
      d="M36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.988 6.598 16.435 15.188 17.781V23.18h-4.594V18h4.594v-3.953c0-4.536 2.7-7.042 6.839-7.042 1.982 0 4.055.354 4.055.354v4.458H23.8a2.59 2.59 0 0 0-2.92 2.798V18h5.023l-.803 5.18h-4.22v12.601C29.402 34.435 36 26.988 36 18z"
    />
    <path
      fill="#FFFFFF"
      d="M25.1 23.18l.803-5.18H20.88v-3.363c0-1.428.698-2.798 2.92-2.798h2.282V7.381s-2.073-.354-4.055-.354c-4.139 0-6.839 2.506-6.839 7.042V18h-4.594v5.18h4.594v12.601a18.232 18.232 0 0 0 5.625 0V23.18H25.1z"
    />
  </svg>
);

// 2. Facebook Home Icon (Active filled, Inactive outline)
export const FbHome: React.FC<IconProps> = ({ className = 'w-6 h-6', active = false, size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    {active ? (
      <path d="M14 2.071l11.071 8.533a1.5 1.5 0 0 1 .572 1.18V24.5a1.5 1.5 0 0 1-1.5 1.5h-5.643a1 1 0 0 1-1-1v-6.5a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1V25a1 1 0 0 1-1 1H3.857a1.5 1.5 0 0 1-1.5-1.5V11.784a1.5 1.5 0 0 1 .572-1.18L14 2.071z" />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.232 2.378a1.25 1.25 0 0 1 1.536 0l11.071 8.533A1.25 1.25 0 0 1 26.315 12V24.5A2.75 2.75 0 0 1 23.565 27.25h-5.643a2.25 2.25 0 0 1-2.25-2.25v-6.25a.25.25 0 0 0-.25-.25h-4.844a.25.25 0 0 0-.25.25V25a2.25 2.25 0 0 1-2.25 2.25H2.685A2.75 2.75 0 0 1-.065 24.5V12a1.25 1.25 0 0 1 .476-1.089L11.482 2.378h1.75zm1.536 2.32L4.435 12.65V24.5c0 .414.336.75.75.75h5.193a.75.75 0 0 0 .75-.75v-6.25a1.75 1.75 0 0 1 1.75-1.75h4.844a1.75 1.75 0 0 1 1.75 1.75V24.5a.75.75 0 0 0 .75.75h5.643a.75.75 0 0 0 .75-.75V12.65L14.768 4.698z"
      />
    )}
  </svg>
);

// 3. Facebook Friends / Donors Icon
export const FbFriends: React.FC<IconProps> = ({ className = 'w-6 h-6', active = false, size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    {active ? (
      <path d="M19.25 9.75a4.25 4.25 0 1 0-8.5 0 4.25 4.25 0 0 0 8.5 0zm-15 14.5c0-4.004 3.246-7.25 7.25-7.25h7c4.004 0 7.25 3.246 7.25 7.25a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75zm18.5-12.75a3.5 3.5 0 1 0-2.83 5.548 6.54 6.54 0 0 1 2.08 1.952 5.5 5.5 0 0 1 4.5 5.38.75.75 0 0 0 1.5 0 7 7 0 0 0-5.25-6.764V11.5z" />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 5.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zM12.25 9.75a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0zm-8 14.5c0-4.004 3.246-7.25 7.25-7.25h7c4.004 0 7.25 3.246 7.25 7.25a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75zm7.25-5.75a5.75 5.75 0 0 0-5.73 5.25h18.46a5.75 5.75 0 0 0-5.73-5.25h-7zm11.25-11a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm1.5 9.75a.75.75 0 0 1 .75-.75 6.25 6.25 0 0 1 6.25 6.25.75.75 0 0 1-1.5 0 4.75 4.75 0 0 0-4.75-4.75.75.75 0 0 1-.75-.75z"
      />
    )}
  </svg>
);

// 4. Facebook Emergency / Watch / Live Requests Icon
export const FbEmergency: React.FC<IconProps> = ({ className = 'w-6 h-6', active = false, size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    {active ? (
      <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h14.5A2.75 2.75 0 0 1 24 6.75v14.5A2.75 2.75 0 0 1 21.25 24H6.75A2.75 2.75 0 0 1 4 21.25V6.75zm8.125 4.316a.75.75 0 0 0-1.125.649v4.57a.75.75 0 0 0 1.125.649l4.155-2.285a.75.75 0 0 0 0-1.298l-4.155-2.285z" />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.75 4A2.75 2.75 0 0 0 4 6.75v14.5A2.75 2.75 0 0 0 6.75 24h14.5A2.75 2.75 0 0 0 24 21.25V6.75A2.75 2.75 0 0 0 21.25 4H6.75zm14.5 1.5H6.75c-.69 0-1.25.56-1.25 1.25v14.5c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25zm-9.125 5.566a.75.75 0 0 0-1.125.649v4.57a.75.75 0 0 0 1.125.649l4.155-2.285a.75.75 0 0 0 0-1.298l-4.155-2.285zm.375 2.05l2.29 1.26-2.29 1.258v-2.518z"
      />
    )}
  </svg>
);

// 5. Facebook Marketplace / Hospital / Blood Banks Icon
export const FbMarketplace: React.FC<IconProps> = ({ className = 'w-6 h-6', active = false, size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    {active ? (
      <path d="M4.5 6.75A2.75 2.75 0 0 1 7.25 4h13.5A2.75 2.75 0 0 1 23.5 6.75v1.442a3.75 3.75 0 0 1-2.25 3.447V22.25A1.75 1.75 0 0 1 19.5 24H8.5a1.75 1.75 0 0 1-1.75-1.75v-10.61a3.75 3.75 0 0 1-2.25-3.448V6.75zm6.25 10.75a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75h-6.5z" />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.25 4A2.75 2.75 0 0 0 4.5 6.75v1.442a3.75 3.75 0 0 0 2.25 3.448V22.25c0 .966.784 1.75 1.75 1.75h11a1.75 1.75 0 0 0 1.75-1.75v-10.61a3.75 3.75 0 0 0 2.25-3.448V6.75A2.75 2.75 0 0 0 20.75 4H7.25zm13.5 1.5H7.25c-.69 0-1.25.56-1.25 1.25v1.442a2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25V7.5a.75.75 0 0 1 1.5 0v.692a2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25V7.5a.75.75 0 0 1 1.5 0v.692a2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25V6.75c0-.69-.56-1.25-1.25-1.25zm-1.5 6.326c-.394.34-.86.586-1.375.704V22.25a.25.25 0 0 1-.25.25H8.5a.25.25 0 0 1-.25-.25v-8.47a3.738 3.738 0 0 1-1.375-.704V22.25c0 .966.784 1.75 1.75 1.75h11a1.75 1.75 0 0 0 1.75-1.75v-8.674zM10 18.25c0-.414.336-.75.75-.75h6.5c.414 0 .75.336.75.75v4a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1-.75-.75v-4zm1.5.75v2.5h5V19h-5z"
      />
    )}
  </svg>
);

// 6. Facebook Stories / Feed / Groups Icon
export const FbStories: React.FC<IconProps> = ({ className = 'w-6 h-6', active = false, size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    {active ? (
      <path d="M7 4.75A2.75 2.75 0 0 1 9.75 2h8.5A2.75 2.75 0 0 1 21 4.75v18.5A2.75 2.75 0 0 1 18.25 26h-8.5A2.75 2.75 0 0 1 7 23.25V4.75zm7 6.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 13a6.5 6.5 0 0 0 5.485-3.023c-.352-1.846-2.617-3.227-5.485-3.227s-5.133 1.381-5.485 3.227A6.5 6.5 0 0 0 14 24z" />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.75 2A2.75 2.75 0 0 0 7 4.75v18.5A2.75 2.75 0 0 0 9.75 26h8.5A2.75 2.75 0 0 0 21 23.25V4.75A2.75 2.75 0 0 0 18.25 2h-8.5zM8.5 4.75c0-.69.56-1.25 1.25-1.25h8.5c.69 0 1.25.56 1.25 1.25v18.5c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25V4.75zm5.5 4.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-4.32 10.875A6.47 6.47 0 0 0 14 23.5c1.674 0 3.204-.632 4.32-1.625-.436-1.396-2.228-2.375-4.32-2.375s-3.884.979-4.32 2.375z"
      />
    )}
  </svg>
);

// 7. Facebook Messenger Icon (Chat bubble with lightning)
export const FbMessenger: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path d="M14 2.04C7.23 2.04 1.74 7.14 1.74 13.43c0 3.59 1.79 6.8 4.6 8.94.24.18.39.46.4.77l.09 2.42c.04 1.04 1.13 1.7 2.06 1.25l2.71-1.31c.24-.12.51-.14.77-.07 1.05.28 2.16.44 3.32.44 6.77 0 12.26-5.1 12.26-11.39S20.77 2.04 14 2.04zm1.37 15.35l-3.32-3.54-6.48 3.54 7.13-7.57 3.4 3.54 6.39-3.54-7.12 7.57z" />
  </svg>
);

// 8. Facebook Bell / Notification Icon
export const FbBell: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 28 28"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path d="M7.847 23.488A2.5 2.5 0 0 0 10.297 25.5h7.406a2.5 2.5 0 0 0 2.45-2.012H7.847zM24.717 19.387c-.896-1.02-2.717-2.607-2.717-8.387 0-4.043-2.92-7.397-6.845-7.915a2.155 2.155 0 0 0-2.31-1.085 2.155 2.155 0 0 0-2.31 1.085C6.61 3.593 3.69 6.947 3.69 10.99c0 5.79-1.821 7.377-2.717 8.397A1.5 1.5 0 0 0 2.108 22h23.784a1.5 1.5 0 0 0 1.135-2.613h-.31z" />
  </svg>
);

// 9. Facebook Search Magnifying Glass
export const FbSearch: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path d="M19.07 17.656l-3.61-3.61a7.25 7.25 0 1 0-1.414 1.414l3.61 3.61a1 1 0 0 0 1.414-1.414zM4.75 10.25a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z" />
  </svg>
);

// 10. Facebook Like Thumbs Up Icon (Outline & Solid Active)
export const FbLike: React.FC<IconProps> = ({ className = 'w-5 h-5', active = false, size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill={active ? '#1877F2' : 'none'}
    stroke={active ? '#1877F2' : 'currentColor'}
    strokeWidth={active ? 0 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {active ? (
      <path
        fill="#1877F2"
        stroke="none"
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
      />
    ) : (
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    )}
  </svg>
);

// 11. Facebook Comment Speech Bubble
export const FbComment: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// 12. Facebook Curved Share Arrow
export const FbShare: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v4a3 3 0 0 0 3 3h10" />
    <path d="M16 6l5 5-5 5" />
    <path d="M21 11H9a5 5 0 0 0-5 5" />
  </svg>
);

// 13. Facebook Three Horizontal Dots (...) Menu
export const FbDots: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path d="M6 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
  </svg>
);

// 14. Facebook Public Globe Icon (Posts visibility)
export const FbPublic: React.FC<IconProps> = ({ className = 'w-3.5 h-3.5', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm5.93 7h-2.18a11.77 11.77 0 0 0-1-4.2A6.52 6.52 0 0 1 13.93 7zm-5.43 0h-3a10.66 10.66 0 0 1 1.5-4.7 10.66 10.66 0 0 1 1.5 4.7zm0 1.5a10.66 10.66 0 0 1-1.5 4.7 10.66 10.66 0 0 1-1.5-4.7h3zm.93-1.5a10.66 10.66 0 0 1 1.5-4.7 10.66 10.66 0 0 1 1.5 4.7h-3zm0 1.5h3a10.66 10.66 0 0 1-1.5 4.7 10.66 10.66 0 0 1-1.5-4.7zm-1.86 4.2a11.77 11.77 0 0 0 1-4.2h2.18a6.52 6.52 0 0 1-3.18 4.2zM2.07 9h2.18a11.77 11.77 0 0 0 1 4.2A6.52 6.52 0 0 1 2.07 9zm0-1.5a6.52 6.52 0 0 1 3.18-4.2 11.77 11.77 0 0 0-1 4.2H2.07zm8.68-4.2a11.77 11.77 0 0 0-1 4.2h2.18a6.52 6.52 0 0 1-1.18-4.2z" />
  </svg>
);

// 15. Facebook Blue Verified Badge (8-pointed scalloped rosette with white checkmark)
export const FbVerified: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
  >
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      className="hidden"
    />
    {/* Scalloped badge circle */}
    <circle cx="12" cy="12" r="10" fill="#1877F2" />
    <path
      d="M9.5 12.5l2 2 4.5-4.5"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 16. Facebook Reaction: Like (Blue Circle with Thumbs-up)
export const FbReactionLike: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65} fill="#FFFFFF">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  </div>
);

// 17. Facebook Reaction: Love (Red-Pink Circle with Heart)
export const FbReactionLove: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-[#E41E3F] to-[#FA3E3E] text-white shadow-xs ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#FFFFFF">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </div>
);

// 18. Facebook Reaction: Care / Blood Donor (Yellow/Rose Circle with blood drop)
export const FbReactionCare: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-[#F7B125] text-white shadow-xs ${className}`}
    style={{ width: size, height: size }}
  >
    <span style={{ fontSize: size * 0.65, lineHeight: 1 }}>🩸</span>
  </div>
);

// 19. Facebook 9-Dots Grid (Menu button in top-right)
export const FbMenuGrid: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="currentColor"
  >
    <circle cx="5" cy="5" r="2.2" />
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="19" cy="5" r="2.2" />
    <circle cx="5" cy="12" r="2.2" />
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="19" cy="12" r="2.2" />
    <circle cx="5" cy="19" r="2.2" />
    <circle cx="12" cy="19" r="2.2" />
    <circle cx="19" cy="19" r="2.2" />
  </svg>
);
