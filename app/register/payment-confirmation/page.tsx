"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PaymentConfirmationPage() {
  const router = useRouter()

  const handleResendLink = () => {
    // Handle resend link logic
    console.log("Resending payment link...")
  }

  const handleConfirm = () => {
    // Route to account created page
    router.push("/register/account-created")
  }

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Payment Confirmation */}
      <div className="w-full flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-black">Payment Confirmation</h1>
            <div className="space-y-3">
              <p className="text-gray-600 text-base">Confirmation link sent to Rock Martial Arts</p>
              <p className="text-gray-600 text-base">Payment confirmation is pending, please wait</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Payment Pending</h3>
                <p className="text-yellow-700 text-sm">Awaiting confirmation from administration</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Transaction ID:</span>
                <span className="font-mono text-sm text-gray-800">TXN8478042099</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Amount:</span>
                <span className="font-semibold text-gray-800">₹16,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleResendLink}
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white rounded-xl transition-all duration-200 text-gray-700 font-medium"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>RESEND CONFIRMATION LINK</span>
              </div>
            </Button>
            
            <Button
              onClick={handleConfirm}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl text-lg h-14 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>CONFIRM & CONTINUE</span>
              </div>
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm">5</div>
            </div>
            <span className="text-gray-500 text-sm font-medium">Step 5 of 5 - Payment Confirmation</span>
          </div>

          {/* Help Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 font-medium text-sm">Need Help?</p>
              <p className="text-blue-600 text-xs">Contact our support team if confirmation takes longer than expected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
