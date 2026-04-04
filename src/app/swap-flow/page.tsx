"use client";

import { AnimatedSwapFlow } from "@/components/AnimatedSwapFlow";
import ComponentShell from "@/components/ComponentShell";

const CODE_CONTENT = `// ============================================
// Animated Swap Flow — Multi-file Component
// ============================================
//
// File structure:
//   src/components/AnimatedSwapFlow.tsx          — Main component (state, scene orchestration)
//   src/components/AnimatedSwapFlow.constants.ts — Types, asset data, config constants
//   src/components/AnimatedSwapFlow.utils.ts     — Numeric formatting, price calculations
//   src/components/AnimatedSwapFlowFormSection.tsx — Form scene (pay/receive inputs, asset menus, settings)
//   src/components/AnimatedSwapFlowIcons.tsx      — SVG icon components (lucide-react wrappers + custom)
//   src/components/AnimatedSwapFlowScenes.tsx     — Review, Pending, and Success scene components
//   src/components/AnimatedSwapFlow.module.css    — Core layout and scene transition styles
//   src/components/AnimatedSwapFlowForm.module.css — Form-specific styles
//   src/components/AnimatedSwapFlowSuccess.module.css — Success scene + confetti styles
//
// Dependencies: react, lucide-react, CSS Modules
//
// ============================================
// page.tsx (wrapper)
// ============================================
// "use client";
// import { AnimatedSwapFlow } from "@/components/AnimatedSwapFlow";
//
// export default function SwapFlowPage() {
//   return (
//     <div className="mx-auto flex w-full max-w-5xl justify-center py-2
//       sm:min-h-[calc(100dvh-3rem)] sm:items-center">
//       <AnimatedSwapFlow />
//     </div>
//   );
// }
//
// ============================================
// AnimatedSwapFlow.constants.ts (key exports)
// ============================================
// Types: Scene ("form"|"review"|"pending"|"success"), FormMode ("market"|"limit"),
//        AssetOption (symbol, name, balance, icon, tone, usdPrice)
// Assets: USDT (price 1), MATIC (price 0.56), ETH (price 1730)
// Constants: FORM_AMOUNT=253, RECEIVE_AMOUNT=456.26, REVIEW_SECONDS=20,
//            PENDING_SECONDS=4, PROGRESS_CIRCUMFERENCE=678.58
// Options: slippage ["0.5%","1.0%","2.0%"], market tx types, limit tx types,
//          timeInForce options, timeline items, confetti pieces
//
// ============================================
// AnimatedSwapFlow.utils.ts (key exports)
// ============================================
// sanitizeNumericInput(value) — strips non-numeric chars, handles decimals
// toNumeric(value) — safe string-to-number
// formatEditableAmount(value, decimals) — formats for display
// formatLimitPrice(value) — 4-decimal fixed format
// formatUsd(value) — Intl.NumberFormat USD formatter
// calculateReceiveFromPay({payValue, payAsset, receiveAsset, mode, limitPrice})
// calculatePayFromReceive({receiveValue, payAsset, receiveAsset, mode, limitPrice})
//
// ============================================
// AnimatedSwapFlow.tsx (main component, abbreviated)
// ============================================
// export function AnimatedSwapFlow() {
//   // Scene state: "form" | "review" | "pending" | "success"
//   const [scene, setScene] = useState<Scene>("form");
//   const [formMode, setFormMode] = useState<FormMode>("market");
//   const [payAsset, setPayAsset] = useState(assetOptions[0]);
//   const [receiveAsset, setReceiveAsset] = useState(assetOptions[1]);
//   const [typedAmount, setTypedAmount] = useState("");
//   const [receiveAmount, setReceiveAmount] = useState("");
//   const [quoteReady, setQuoteReady] = useState(false);
//   // + quoteSeconds, pendingSeconds, pendingProgress, settingsOpen,
//   //   slippage, mevProtection, assetMenuTarget, transactionType,
//   //   limitPrice, timeInForce, etc.
//
//   // Animation helpers: schedule(), animateValue() with easeOutExpo
//   // Quote helpers: updateQuoteFromPay(), updateQuoteFromReceive(), populateQuote()
//   // Handlers: handlePayInputChange, handleReceiveInputChange,
//   //   handleFormModeChange, handleSwapDirection, handleAssetSelect,
//   //   handleLimitPriceChange, handleReview, etc.
//
//   // Scene effects:
//   //   "review" — countdown from REVIEW_SECONDS to 0
//   //   "pending" — animate progress ring over 4s, then transition to "success"
//
//   return (
//     <div className={styles.shell}>
//       <div className={styles.frame} ref={frameRef}>
//         <FormSection ... />    {/* form scene */}
//         <ReviewScene ... />    {/* review scene */}
//         <PendingScene ... />   {/* pending scene with timer ring */}
//         <SuccessScene ... />   {/* success scene with confetti */}
//       </div>
//     </div>
//   );
// }
//
// ============================================
// FormSection (AnimatedSwapFlowFormSection.tsx)
// ============================================
// - Market/Limit tabs at top, gear icon for settings dropdown
// - Settings: slippage tolerance chips, MEV protection toggle
// - "Pay with" input: asset badge (dropdown), MAX/50%/25% pills, amount input
// - Swap direction button (flips pay <-> receive with limit price inversion)
// - "You receive" input: asset badge (dropdown), amount input
// - Quote meta: transaction type dropdown, fee display
// - Limit mode extras: limit price input, time-in-force dropdown
// - "Review order" / "Review limit order" CTA
//
// ============================================
// Scene components (AnimatedSwapFlowScenes.tsx)
// ============================================
// ReviewScene: back button, quote expiry countdown, pay/receive cards with
//   USD values, timeline (network fee, gas, Matcha fee, amounts),
//   info grid (liquidity provider, rate, price impact), "Place Order" CTA
//
// PendingScene: SVG circular progress timer (strokeDashoffset animation),
//   countdown display, "Transaction pending..." text, "See Details" button
//
// SuccessScene: glow effect, animated confetti field (11 pieces with
//   varied colors/delays/durations), check badge, swap summary,
//   "See Details" + "New Trade" buttons`;

