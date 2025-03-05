import React, { useState, useEffect } from "react";

const QuickTitles: React.FC = () => {
  const [quickTitle, setQuickTitle] = useState<any | null>(null);

  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      event.preventDefault();

      const target = event.target as HTMLElement;
      const qtElement = target.closest("[data-qt]") as HTMLElement;

      if (!qtElement) return;

      const text = qtElement.getAttribute("data-qt");

      if (!text) return;

      const boundaries = qtElement.getBoundingClientRect();

      setQuickTitle({
        text,
        style: {
          top: boundaries.top + boundaries.height + 20,
          left: boundaries.left + boundaries.width / 2,
        },
      });
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement;

      if (relatedTarget && target.closest("[data-qt]") === relatedTarget.closest("[data-qt]")) {
        return; // Prevent hiding tooltip when moving inside the same element
      }

      setQuickTitle(null);
    };
    const handleMouseLeaveScroll = () => {
      setQuickTitle(null);
    };

    document.addEventListener("mouseover", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("click", handleMouseLeave, true);
    document.addEventListener("scroll", handleMouseLeaveScroll, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("click", handleMouseLeave, true);
      document.removeEventListener("scroll", handleMouseLeaveScroll, true);
    };
  }, []);

  return (
    <>
      {quickTitle && (
        <div className="quick-title" style={quickTitle.style}>
          {quickTitle.text}
        </div>
      )}
    </>
  );
};

export default QuickTitles;