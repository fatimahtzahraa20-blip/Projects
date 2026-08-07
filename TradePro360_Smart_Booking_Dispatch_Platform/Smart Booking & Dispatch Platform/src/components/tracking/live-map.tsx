"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import * as maplibregl from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl";
import type { Engineer, GeoPoint, Job } from "@/types/domain";

interface LiveMapProps {
  job: Job;
  engineer: Engineer | null;
}

function routeData(origin: GeoPoint, destination: GeoPoint): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    },
  };
}

export function LiveMap({ job, engineer }: LiveMapProps) {
  const origin: GeoPoint = engineer?.position ?? job.address;
  const destination: GeoPoint = job.address;
  const isMoving = job.status === "en_route";
  const mapKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const engineerMarkerRef = useRef<Marker | null>(null);
  const [mapError, setMapError] = useState(false);
  const position = origin;
  const initialMarkerPosition = origin;

  useEffect(() => {
    if (!containerRef.current || !mapKey) return;

    setMapError(false);
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "maptiler-streets": {
            type: "raster",
            url: `https://api.maptiler.com/maps/streets-v2/256/tiles.json?key=${mapKey}`,
            tileSize: 256,
            attribution: "© MapTiler © OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "maptiler-streets-layer",
            type: "raster",
            source: "maptiler-streets",
          },
        ],
      },
      center: [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2],
      zoom: 13,
      attributionControl: {},
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", () => {
      map.addSource("job-route", {
        type: "geojson",
        data: routeData(origin, destination),
      });
      map.addLayer({
        id: "job-route-line",
        type: "line",
        source: "job-route",
        paint: {
          "line-color": "#2563eb",
          "line-width": 4,
          "line-opacity": 0.75,
          "line-dasharray": [1.5, 2],
        },
      });

      new maplibregl.Marker({ color: "#18181b" })
        .setLngLat([destination.lng, destination.lat])
        .setPopup(new maplibregl.Popup({ offset: 24 }).setText(job.address.line1))
        .addTo(map);

      if (engineer) {
        engineerMarkerRef.current = new maplibregl.Marker({ color: "#2563eb" })
          .setLngLat([initialMarkerPosition.lng, initialMarkerPosition.lat])
          .setPopup(new maplibregl.Popup({ offset: 24 }).setText(engineer.name))
          .addTo(map);
      }

      const bounds = new maplibregl.LngLatBounds()
        .extend([origin.lng, origin.lat])
        .extend([destination.lng, destination.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 0 });
    });

    map.on("error", () => setMapError(true));

    return () => {
      engineerMarkerRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, [job.id, job.address.line1, mapKey, engineer, origin, destination, initialMarkerPosition]);

  useEffect(() => {
    engineerMarkerRef.current?.setLngLat([position.lng, position.lat]);
    const source = mapRef.current?.getSource("job-route") as GeoJSONSource | undefined;
    source?.setData(routeData(position, destination));
  }, [position, destination]);

  if (!mapKey) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center sm:h-80">
        <div className="max-w-sm">
          <MapPin className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">MapTiler key is missing</p>
          <p className="mt-1 text-xs text-muted-foreground">Add NEXT_PUBLIC_MAPTILER_API_KEY to the environment and restart the app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/80 bg-muted/30">
      <div ref={containerRef} className="h-64 w-full sm:h-80" aria-label="Live technician tracking map" />

      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs shadow-sm backdrop-blur">
        <Navigation className="h-3 w-3 text-primary" />
        {mapError ? "Map unavailable" : isMoving ? "Live GPS" : job.status === "arrived" || job.status === "in_progress" ? "On site" : "Route"}
      </div>
    </div>
  );
}
