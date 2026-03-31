import TimelineDatePicker from "@/components/TimelineDatePicker";

export default function DatePickerPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-8 gap-3">
      <TimelineDatePicker />
      <p className="text-xs text-gray-400">
        Design inspired by{" "}
        <a
          href="https://x.com/kvnkld"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 transition-colors"
        >
          @kvnkld
        </a>
      </p>
    </div>
  );
}
