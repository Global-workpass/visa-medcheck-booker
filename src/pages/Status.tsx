import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Status = () => {
  const [searchValue, setSearchValue] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      toast.error("Please enter a passport number or email address");
      return;
    }

    setIsSearching(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`passport_number.eq.${searchValue.trim()},email.eq.${searchValue.trim()}`)
        .maybeSingle();

      if (error) {
        console.error('Error searching booking:', error);
        toast.error("Error searching for booking. Please try again.");
        return;
      }

      setBooking(data);
      setSearched(true);

      if (!data) {
        toast.error("No booking found with this passport number or email");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Booking Status</h1>
            <p className="text-lg text-gray-600">
              Enter your passport number or email address to check the status of your medical examination booking
            </p>
          </div>

          <Card className="shadow-xl mb-8">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                <Search className="w-6 h-6" />
                Status Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchValue">Passport Number or Email Address</Label>
                  <Input
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter your passport number or email address"
                    className="h-12"
                    disabled={isSearching}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isSearching}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Check Status"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Booking Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {booking ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                        <p className="text-lg">{booking.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Visa Type</Label>
                        <p className="text-lg capitalize">{booking.visa_type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Submitted Date</Label>
                        <p className="text-lg">{formatDate(booking.submitted_date)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Preferred Date</Label>
                        <p className="text-lg">{formatDate(booking.preferred_date)}</p>
                      </div>
                    </div>

                    {booking.status === "approved" && booking.appointment_date && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">Appointment Confirmed</span>
                        </div>
                        <p className="text-green-700">
                          Your medical examination is scheduled for {formatDate(booking.appointment_date)}
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Payment successful. Please arrive 15 minutes early with your passport and required documents.
                        </p>
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Pending Approval</span>
                        </div>
                        <p className="text-yellow-700">
                          Your booking is currently under review. You will be notified once it's approved.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 mb-2">No booking found</p>
                    <p className="text-gray-500">
                      Please check your passport number or email address and try again
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;
