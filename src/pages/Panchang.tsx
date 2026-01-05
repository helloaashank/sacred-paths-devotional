import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiSun, FiMoon, FiMapPin, FiBell, FiBellOff } from "react-icons/fi";
import panchangData from "@/data/panchang.json";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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

  // Load reminder state on mount
  useEffect(() => {
    setRemindersEnabled(getRemindersEnabled());
    if (isNative) {
      getScheduledCount().then(setScheduledCount);
    }
  }, []);

  // Auto-update to current device date/time
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiCalendar className="text-primary" />
            {t.panchang.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            {t.panchang.subtitle}
          </p>
          
          {/* Reminder Toggle Button */}
          <Button
            variant={remindersEnabled ? "default" : "outline"}
            onClick={handleToggleReminders}
            className={cn(
              "gap-2",
              remindersEnabled && "bg-gradient-hero"
            )}
          >
            {remindersEnabled ? (
              <>
                <FiBell className="animate-pulse" />
                Reminders On ({scheduledCount})
              </>
            ) : (
              <>
                <FiBellOff />
                Enable Festival Reminders
              </>
            )}
          </Button>
        </div>

        {/* Date and City Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Date Picker */}
          <Card className="shadow-soft bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-primary" />
                <h3 className="font-semibold text-foreground">{t.panchang.select_date}:</h3>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <FiCalendar className="mr-2" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* City Selector */}
          <Card className="shadow-soft bg-gradient-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-primary" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{t.panchang.select_city}:</h3>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {panchangData.cities.map((city) => (
                  <Button
                    key={city.id}
                    variant={selectedCity === city.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCity(city.id)}
                    className={`text-xs sm:text-sm ${selectedCity === city.id ? "bg-gradient-hero shadow-soft" : ""}`}
                  >
                    {city.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {dateData ? (
          <div className="space-y-6">
            {/* Date Display */}
            <Card className="shadow-soft bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FiCalendar className="text-primary" />
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </CardTitle>
                <p className="text-muted-foreground">{cityData?.name}</p>
              </CardHeader>
            </Card>

            {/* Panchang Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-soft bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Tithi & Nakshatra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tithi:</span>
                    <span className="font-semibold text-primary">{dateData.tithi}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nakshatra:</span>
                    <span className="font-semibold text-foreground">{dateData.nakshatra}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Yoga:</span>
                    <span className="font-semibold text-foreground">{dateData.yoga}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Karana:</span>
                    <span className="font-semibold text-foreground">{dateData.karana}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FiSun className="text-primary" />
                    Sun & Moon Timings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sunrise:</span>
                    <span className="font-semibold text-foreground">{dateData.sunrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sunset:</span>
                    <span className="font-semibold text-foreground">{dateData.sunset}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FiMoon className="text-sm" /> Moonrise:
                    </span>
                    <span className="font-semibold text-foreground">{dateData.moonrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FiMoon className="text-sm" /> Moonset:
                    </span>
                    <span className="font-semibold text-foreground">{dateData.moonset}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Muhurtas */}
            <Card className="shadow-soft bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Auspicious Muhurtas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(dateData.muhurtas).map(([name, time]) => (
                    <div key={name} className="bg-muted/50 p-4 rounded-lg">
                      <div className="font-semibold text-foreground capitalize mb-1">{name} Muhurta</div>
                      <div className="text-primary font-bold">{time as string}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Festivals */}
            {dateData.festivals && dateData.festivals.length > 0 && (
              <Card className="shadow-elevated bg-gradient-hero">
                <CardHeader>
                  <CardTitle className="text-lg text-primary-foreground">Festivals Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dateData.festivals.map((festival, index) => (
                      <div key={index} className="text-primary-foreground font-semibold text-lg">
                        🎉 {festival}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-muted-foreground">
                Panchang data not available for the selected date and city.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Panchang;