
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    passportNumber: "",
    email: "",
    visaType: "",
    preferredDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.passportNumber || !formData.email || !formData.visaType || !formData.preferredDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would send to backend
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const newBooking = {
      id: Date.now().toString(),
      ...formData,
      submittedDate: new Date().toISOString(),
      status: "pending",
      appointmentDate: null,
    };
    
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    
    toast.success("Booking received. Waiting for admin approval.");
    
    // Reset form
    setFormData({
      fullName: "",
      passportNumber: "",
      email: "",
      visaType: "",
      preferredDate: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Visa Medical Check Booking</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule your medical examination for visa applications with certified healthcare providers
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Quick Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Certified Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">Book Your Medical Examination</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name as on passport"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number *</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                    placeholder="Enter your passport number"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type *</Label>
                  <Select value={formData.visaType} onValueChange={(value) => handleInputChange("visaType", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist">Tourist Visa</SelectItem>
                      <SelectItem value="business">Business Visa</SelectItem>
                      <SelectItem value="student">Student Visa</SelectItem>
                      <SelectItem value="work">Work Visa</SelectItem>
                      <SelectItem value="family">Family Visa</SelectItem>
                      <SelectItem value="transit">Transit Visa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Medical Check Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    className="h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
                  Submit Booking Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Mail className="w-5 h-5" />
            <span>info@visamedcheck.com</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Visa Medical Check Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