const PROMPT_CONTENT = `Create an animated token swap flow component (like Matcha/Uniswap) with four scenes that transition smoothly:

**Form Scene (main):**
- Two-tab header: Market / Limit mode toggle
- Gear icon opens a settings dropdown with slippage tolerance chips (0.5%, 1.0%, 2.0%) and MEV Protection toggle
- "Pay with" section: token badge button (opens asset dropdown with USDT/MATIC/ETH showing balances), amount input, quick-fill pills (MAX, 50%, 25% in market mode; "Use Mid Price" in limit mode)
- Swap direction button in the middle that flips both assets and inverts the limit price
- "You receive" section: same asset selector + amount input, auto-calculated from pay amount using USD price ratios
- Quote metadata appears when amounts are filled: transaction type dropdown (Matcha Auto/Direct Route/Gas Saver for market; Post-Only/Fill or Kill/IoC for limit), fee display
- Limit mode adds: editable limit price input (pay/receive pair), time-in-force dropdown (Good till canceled, 24h, 7 days)
- Primary CTA: "Review order" (disabled until quote ready)
- Amounts animate in with easeOutExpo when using quick-fill buttons

**Review Scene:**
- Back button, "Quote expires in Ns" countdown (from 20s)
- Two cards showing pay and receive amounts with USD values, connected by arrow
- Fee timeline: network fee (Free), gas reimbursement, Matcha fee, conversion amount, final receive amount
- Info grid: liquidity provider (0x Protocol), exchange rate, price impact
- "Place Order" CTA

**Pending Scene:**
- Large SVG circular progress ring (strokeDashoffset animation over 4 seconds)
- Countdown timer display (00:04 to 00:00)
- "Transaction pending..." text
- Auto-transitions to success after 4.3 seconds

**Success Scene:**
- Green glow background effect
- Animated confetti field (11 pieces with varied colors, delays, durations, shapes)
- Green checkmark badge
- Swap summary showing both token amounts with icons
- "Swapped Via 0x Protocol" caption
- "See Details" + "New Trade" buttons (New Trade resets to form)

**Technical details:**
- Three asset options: USDT ($1), MATIC ($0.56), ETH ($1730) with balances
- Selecting an asset that matches the other side auto-swaps them
- All numeric inputs sanitized (single decimal point, digits only)
- CSS Modules for styling with scene transitions (active/hidden states)
- SVG icons for tokens (Tether=green circle, Polygon=purple gradient, Ethereum=blue gradient)
- useRef for scheduling timeouts/rafs with cleanup on unmount`;


export default function SwapFlowPage() {
  return (
    <ComponentShell title="Swap Flow" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="mx-auto flex w-full max-w-5xl justify-center py-2 sm:min-h-[calc(100dvh-3rem)] sm:items-center">
        <AnimatedSwapFlow />
      </div>
    </ComponentShell>
  );
}
