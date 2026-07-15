'use client'
import React from "react";
import "@/components/Navbar/Navbar.css";
import Radio from "@/components/fundamentals/Radio/Radio";

export default function Navbar() {
    return (
        <div className="navbar">
            <Radio values={["Goal", "Habit"]} size="large" name="mode" checked="Goal"></Radio>
            <Radio values={["Daily","Weekly","Monthly"]} size="medium" name="period" checked="Daily"></Radio>
        </div>
    );
}
