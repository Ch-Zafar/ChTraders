"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <select
            aria-label="Color theme"
            value={mounted ? theme : "system"}
            onChange={(event) => setTheme(event.target.value)}
            disabled={!mounted}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
        </select>
    );
}