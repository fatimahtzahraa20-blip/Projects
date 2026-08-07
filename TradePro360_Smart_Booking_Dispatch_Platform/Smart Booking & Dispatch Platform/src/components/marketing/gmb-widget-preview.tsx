import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GmbWidgetPreview() {
  return (
    <div className="docket p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="eyebrow text-[11px] text-muted-foreground">Google Business Profile</span>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium">4.9</span>
            <span className="text-muted-foreground">(1,204)</span>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground">Book</Badge>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" /> Prefilling: SW1A 1AA, London
      </div>
      <div className="docket-stub mt-3" />
      <p className="mt-3 text-xs text-muted-foreground">
        A tap on <span className="font-medium text-foreground">Book</span> opens your branded booking flow with
        the customer’s location already in place.
      </p>
    </div>
  );
}
