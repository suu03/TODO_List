"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left w-full md:w-auto"
      ref={dropdownRef}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="w-full cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute mt-2 w-56 rounded-md shadow-lg bg-slate-600 ring-1 ring-black ring-opacity-5 z-50`}
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            right: align === "right" ? "0px" : "auto",
            left: align === "left" ? "0px" : "auto",
            transform: "translateX",
            minWidth: "200px",
            maxWidth: "90vw",
            overflowX: "hidden",
          }}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  children,
}) => (
  <a
    href="#"
    className="block px-4 py-2 text-sm text-white hover:bg-slate-600 hover:text-orange-400 w-full text-left"
    role="menuitem"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
);
