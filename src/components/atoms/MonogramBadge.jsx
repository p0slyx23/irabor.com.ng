import { useId } from "react";
import { cx } from "../../core/cx.js";

function TypeScriptLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <rect fill="currentColor" height="56" rx="6" width="56" x="4" y="4" />
      <path d="M18 19H46V26H37.2V48H28.7V26H18V19Z" fill="#FFFFFF" />
      <path
        d="M48 39.7C48 45.3 44 48.6 37.4 48.6C32.3 48.6 28.4 46.5 26.2 42.4L32.8 38.4C33.8 40.5 35.4 41.6 37.7 41.6C39.7 41.6 40.9 40.8 40.9 39.4C40.9 38 39.9 37.2 36.7 36L35 35.4C30.1 33.7 26.8 31.1 26.8 25.5C26.8 20.4 30.7 16.5 36.8 16.5C41.2 16.5 44.4 18 46.7 21.9L40.3 26C38.9 23.5 37.3 22.5 35.1 22.5C32.9 22.5 31.9 23.4 31.9 24.7C31.9 26.3 32.9 26.9 35.4 28L37.1 28.7C42.9 31.2 46.2 33.7 46.2 39.6L48 39.7Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function FlutterLogo() {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="44" height="44" viewBox="0 0 48 48">
<polygon fill="#40c4ff" points="26,4 6,24 12,30 38,4"></polygon><polygon fill="#40c4ff" points="38,22 27,33 21,27 26,22"></polygon><rect width="8.485" height="8.485" x="16.757" y="28.757" fill="#03a9f4" transform="rotate(-45.001 21 33)"></rect><polygon fill="#01579b" points="38,44 26,44 21,39 27,33"></polygon><polygon fill="#084994" points="21,39 30,36 27,33"></polygon>
</svg>
  );
}

function ReactLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      height="44"
      viewBox="0 0 64 64"
      width="44"
    >
      <circle cx="32.001" cy="31.955" r="4.478" fill="#00d8ff" />
      <path
        d="M32.33,22.516c7.635,0.052 15.965,0.609 21.683,5.708c0.168,0.15 0.33,0.306 0.488,0.467c1.349,1.375 2.054,3.595 0.965,5.422c-2.234,3.751 -7.23,5.387 -12.067,6.394c-7.234,1.506 -14.798,1.518 -22.029,0.192c-4.161,-0.764 -8.416,-2.103 -11.373,-4.904c-1.151,-1.09 -2.135,-2.524 -1.981,-4.12c0.25,-2.582 2.727,-4.239 4.812,-5.361c5.791,-3.116 12.847,-3.813 19.502,-3.798Zm-0.554,1.173c-7.224,0.049 -15.043,0.51 -20.621,5.129c-0.195,0.161 -0.383,0.33 -0.564,0.507c-0.117,0.114 -0.23,0.233 -0.339,0.355c-0.979,1.1 -1.316,2.867 -0.392,4.188c0.93,1.329 2.342,2.288 3.796,3.07c5.438,2.924 11.864,3.443 18.129,3.465c6.343,0.023 12.884,-0.555 18.487,-3.452c2.232,-1.155 4.744,-2.851 4.655,-5.035c-0.082,-2.004 -2.036,-3.242 -3.499,-4.126c-0.396,-0.239 -0.803,-0.46 -1.216,-0.668c-5.562,-2.787 -12.08,-3.447 -18.436,-3.433Z"
        fill="#00d8ff"
      />
      <path
        d="M42.115,10.703c2.793,0.071 4.24,3.429 4.431,5.909c0.038,0.493 0.052,0.988 0.046,1.483c-0.006,0.536 -0.035,1.072 -0.082,1.606c-0.589,6.612 -3.608,12.909 -7.163,18.724c-3.477,5.688 -7.717,11.36 -13.485,13.996c-1.907,0.872 -4.175,1.41 -5.863,0.437c-2.314,-1.333 -2.567,-4.451 -2.524,-6.816c0.011,-0.581 0.049,-1.162 0.109,-1.741c0.889,-8.56 5.228,-16.669 10.658,-23.655c3.168,-4.076 6.937,-8.119 11.632,-9.583c0.739,-0.231 1.326,-0.371 2.241,-0.36Zm-0.134,1.172c-3.279,0.052 -6.223,2.482 -8.83,5.007c-6.854,6.637 -11.905,15.464 -13.937,24.721c-0.157,0.717 -0.289,1.439 -0.386,2.166c-0.075,0.563 -0.13,1.129 -0.159,1.697c-0.023,0.452 -0.031,0.905 -0.017,1.358c0.01,0.354 0.033,0.708 0.072,1.06c0.029,0.269 0.068,0.537 0.117,0.803c0.037,0.197 0.08,0.393 0.13,0.588c0.041,0.158 0.087,0.315 0.139,0.471c0.409,1.233 1.463,2.411 2.878,2.45c3.301,0.09 6.409,-2.317 9.096,-4.933c4.717,-4.591 8.232,-10.36 10.978,-16.424c2.216,-4.896 4.243,-10.218 3.111,-15.607c-0.043,-0.204 -0.093,-0.406 -0.15,-0.606c-0.047,-0.163 -0.1,-0.324 -0.158,-0.483c-0.44,-1.199 -1.475,-2.271 -2.884,-2.268Z"
        fill="#00d8ff"
      />
      <path
        d="M22.109,10.747c3.564,0.069 6.765,2.488 9.607,5.197c5.186,4.943 9.011,11.231 11.913,17.849c2.248,5.127 4.316,10.882 2.478,16.292c-0.579,1.705 -2.044,3.265 -3.997,3.305c-3.581,0.072 -6.9,-2.532 -9.78,-5.335c-7.225,-7.034 -12.589,-16.32 -14.427,-26.168c-0.132,-0.704 -0.237,-1.414 -0.309,-2.127c-0.059,-0.582 -0.096,-1.167 -0.106,-1.752c-0.008,-0.472 0.002,-0.944 0.035,-1.414c0.022,-0.314 0.054,-0.626 0.097,-0.937c0.041,-0.292 0.093,-0.583 0.158,-0.871c0.043,-0.191 0.091,-0.38 0.146,-0.568c0.539,-1.843 1.941,-3.485 4.185,-3.471Zm-0.135,1.173c-2.087,0.046 -3.042,2.507 -3.234,4.234c-0.039,0.354 -0.063,0.711 -0.074,1.068c-0.014,0.456 -0.008,0.913 0.015,1.369c0.328,6.599 3.278,12.979 6.838,18.821c3.352,5.5 7.4,10.978 12.968,13.794c1.608,0.813 3.562,1.452 4.951,0.684c1.742,-0.964 1.956,-3.261 2.049,-4.973c0.025,-0.466 0.028,-0.934 0.013,-1.401c-0.018,-0.586 -0.064,-1.171 -0.133,-1.753c-0.642,-5.437 -3.05,-10.582 -5.816,-15.444c-3.442,-6.048 -7.659,-12.076 -13.627,-15.225c-1.236,-0.652 -2.574,-1.185 -3.95,-1.174Z"
        fill="#00d8ff"
      />
    </svg>
  );
}

