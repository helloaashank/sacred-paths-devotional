import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiSun, FiMoon, FiMapPin, FiBell, FiBellOff, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import panchangData from "@/data/panchang.json";
import { format, addDays, subDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePanchangReminders } from "@/hooks/usePanchangReminders";
import { toast } from "sonner";

const Panchang = () => {
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const { t } = useLanguage();
  
  const {
    isNative,
    getRemindersEnabled,
    scheduleAllReminders,
    cancelAllReminders,
    getScheduledCount,
  } = usePanchangReminders();

  useEffect(() => {
    setRemindersEnabled(getRemindersEnabled());
    if (isNative) {
      getScheduledCount().then(setScheduledCount);
    }
  }, []);

  const handleToggleReminders = async () => {
    if (remindersEnabled) {
      await cancelAllReminders();
      setRemindersEnabled(false);
      setScheduledCount(0);
      toast.success("Festival reminders disabled");
    } else {
      const count = await scheduleAllReminders(selectedCity);
      if (count > 0) {
        setRemindersEnabled(true);
        setScheduledCount(count);
        toast.success(`${count} festival reminders scheduled`);
      } else if (!isNative) {
        toast.info("Reminders work on Android app only");
      } else {
        toast.error("Failed to schedule reminders");
      }
    }
  };

  const cityData = panchangData.cities.find((city) => city.id === selectedCity);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dateData = panchangData.data[formattedDate]?.[selectedCity];

  const navigateDate = (direction: "prev" | "next") => {
    setSelectedDate(direction === "prev" ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
  };

  return (
    <div className="px-4 py-4">
      {/* Date Navigation */}
      <Card className="mb-4 bg-gradient-hero">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate("prev")}
              className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <FiChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center text-primary-foreground">
              <div className="text-lg font-semibold">{format(selectedDate, "EEEE")}</div>
              <div className="text-sm opacity-90">{format(selectedDate, "MMM d, yyyy")}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate("next")}
              className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <FiChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* City Selector - Horizontal Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {panchangData.cities.map((city) => (
          <Button
            key={city.id}
            variant={selectedCity === city.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCity(city.id)}
            className={`flex-shrink-0 text-xs h-8 ${
              selectedCity === city.id ? "bg-gradient-hero" : ""
            }`}
          >
            <FiMapPin className="h-3 w-3 mr-1" />
            {city.name}
          </Button>
        ))}
      </div>

      {dateData ? (
        <div className="space-y-3">
          {/* Festivals Alert */}
          {dateData.festivals && dateData.festivals.length > 0 && (
            <Card className="bg-gradient-hero border-0">
              <CardContent className="p-4">
                <div className="text-primary-foreground">
                  <div className="text-xs font-medium opacity-80 mb-1">Festival Today</div>
                  {dateData.festivals.map((festival, index) => (
                    <div key={index} className="text-base font-semibold">
                      🎉 {festival}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tithi & Nakshatra */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tithi</div>
                  <div className="font-semibold text-sm text-primary">{dateData.tithi}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Nakshatra</div>
                  <div className="font-semibold text-sm">{dateData.nakshatra}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Yoga</div>
                  <div className="font-semibold text-sm">{dateData.yoga}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Karana</div>
                  <div className="font-semibold text-sm">{dateData.karana}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sun & Moon Timings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiSun className="text-primary h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timings</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5">
                  <FiSun className="text-amber-500 h-4 w-4" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Sunrise</div>
                    <div className="text-sm font-medium">{dateData.sunrise}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5">
                  <FiSun className="text-orange-500 h-4 w-4" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Sunset</div>
                    <div className="text-sm font-medium">{dateData.sunset}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5">
                  <FiMoon className="text-slate-400 h-4 w-4" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Moonrise</div>
                    <div className="text-sm font-medium">{dateData.moonrise}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5">
                  <FiMoon className="text-slate-500 h-4 w-4" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Moonset</div>
                    <div className="text-sm font-medium">{dateData.moonset}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Muhurtas */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Auspicious Muhurtas
              </h3>
              <div className="space-y-2">
                {Object.entries(dateData.muhurtas).map(([name, time]) => (
                  <div key={name} className="flex justify-between items-center bg-muted/50 rounded-lg p-3">
                    <span className="font-medium text-sm capitalize">{name}</span>
                    <span className="text-sm text-primary font-semibold">{time as string}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reminder Toggle */}
          <Button
            variant="outline"
            onClick={handleToggleReminders}
            className="w-full h-12 gap-2"
          >
            {remindersEnabled ? (
              <>
                <FiBell className="h-4 w-4 text-primary" />
                <span>Reminders On ({scheduledCount})</span>
              </>
            ) : (
              <>
                <FiBellOff className="h-4 w-4" />
                <span>Enable Festival Reminders</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FiCalendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No data available for this date
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Panchang;
