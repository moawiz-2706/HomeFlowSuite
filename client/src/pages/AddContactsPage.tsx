import { useMemo } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import SingleContactForm from "@/components/SingleContactForm";
import CSVUploadFlow from "@/components/CSVUploadFlow";

export default function AddContactsPage() {
  const locationId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("locationId") || "";
  }, []);

  if (!locationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto">
            <Info className="h-7 w-7 text-cyan-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Add Contacts</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This page is designed to be embedded inside GoHighLevel. Add it as a Custom Menu Link
            with the <code className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono">?locationId=YOUR_LOCATION_ID</code> parameter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-900">Add Contacts</h1>
        <p className="text-xs text-slate-600 mt-0.5">Add contacts individually or upload a CSV file to bulk import</p>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-hidden px-6 py-3">
        <div className="max-w-full h-full">
          {/* Two Column Layout with Equal Heights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Left Column - Single Contact Form */}
            <div className="flex flex-col">
              <Card className="p-0 border border-slate-300 shadow-sm bg-white flex flex-col h-full rounded-lg overflow-hidden">
                {/* Section Header with Cyan Background */}
                <div className="px-5 py-2.5 bg-cyan-400 flex-shrink-0">
                  <h2 className="text-lg font-bold text-slate-900 bg-cyan-300/70 inline-block px-3 py-1 rounded-md">
                    Add Single Contacts
                  </h2>
                </div>

                {/* Form - Scrollable if needed */}
                <div className="px-5 py-3 overflow-hidden flex-1">
                  <SingleContactForm locationId={locationId} />
                </div>
              </Card>
            </div>

            {/* Right Column - CSV Upload */}
            <div className="flex flex-col">
              <Card className="p-0 border border-slate-300 shadow-sm bg-white flex flex-col h-full rounded-lg overflow-hidden">
                {/* Section Header with Cyan Background */}
                <div className="px-5 py-2.5 bg-cyan-400 flex-shrink-0">
                  <h2 className="text-lg font-bold text-slate-900 bg-cyan-300/70 inline-block px-3 py-1 rounded-md">
                    Upload CSV File
                  </h2>
                </div>

                {/* Content Area */}
                <div className="px-5 py-3 overflow-hidden flex-1 flex flex-col">
                  {/* CSV Upload Requirements */}
                  <div className="mb-3 p-2.5 bg-cyan-50 border border-cyan-200 rounded-lg flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-900 mb-2">CSV file should include:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
                      <div>• First Name</div>
                      <div>• Phone Number</div>
                      <div>• Last Name</div>
                      <div>• Email</div>
                      <div>• Street Address</div>
                      <div>• City</div>
                      <div>• Zip Code</div>
                      <div>• State</div>
                      <div>• # of Dogs</div>
                      <div>• Last Scooped</div>
                    </div>
                  </div>

                  {/* CSV Upload Component - Grows to fill space */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <CSVUploadFlow locationId={locationId} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