function PhpLogo() {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      height="44"
      preserveAspectRatio="xMidYMid"
      viewBox="0 -60.5 256 256"
      width="44"
    >
      <defs>
        <radialGradient
          id={gradientId}
          cx="0.8366"
          cy="-125.811"
          gradientTransform="matrix(0.463 0 0 0.463 76.4644 81.9182)"
          gradientUnits="userSpaceOnUse"
          r="363.0565"
        >
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#4C6B97" />
          <stop offset="1" stopColor="#231F20" />
        </radialGradient>
      </defs>
      <g>
        <ellipse cx="128" cy="67.3" fill={`url(#${gradientId})`} rx="128" ry="67.3" />
        <ellipse cx="128" cy="67.3" fill="#6181B6" rx="123" ry="62.3" />
        <g>
          <path
            d="M152.9,87.5c0,0,6.1-31.4,6.1-31.4c1.4-7.1,0.2-12.4-3.4-15.7c-3.5-3.2-9.5-4.8-18.3-4.8h-10.6l3-15.6
              c0.1-0.6,0-1.2-0.4-1.7c-0.4-0.5-0.9-0.7-1.5-0.7h-14.6c-1,0-1.8,0.7-2,1.6l-6.5,33.3c-0.6-3.8-2-7-4.4-9.6
              c-4.3-4.9-11-7.4-20.1-7.4H52.1c-1,0-1.8,0.7-2,1.6L37,104.7c-0.1,0.6,0,1.2,0.4,1.7c0.4,0.5,0.9,0.7,1.5,0.7h14.7
              c1,0,1.8-0.7,2-1.6l3.2-16.3h10.9c5.7,0,10.6-0.6,14.3-1.8c3.9-1.3,7.4-3.4,10.5-6.3c2.5-2.3,4.6-4.9,6.2-7.7l-2.6,13.5
              c-0.1,0.6,0,1.2,0.4,1.7s0.9,0.7,1.5,0.7h14.6c1,0,1.8-0.7,2-1.6l7.2-37h10c4.3,0,5.5,0.8,5.9,1.2c0.3,0.3,0.9,1.5,0.2,5.2
              l-5.8,29.9c-0.1,0.6,0,1.2,0.4,1.7c0.4,0.5,0.9,0.7,1.5,0.7H151C151.9,89.1,152.7,88.4,152.9,87.5z M85.3,61.5
              c-0.9,4.7-2.6,8.1-5.1,10c-2.5,1.9-6.6,2.9-12,2.9h-6.5l4.7-24.2h8.4c6.2,0,8.7,1.3,9.7,2.4C85.8,54.2,86.1,57.3,85.3,61.5z"
            fill="#FFFFFF"
          />
          <path
            d="M215.3,42.9c-4.3-4.9-11-7.4-20.1-7.4h-28.3c-1,0-1.8,0.7-2,1.6l-13.1,67.5c-0.1,0.6,0,1.2,0.4,1.7
              c0.4,0.5,0.9,0.7,1.5,0.7h14.7c1,0,1.8-0.7,2-1.6l3.2-16.3h10.9c5.7,0,10.6-0.6,14.3-1.8c3.9-1.3,7.4-3.4,10.5-6.3
              c2.6-2.4,4.8-5.1,6.4-8c1.6-2.9,2.8-6.1,3.5-9.6C220.9,54.7,219.6,47.9,215.3,42.9z M200,61.5c-0.9,4.7-2.6,8.1-5.1,10
              c-2.5,1.9-6.6,2.9-12,2.9h-6.5l4.7-24.2h8.4c6.2,0,8.7,1.3,9.7,2.4C200.6,54.2,200.9,57.3,200,61.5z"
            fill="#FFFFFF"
          />
        </g>
        <g>
          <path
            d="M74.8,48.2c5.6,0,9.3,1,11.2,3.1c1.9,2.1,2.3,5.6,1.3,10.6c-1,5.2-3,9-5.9,11.2c-2.9,2.2-7.3,3.3-13.2,3.3
              h-8.9l5.5-28.2H74.8z M39,105h14.7l3.5-17.9h12.6c5.6,0,10.1-0.6,13.7-1.8c3.6-1.2,6.8-3.1,9.8-5.9c2.5-2.3,4.5-4.8,6-7.5
              c1.5-2.7,2.6-5.7,3.2-9c1.6-8,0.4-14.2-3.5-18.7c-3.9-4.5-10.1-6.7-18.6-6.7H52.1L39,105z"
            fill="#000004"
          />
          <path
            d="M113.3,19.6h14.6l-3.5,17.9h13c8.2,0,13.8,1.4,16.9,4.3c3.1,2.9,4,7.5,2.8,13.9L151,87.1h-14.8l5.8-29.9
              c0.7-3.4,0.4-5.7-0.7-6.9c-1.1-1.2-3.6-1.9-7.3-1.9h-11.7l-7.5,38.7h-14.6L113.3,19.6z"
            fill="#000004"
          />
          <path
            d="M189.5,48.2c5.6,0,9.3,1,11.2,3.1c1.9,2.1,2.3,5.6,1.3,10.6c-1,5.2-3,9-5.9,11.2c-2.9,2.2-7.3,3.3-13.2,3.3
              h-8.9l5.5-28.2H189.5z M153.7,105h14.7l3.5-17.9h12.6c5.6,0,10.1-0.6,13.7-1.8c3.6-1.2,6.8-3.1,9.8-5.9c2.5-2.3,4.5-4.8,6-7.5
              c1.5-2.7,2.6-5.7,3.2-9c1.6-8,0.4-14.2-3.5-18.7c-3.9-4.5-10.1-6.7-18.6-6.7h-28.3L153.7,105z"
            fill="#000004"
          />
        </g>
      </g>
    </svg>
  );
}

function FirebaseLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="44"
      height="44"
      viewBox="0 0 48 48"
    >
      <path
        fill="#ff8f00"
        d="M8,37L23.234,8.436c0.321-0.602,1.189-0.591,1.494,0.02L30,19L8,37z"
      ></path>
      <path
        fill="#ffa000"
        d="M8,36.992l5.546-34.199c0.145-0.895,1.347-1.089,1.767-0.285L26,22.992L8,36.992z"
      ></path>
      <path
        fill="#ff6f00"
        d="M8.008 36.986L8.208 36.829 25.737 22.488 20.793 13.012z"
      ></path>
      <path
        fill="#ffc400"
        d="M8,37l26.666-25.713c0.559-0.539,1.492-0.221,1.606,0.547L40,37l-15,8.743 c-0.609,0.342-1.352,0.342-1.961,0L8,37z"
      ></path>
    </svg>
  );
}

function NodeLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <path
        d="M32 6L51.92 17.5V46.5L32 58L12.08 46.5V17.5L32 6Z"
        fill="currentColor"
      />
      <path
        d="M24 42V22L40 32V42"
        fill="none"
        stroke="#FFFFFF"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M24 22L40 32"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function DartLogo() {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="44" height="44" viewBox="0 0 48 48">
<path fill="#1565c0" d="M10,12l3,25l-8.019-8.019c-1.189-1.189-1.508-2.996-0.796-4.52L10,12z"></path><path fill="#42a5f5" d="M27.319,6.319C26.474,5.474,25.329,5,24.135,5c-0.745,0-1.479,0.185-2.135,0.538L10,12v20.343 c0,1.061,0.421,2.078,1.172,2.828L13,37h22v-5l7-11L27.319,6.319z"></path><path fill="#1565c0" d="M10,12h21.343c1.061,0,2.078,0.421,2.828,1.172L42,21v16h-7L10,12z"></path><polygon fill="#85cbf8" points="35,37 13,37 19,43 35,43"></polygon>
</svg>
  );
}

function CssLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <path d="M12 8H52L48 52L32 56L16 52L12 8Z" fill="currentColor" />
      <path
        d="M24 18H42L41 24H29L29.7 30H40.1L38.6 44L32 46L25.4 44L24.8 37H30.8L31 39L32 39.3L33 39L33.7 34H23.7L21.8 18H24Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function NpmLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo monogram-badge__logo--wide"
      viewBox="0 0 96 40"
    >
      <path d="M4 8H92V32H70V20H60V32H4V8Z" fill="currentColor" />
      <path
        d="M12 14H18V26H24V14H30V26H36V14H42V26H48V14H54V26H60V14H78V26H84V14H88V28H72V20H66V28H48V20H42V28H24V20H18V28H12V14Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function TestingLibraryLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <path
        d="M24 12H40V16H36V24L47 43C48.3 45.3 46.7 48 44 48H20C17.3 48 15.7 45.3 17 43L28 24V16H24V12Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M24 40C27.5 34.8 31.7 32.2 36.6 32.2C40.1 32.2 43.2 33.8 46 37V43C46 44.7 44.7 46 43 46H21C19.3 46 18 44.7 18 43V40H24Z"
        fill="currentColor"
      />
      <circle cx="32" cy="22" fill="currentColor" r="2.5" />
    </svg>
  );
}

