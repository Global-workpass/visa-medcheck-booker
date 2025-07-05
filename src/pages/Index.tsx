import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Phone, Mail, Shield, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    passportNumber: "",
    email: "",
    visaType: "",
    preferredDate: "",
  });
  const [isSubmitting, setIsSubmitting = useState(false);
  const [isSubmitted, setIsSubmitted = useState(false);
  const [bookingStatus, setBookingStatus = useState<string>(");
  const [isRefreshing, setIsRefreshing = useState(false);

  useEffect(() => {
    let channel: any = null;

    if (isSubmitted && formData.passportNumber) {
      // Listen for approval updates
      channel = supabase
        .channel('booking-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
            filter: `passport_number=eq.${formData.passportNumber}`
          },
          (payload) => {
            console.log('Booking update received:', payload);
            if (payload.new.status === 'approved') {
              setBookingStatus('approved');
              toast.success("Your booking has been approved! Please proceed to the medical center on your scheduled date.", {
                duration: 15000,
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isSubmitted, formData.passportNumber]);

  const checkBookingStatus = async () => {
    if (!formData.passportNumber) return;

    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('passport_number', formData.passportNumber)
        .single();

      if (error) {
        console.error('Error checking booking status:', error);
        toast.error("Failed to check booking status");
        return;
      }

      if (data?.status === 'approved' && bookingStatus !== 'approved') {
        setBookingStatus('approved');
        toast.success("Your booking has been approved! Please proceed to the medical center on your scheduled date.", {
          duration: 15000,
        });
      } else if (data?.status === 'pending') {
        toast.info("Your booking is still pending approval");
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
      toast.error("Failed to check booking status");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.passportNumber || !formData.email || !formData.visaType || !formData.preferredDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          passport_number: formData.passportNumber,
          full_name: formData.fullName,
          email: formData.email,
          visa_type: formData.visaType,
          preferred_date: formData.preferredDate,
        });

      if (error) {
        console.error('Error submitting booking:', error);
        toast.error("Failed to submit booking. Please try again.");
        return;
      }

      // Show waiting for approval toast
      toast.success("Booking submitted successfully! Awaiting approval from our team.", {
        duration: 10000,
      });
      
      // Set submitted state and initial status
      setIsSubmitted(true);
      setBookingStatus('pending');

      // Trigger refresh for admin page
      window.dispatchEvent(new CustomEvent('bookingSubmitted'));
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewBooking = () => {
    setIsSubmitted(false);
    setBookingStatus("");
    setFormData({
      fullName: "",
      passportNumber: "",
      email: "",
      visaType: "",
      preferredDate: "",
    });
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
              <CardTitle className="text-2xl text-center">
                {isSubmitted ? "Booking Submitted Successfully!" : "Book Your Medical Examination"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="text-center space-y-6">
                  <div className={`${bookingStatus === 'approved' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6`}>
                    <div className={bookingStatus === 'approved' ? 'text-green-800' : 'text-yellow-800'}>
                      <h3 className="text-xl font-semibold mb-2">
                        {bookingStatus === 'approved' ? 'Booking Approved!' : 'Awaiting Approval'}
                      </h3>
                      <p className="mb-4">
                        {bookingStatus === 'approved' 
                          ? 'Your booking has been approved! Please proceed to the medical center on your scheduled date.'
                          : 'Your booking has been submitted and is pending approval from our medical team.'
                        }
                      </p>
                      <div className="text-left space-y-2">
                        <p><strong>Name:</strong> {formData.fullName}</p>
                        <p><strong>Passport Number:</strong> {formData.passportNumber}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Visa Type:</strong> {formData.visaType}</p>
                        <p><strong>Preferred Date:</strong> {formData.preferredDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  {bookingStatus !== 'approved' && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Please keep checking your status:</strong> Use the "Check Status" button below to refresh and see if your booking has been approved. You may need to check periodically as approval times can vary.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={checkBookingStatus}
                      disabled={isRefreshing}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? "Checking..." : "Check Status"}
                    </Button>
                    
                    <Button 
                      onClick={handleNewBooking}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Another Booking
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name as on passport"
                      className="h-12"
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visaType">Visa Type *</Label>
                    <Select 
                      value={formData.visaType} 
                      onValueChange={(value) => handleInputChange("visaType", value)}
                      disabled={isSubmitting}
                    >
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2 flex-1">
              <Mail className="w-5 h-5" />
              <span>info@visamedcheck.com</span>
            </div>
            <Link to="/admin" className="ml-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                <Shield className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              © 2024 Visa Medical Check Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
