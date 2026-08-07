import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = { title: "Book a job" };

export default function BookingPage() {
  return (
    <Suspense>
      <BookingFlow />
    </Suspense>
  );
}
