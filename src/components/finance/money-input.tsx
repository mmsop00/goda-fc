"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { formatThousands, reformatMoney } from "@/lib/finance/format";

/** Ô nhập tiền tự thêm dấu chấm. Mỗi lần định dạng lại, trình duyệt đẩy con
 * trỏ về cuối ô — nên tự đặt lại con trỏ ngay sau đúng chữ số người dùng vừa gõ. */
export function MoneyInput({
  value,
  onChange,
  className,
  ...props
}: { value: string; onChange: (digits: string) => void } & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const ref = useRef<HTMLInputElement>(null);

  function commit(raw: string, caret: number) {
    const next = reformatMoney(raw, caret);
    onChange(next.digits);
    // Chờ React vẽ lại giá trị mới rồi mới đặt con trỏ.
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el && document.activeElement === el) el.setSelectionRange(next.caret, next.caret);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const start = el.selectionStart;
    if (start === null || start !== el.selectionEnd) return;
    // Xoá ngay cạnh dấu chấm: xoá luôn chữ số bên kia dấu chấm, nếu không bấm xoá như không có tác dụng.
    if (e.key === "Backspace" && el.value[start - 1] === ".") {
      e.preventDefault();
      commit(el.value.slice(0, start - 2) + el.value.slice(start), start - 2);
    } else if (e.key === "Delete" && el.value[start] === ".") {
      e.preventDefault();
      commit(el.value.slice(0, start) + el.value.slice(start + 2), start);
    }
  }

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatThousands(value)}
        onChange={(e) => commit(e.target.value, e.target.selectionStart ?? e.target.value.length)}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-7 text-right text-base tabular-nums outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">đ</span>
    </div>
  );
}
