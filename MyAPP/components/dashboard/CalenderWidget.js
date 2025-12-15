import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    data: schedules = []
  } = useQuery({
    queryKey: ['sales-schedules'],
    queryFn: () => base44.entities.SalesSchedule.list('-date', 500)
  });
  const {
    data: regions = []
  } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Region.list('-created_date', 100)
  });
  const regionColors = regions.reduce((acc, r) => {
    acc[r.name] = r.color || "#3B82F6";
    return acc;
  }, {});
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const date = schedule.date?.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {});
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(/*#__PURE__*/React.createElement("div", {
        key: `empty-${i}`,
        className: "p-1 min-h-[60px] md:min-h-[80px]"
      }));
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const daySchedules = schedulesByDate[dateStr] || [];
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      days.push(/*#__PURE__*/React.createElement("div", {
        key: day,
        className: `p-1 border border-gray-200 min-h-[60px] md:min-h-[80px] ${isToday ? 'bg-blue-50 border-blue-300' : ''}`
      }, /*#__PURE__*/React.createElement("div", {
        className: `text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`
      }, day), /*#__PURE__*/React.createElement("div", {
        className: "space-y-0.5"
      }, daySchedules.slice(0, 3).map((schedule, idx) => /*#__PURE__*/React.createElement(Link, {
        key: idx,
        to: createPageUrl(`CustomerDetail?id=${schedule.customer_id}`)
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xs p-0.5 rounded truncate cursor-pointer hover:opacity-80",
        style: {
          backgroundColor: regionColors[schedule.region] + "20",
          color: regionColors[schedule.region] || "#3B82F6",
          borderLeft: `3px solid ${regionColors[schedule.region] || "#3B82F6"}`
        }
      }, schedule.customer_name))), daySchedules.length > 3 && /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-gray-500 pl-1"
      }, "+", daySchedules.length - 3, " more"))));
    }
    return days;
  };
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "w-5 h-5"
  }), "Sales Calendar"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: goToToday,
    size: "sm",
    variant: "outline",
    className: "text-xs"
  }, "Today"), /*#__PURE__*/React.createElement(Button, {
    onClick: goToPrevMonth,
    size: "sm",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-semibold min-w-[120px] text-center"
  }, MONTHS[month], " ", year), /*#__PURE__*/React.createElement(Button, {
    onClick: goToNextMonth,
    size: "sm",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    className: "w-4 h-4"
  }))))), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4 pt-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-0 mb-2"
  }, DAYS.map(day => /*#__PURE__*/React.createElement("div", {
    key: day,
    className: "text-center text-xs font-semibold text-gray-600 p-1"
  }, day))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-0 border-t border-l"
  }, renderCalendarDays()), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-semibold text-gray-600 mb-2"
  }, "Regions"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, regions.slice(0, 5).map(region => /*#__PURE__*/React.createElement(Badge, {
    key: region.id,
    variant: "outline",
    style: {
      backgroundColor: region.color + "20",
      color: region.color,
      borderColor: region.color
    }
  }, region.name)), regions.length > 5 && /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: "text-gray-500"
  }, "+", regions.length - 5, " more")))));
}