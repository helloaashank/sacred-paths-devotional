import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiSun, FiMoon, FiMapPin } from "react-icons/fi";
import panchangData from "@/data/panchang.json";
import { format } from "date-fns";

const Panchang = () => {
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [selectedDate] = useState("2025-01-15");

  const cityData = panchangData.cities.find((city) => city.id === selectedCity);
  const dateData = panchangData.data[selectedDate]?.[selectedCity];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiCalendar className="text-primary" />
            Panchang
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Daily auspicious timings and Hindu calendar
          </p>
        </div>

        {/* City Selector */}
        <Card className="mb-8 shadow-soft bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="text-primary" />
              <h3 className="font-semibold text-foreground">Select City:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {panchangData.cities.map((city) => (
                <Button
                  key={city.id}
                  variant={selectedCity === city.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city.id)}
                  className={selectedCity === city.id ? "bg-gradient-hero shadow-soft" : ""}
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {dateData ? (
          <div className="space-y-6">
            {/* Date Display */}
            <Card className="shadow-soft bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FiCalendar className="text-primary" />
                  {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
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