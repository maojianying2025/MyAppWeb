import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Item } from "@/entities/Item";
import { Board } from "@/entities/Board";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast } from 'date-fns';
import { motion } from "framer-motion";
export default function CalendarModal({
  isOpen,
  onClose
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      loadCalendarData();
    }
  }, [isOpen]);
  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, boardsData] = await Promise.all([Item.list("-updated_date"), Board.list("-updated_date")]);
      setItems(itemsData);
      setBoards(boardsData);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
    setIsLoading(false);
  };
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  // Get items with due dates
  const getItemsForDate = date => {
    return items.filter(item => {
      const board = boards.find(b => b.id === item.board_id);
      const dueDateColumn = board?.columns?.find(col => col.type === 'date');
      const dueDate = item.data?.[dueDateColumn?.id];
      if (!dueDate) return false;
      return isSameDay(new Date(dueDate), date);
    });
  };
  const getItemStatus = item => {
    const board = boards.find(b => b.id === item.board_id);
    const statusColumn = board?.columns?.find(col => col.type === 'status');
    return item.data?.[statusColumn?.id] || 'Not Started';
  };
  const isOverdue = (item, date) => {
    const status = getItemStatus(item);
    return isPast(date) && status !== 'Done' && !isToday(date);
  };
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-4xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-2xl font-bold text-[#323338] flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "w-6 h-6 text-[#0073EA]"
  }), "Calendar Overview")), /*#__PURE__*/React.createElement("div", {
    className: "py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-[#323338]"
  }, format(currentDate, 'MMMM yyyy')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon",
    onClick: previousMonth,
    className: "h-8 w-8 rounded-lg"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon",
    onClick: nextMonth,
    className: "h-8 w-8 rounded-lg"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    className: "w-4 h-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-2"
  }, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => /*#__PURE__*/React.createElement("div", {
    key: day,
    className: "p-2 text-center text-sm font-medium text-[#676879]"
  }, day)), monthDays.map((date, index) => {
    const dayItems = getItemsForDate(date);
    const hasOverdue = dayItems.some(item => isOverdue(item, date));
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    return /*#__PURE__*/React.createElement(motion.div, {
      key: date.toISOString(),
      initial: {
        opacity: 0,
        scale: 0.8
      },
      animate: {
        opacity: 1,
        scale: 1
      },
      transition: {
        delay: index * 0.01
      },
      className: `
                    relative p-2 min-h-[60px] border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${isSameMonth(date, currentDate) ? 'bg-white border-[#E1E5F3]' : 'bg-gray-50 border-gray-200'}
                    ${isToday(date) ? 'ring-2 ring-[#0073EA] ring-opacity-50' : ''}
                    ${isSelected ? 'bg-[#0073EA] text-white' : ''}
                    ${hasOverdue ? 'border-red-300 bg-red-50' : ''}
                  `,
      onClick: () => setSelectedDate(date)
    }, /*#__PURE__*/React.createElement("div", {
      className: `text-sm font-medium mb-1 ${isSelected ? 'text-white' : isToday(date) ? 'text-[#0073EA]' : 'text-[#323338]'}`
    }, format(date, 'd')), dayItems.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, dayItems.slice(0, 2).map((item, itemIndex) => {
      const status = getItemStatus(item);
      const board = boards.find(b => b.id === item.board_id);
      const isItemOverdue = isOverdue(item, date);
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        className: `text-xs p-1 rounded truncate ${isSelected ? 'bg-white/20 text-white' : isItemOverdue ? 'bg-red-100 text-red-800' : 'bg-[#F5F6F8] text-[#323338]'}`,
        title: item.title
      }, item.title);
    }), dayItems.length > 2 && /*#__PURE__*/React.createElement("div", {
      className: `text-xs ${isSelected ? 'text-white/80' : 'text-[#676879]'}`
    }, "+", dayItems.length - 2, " more")), hasOverdue && /*#__PURE__*/React.createElement(AlertCircle, {
      className: "absolute top-1 right-1 w-3 h-3 text-red-500"
    }));
  })), selectedDate && selectedDateItems.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 p-4 bg-[#F5F6F8] rounded-xl"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-[#323338] mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-4 h-4"
  }), format(selectedDate, 'EEEE, MMMM d, yyyy'), " (", selectedDateItems.length, " tasks)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, selectedDateItems.map(item => {
    const status = getItemStatus(item);
    const board = boards.find(b => b.id === item.board_id);
    const isItemOverdue = isOverdue(item, selectedDate);
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: "flex items-center justify-between p-3 bg-white rounded-lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-3 h-3 rounded-full",
      style: {
        backgroundColor: board?.color || '#0073EA'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-medium text-[#323338]"
    }, item.title), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-[#676879]"
    }, board?.title))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, isItemOverdue && /*#__PURE__*/React.createElement(Badge, {
      className: "bg-red-100 text-red-800 border-red-200"
    }, /*#__PURE__*/React.createElement(AlertCircle, {
      className: "w-3 h-3 mr-1"
    }), "Overdue"), /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, status)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onClose,
    className: "bg-[#0073EA] hover:bg-[#0056B3] text-white rounded-xl h-12 px-6"
  }, "Close"))));
}