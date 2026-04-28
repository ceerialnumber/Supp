interface LogoProps {
  className?: string;
  strokeColor?: string;
  clipId?: string;
}

export default function Logo({ 
  className = "w-full h-full", 
  strokeColor = "#1371FF",
  clipId = "clip0_logo"
}: LogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 51" fill="none" className={className}>
      <g clipPath={`url(#${clipId})`}>
        <path d="M5.43561 35.1C5.43561 35.1 15.0218 27.3107 13.1245 19.5224C11.2271 11.7331 7.83216 8.03887 10.4286 7.53967C13.025 7.04047 16.3205 17.2253 16.3205 17.2253C16.3205 17.2253 10.6285 6.54029 12.7257 5.14214C14.8229 3.74399 19.0164 15.4274 19.0164 15.4274C19.0164 15.4274 14.4232 6.50714 16.7193 5.02612C19.0164 3.54412 21.2131 14.429 21.2131 14.429C21.2131 14.429 18.4168 3.94387 20.1142 3.74399C21.8117 3.54412 25.8063 8.5371 26.0062 26.911C26.0062 26.911 27.6042 26.1124 29.2012 22.1179C30.7983 18.1233 33.7945 20.32 31.6972 24.5144C29.6 28.7089 28.7011 31.7041 20.8123 35.6986C20.8123 35.6986 16.0192 44.0866 12.6243 47.4815" stroke={strokeColor} strokeWidth="1.365" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M45.3921 36.2807C45.3921 36.2807 39.2749 37.6574 37.0568 34.2157C34.8397 30.7749 36.3685 27.104 40.8798 23.5862C45.3911 20.0684 42.4856 19.5331 38.6626 22.4396C34.8397 25.3451 34.1513 26.0335 34.1513 26.0335C34.1513 26.0335 35.8293 18.9959 38.5096 15.2509C40.5571 12.3903 42.9448 9.82215 41.5681 8.67457C40.1914 7.52797 34.8387 15.6331 34.8387 15.6331C34.8387 15.6331 40.3445 9.43897 39.35 7.68007C38.3555 5.92117 32.4168 14.7917 32.4168 14.7917C32.4168 14.7917 38.8918 7.60402 36.5976 6.53347C34.3034 5.46292 30.2503 13.6451 30.2503 13.6451C30.2503 13.6451 33.1841 9.5979 33.2075 7.01805C33.2114 6.63097 32.8302 6.35212 32.4636 6.474C29.6985 7.39537 25.8151 16.7807 25.8151 16.7807" stroke={strokeColor} strokeWidth="1.365" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23.8699 35.7562C23.8699 35.7562 27.728 47.3695 44.7037 49.6636" stroke={strokeColor} strokeWidth="1.365" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M45.7246 13.69L45.5511 15.0706C45.747 14.2906 45.4711 12.1144 44.7038 11.8765C45.4838 12.0725 46.2804 11.624 46.5173 10.8557C46.3213 11.6357 46.7698 12.4323 47.5381 12.6692C46.7581 12.4732 45.9615 12.9217 45.7246 13.69Z" stroke={strokeColor} strokeWidth="0.39" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.92797 6.57736L6.14344 8.29336C5.90067 7.32421 6.24192 4.61761 7.19742 4.32316C6.22827 4.56594 5.23767 4.00921 4.94322 3.05371C5.18599 4.02286 4.62927 5.01346 3.67377 5.30791C4.64292 5.06514 5.63352 5.62186 5.92797 6.57736Z" stroke={strokeColor} strokeWidth="0.39" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M44.7038 8.29337L49.5583 3.43884" stroke={strokeColor} strokeWidth="0.78" strokeLinejoin="round"/>
        <path d="M42.9644 6.69828L46.4432 0.780029" stroke={strokeColor} strokeWidth="0.78" strokeLinejoin="round"/>
        <path d="M7.25499 11.6309H0.390015" stroke={strokeColor} strokeWidth="0.78" strokeLinejoin="round"/>
        <path d="M8.10715 13.9884L1.46252 15.7142" stroke={strokeColor} strokeWidth="0.78" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="49.92" height="50.31" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
