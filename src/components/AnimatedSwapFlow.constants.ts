export type Scene = "form" | "review" | "pending" | "success";

export type TimelineItem = {
  label: string;
  value: string;
  accent?: "green";
  last?: boolean;
};

export type ConfettiPiece = {
  color: string;
  delay: string;
  duration: string;
  left: string;
  rotate: string;
  size: string;
  shape: string;
};

export const FORM_AMOUNT = 253;
export const RECEIVE_AMOUNT = 456.26;
export const PENDING_SECONDS = 4;
export const REVIEW_SECONDS = 20;
export const PROGRESS_CIRCUMFERENCE = 678.58;

export const timelineItems: TimelineItem[] = [
  { label: "Network fee", value: "Free", accent: "green" },
  { label: "Gas reimbursement", value: "20.45 USDT ($20.43)" },
  { label: "Matcha fee 0.1%", value: "2.45 USDT ($2.43)" },
  { label: "Amount we convert", value: "236 USDT" },
  { label: "You will receive exactly", value: "236 MATIC", last: true },
];

export const confettiPieces: ConfettiPiece[] = [
  {
    color: "#ffcab0",
    delay: "0.05s",
    duration: "4.6s",
    left: "6%",
    rotate: "-8deg",
    size: "10px",
    shape: "50%",
  },
  {
    color: "#f6d582",
    delay: "0.3s",
    duration: "3.8s",
    left: "15%",
    rotate: "22deg",
    size: "8px",
    shape: "2px",
  },
  {
    color: "#b8d8ff",
    delay: "0.55s",
    duration: "4.9s",
    left: "24%",
    rotate: "-12deg",
    size: "11px",
    shape: "50%",
  },
  {
    color: "#ffd3de",
    delay: "0.15s",
    duration: "4.2s",
    left: "32%",
    rotate: "18deg",
    size: "10px",
    shape: "2px",
  },
  {
    color: "#d6f2ce",
    delay: "0.9s",
    duration: "3.6s",
    left: "40%",
    rotate: "9deg",
    size: "9px",
    shape: "50%",
  },
  {
    color: "#ffddb0",
    delay: "0.45s",
    duration: "4.5s",
    left: "48%",
    rotate: "-18deg",
    size: "14px",
    shape: "2px",
  },
  {
    color: "#c7dbff",
    delay: "0.1s",
    duration: "5.2s",
    left: "58%",
    rotate: "15deg",
    size: "8px",
    shape: "50%",
  },
  {
    color: "#ffe2a7",
    delay: "0.8s",
    duration: "4.3s",
    left: "66%",
    rotate: "-7deg",
    size: "12px",
    shape: "2px",
  },
  {
    color: "#ffd1d1",
    delay: "0.25s",
    duration: "3.9s",
    left: "76%",
    rotate: "28deg",
    size: "9px",
    shape: "50%",
  },
  {
    color: "#bdeaf4",
    delay: "0.65s",
    duration: "4.7s",
    left: "86%",
    rotate: "-25deg",
    size: "7px",
    shape: "2px",
  },
  {
    color: "#f9ce98",
    delay: "1.1s",
    duration: "4.1s",
    left: "93%",
    rotate: "14deg",
    size: "15px",
    shape: "2px",
  },
];

export function formatPending(seconds: number) {
  return `00:0${seconds}`;
}

export function easeOutExpo(progress: number) {
  return progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
}
