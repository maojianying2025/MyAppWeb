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

  const { data: schedules = [] } = useQuery({
    queryKey: ['sales-schedules'],
    queryFn: () => base44.entities.SalesSchedule.list('-date', 500),
  });

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Region.list('-created_date', 100),
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
      days.push(<div key={`empty-${i}`} className="p-1 min-h-[60px] md:min-h-[80px]"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const daySchedules = schedulesByDate[dateStr] || [];
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div 
          key={day} 
          className={`p-1 border border-gray-200 min-h-[60px] md:min-h-[80px] ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
            {day}
          </div>
          <div className="space-y-0.5">
            {daySchedules.slice(0, 3).map((schedule, idx) => (
              <Link 
                key={idx}
                to={createPageUrl(`CustomerDetail?id=${schedule.customer_id}`)}
              >
                <div 
                  className="text-xs p-0.5 rounded truncate cursor-pointer hover:opacity-80"
                  style={{ 
                    backgroundColor: regionColors[schedule.region] + "20",
                    color: regionColors[schedule.region] || "#3B82F6",
                    borderLeft: `3px solid ${regionColors[schedule.region] || "#3B82F6"}`
                  }}
                >
                  {schedule.customer_name}
                </div>
              </Link>
            ))}
            {daySchedules.length > 3 && (
              <div className="text-xs text-gray-500 pl-1">+{daySchedules.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Sales Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={goToToday} size="sm" variant="outline" className="text-xs">
              Today
            </Button>
            <Button onClick={goToPrevMonth} size="sm" variant="ghost">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[120px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button onClick={goToNextMonth} size="sm" variant="ghost">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-7 gap-0 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 p-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0 border-t border-l">
          {renderCalendarDays()}
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs font-semibold text-gray-600 mb-2">Regions</div>
          <div className="flex flex-wrap gap-2">
            {regions.slice(0, 5).map(region => (
              <Badge 
                key={region.id} 
                variant="outline"
                style={{ 
                  backgroundColor: region.color + "20",
                  color: region.color,
                  borderColor: region.color
                }}
              >
                {region.name}
              </Badge>
            ))}
            {regions.length > 5 && (
              <Badge variant="outline" className="text-gray-500">
                +{regions.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}