function FigmaGlyphLogo() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 500C0 444.772 44.772 400 100 400H200V500C200 555.228 155.228 600 100 600C44.772 600 0 555.228 0 500Z"
        fill="#24CB71"
      />
      <path
        d="M200 0V200H300C355.228 200 400 155.228 400 100C400 44.772 355.228 0 300 0H200Z"
        fill="#FF7237"
      />
      <path
        d="M299.167 400C354.395 400 399.167 355.228 399.167 300C399.167 244.772 354.395 200 299.167 200C243.939 200 199.167 244.772 199.167 300C199.167 355.228 243.939 400 299.167 400Z"
        fill="#00B6FF"
      />
      <path
        d="M0 100C0 155.228 44.772 200 100 200H200V0H100C44.772 0 0 44.772 0 100Z"
        fill="#FF3737"
      />
      <path
        d="M0 300C0 355.228 44.772 400 100 400H200V200H100C44.772 200 0 244.772 0 300Z"
        fill="#874FFF"
      />
    </svg>
  );
}

function IconLibraryLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <rect
        fill="none"
        height="40"
        rx="8"
        stroke="currentColor"
        strokeWidth="3"
        width="40"
        x="12"
        y="12"
      />
      <circle cx="24" cy="24" fill="currentColor" r="4" />
      <circle cx="40" cy="24" fill="currentColor" r="4" />
      <circle cx="24" cy="40" fill="currentColor" r="4" />
      <path
        d="M36 36L44 44"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M44 36L36 44"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function DesignSystemLogo() {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo"
      viewBox="0 0 64 64"
    >
      <rect
        fill="none"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="3"
        width="16"
        x="10"
        y="10"
      />
      <rect fill="currentColor" height="16" rx="3" width="16" x="30" y="10" />
      <rect
        fill="currentColor"
        height="16"
        opacity="0.7"
        rx="3"
        width="16"
        x="10"
        y="30"
      />
      <rect
        fill="none"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="3"
        width="16"
        x="30"
        y="30"
      />
    </svg>
  );
}

function GenericWordmarkLogo({ label }) {
  return (
    <svg
      aria-hidden="true"
      className="monogram-badge__logo monogram-badge__logo--wide"
      viewBox="0 0 96 40"
    >
      <rect
        fill="none"
        height="30"
        rx="6"
        stroke="currentColor"
        strokeWidth="3"
        width="88"
        x="4"
        y="5"
      />
      <text
        dominantBaseline="middle"
        fill="currentColor"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
        x="48"
        y="22"
      >
        {label}
      </text>
    </svg>
  );
}

function renderLogoForLabel(label = "") {
  const safeLabel = typeof label === "string" ? label.trim() : "";

  if (!safeLabel) {
    return <GenericWordmarkLogo label="" />;
  }

  const normalizedLabel = safeLabel.toLowerCase();

  switch (normalizedLabel) {
    case "fl":
    case "flutter":
      return <FlutterLogo />;
    case "fb":
    case "firebase":
      return <FirebaseLogo />;
    case "ts":
      return <TypeScriptLogo />;
    case "dt":
    case "dart":
      return <DartLogo />;
    case "php":
      return <PhpLogo />;
    case "r":
    case "react":
      return <ReactLogo />;
    case "n":
    case "node":
      return <NodeLogo />;
    case "css":
    case "css3":
      return <CssLogo />;
    case "npm":
      return <NpmLogo />;
    case "tl":
      return <TestingLibraryLogo />;
    case "fg":
      return <FigmaGlyphLogo />;
    case "icons":
      return <IconLibraryLogo />;
    case "system":
    case "ds":
      return <DesignSystemLogo />;
    default:
      return <GenericWordmarkLogo label={safeLabel} />;
  }
}

export function MonogramBadge({
  className,
  imageAlt = "",
  imageSrc = "",
  label = "",
  size = "md",
  tone = "neutral",
}) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "monogram-badge",
        `monogram-badge--${size}`,
        `monogram-badge--${tone}`,
        className,
      )}
    >
      {imageSrc ? (
        <img
          alt={imageAlt}
          className="monogram-badge__image"
          loading="lazy"
          src={imageSrc}
        />
      ) : (
        renderLogoForLabel(label)
      )}
    </div>
  );
}
